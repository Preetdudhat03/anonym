const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const Redis = require('ioredis');
const crypto = require('crypto');
const nacl = require('tweetnacl');
const { decodeBase64 } = require('tweetnacl-util');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Redis (Rate Limiting Support)
const redis = new Redis({
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 50, 2000)
});
redis.on('error', (err) => console.log('Redis Error (Ignorable if local):', err.message));

// In-Memory Socket Map (Address -> WS)
const clients = new Map();

// Helper: Verify Ed25519 Signature
function verifySignature(publicKeyBase64, nonceStr, signatureBase64) {
    try {
        const pubKey = decodeBase64(publicKeyBase64);
        const sig = decodeBase64(signatureBase64);
        const msg = new TextEncoder().encode(nonceStr);
        return nacl.sign.detached.verify(msg, sig, pubKey);
    } catch (e) {
        console.error("Sig Verify Error", e.message);
        return false;
    }
}

app.prepare().then(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
        if (request.url.startsWith('/api/ws')) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        }
    });

    wss.on('connection', (ws) => {
        ws.id = uuidv4();
        ws.isAuthed = false;

        // Auto-disconnect if not authed in 10 seconds
        const authTimeout = setTimeout(() => {
            if (!ws.isAuthed) ws.close(4001, "Auth Timeout");
        }, 10000);

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                // --- 1. Request Auth ---
                // Client sends their Public Keys
                if (data.type === 'auth_request') {
                    const { identityPublicKey, encryptionPublicKey } = data; // Base64 strings
                    if (!identityPublicKey || !encryptionPublicKey) return ws.close(4002, "Missing Keys");

                    const nonce = uuidv4();
                    ws.authPending = { identityPublicKey, encryptionPublicKey, nonce };
                    ws.send(JSON.stringify({ type: 'auth_challenge', nonce }));
                    return;
                }

                // --- 2. Solve Challenge ---
                // Client sends Signature(Nonce, PrivKey)
                if (data.type === 'auth_response') {
                    if (!ws.authPending) return ws.close(4003, "No Pending Auth");

                    const { signature } = data;
                    if (!verifySignature(ws.authPending.identityPublicKey, ws.authPending.nonce, signature)) {
                        return ws.close(4004, "Invalid Signature");
                    }

                    // Success!
                    clearTimeout(authTimeout);
                    ws.isAuthed = true;

                    // Compute Address Hash (SHA-256 of Raw PubKey Bytes)
                    // We must reproduce client's hash method exactly.
                    // Client: SHA-256(RawBytes). Server: SHA-256(RawBytes).
                    const rawPub = decodeBase64(ws.authPending.identityPublicKey);
                    const hash = crypto.createHash('sha256').update(rawPub).digest('hex');
                    ws.address = hash;

                    // Register Client
                    clients.set(hash, ws);

                    // --- Short Code Logic (Collision Safe) ---
                    const { generateShortCode } = require('./shortcode');
                    let shortCode = generateShortCode(hash, 0);
                    let inserted = false;
                    let attempts = 0;

                    // Try to insert/upsert. If Short Code conflicts, regen with nonce.
                    // Note: Supabase/Postgres basic upsert doesn't let us specifically catch *which* constraint failed easily in one round-trip logic depending on library.
                    // Strategy:
                    // 1. Check if user exists. If so, keep existing short_code to be stable.
                    // 2. If new, try insert with code. If fail on unique_short_code, retry.

                    // Fetch existing first to prefer stability
                    const { data: existingUser } = await supabase.from('users').select('short_code, abuse_score').eq('public_key_hash', hash).single();

                    if (existingUser) {
                        shortCode = existingUser.short_code;
                    } else {
                        // New User: Loop until unique
                        while (!inserted && attempts < 5) {
                            // Generate Candidate
                            if (attempts > 0) shortCode = generateShortCode(hash, attempts);

                            const { error } = await supabase.from('users').insert({
                                public_key_hash: hash,
                                short_code: shortCode,
                                public_key: ws.authPending.identityPublicKey,
                                encryption_public_key: ws.authPending.encryptionPublicKey,
                                last_seen: new Date()
                            });

                            if (!error) {
                                inserted = true;
                            } else {
                                // Assume collision or error. If collision (23505), retry.
                                if (error.code === '23505') {
                                    console.log(`ShortCode Collision: ${shortCode} (Retry ${attempts + 1})`);
                                    attempts++;
                                } else {
                                    console.error("DB Error", error);
                                    break; // Fatal error
                                }
                            }
                        }
                    }

                    // ENFORCEMENT: Check Ban Status
                    if (existingUser && existingUser.abuse_score >= 5) {
                        console.log(`[Auth Reject] ${hash.slice(0, 8)} is banned (Score: ${existingUser.abuse_score})`);
                        ws.send(JSON.stringify({ type: 'error', message: 'Account suspended due to violations.' }));
                        return ws.close(4003, "Account Suspended");
                    }

                    // If we somehow failed to get a shortcode (e.g. existing user logic fell through or DB error), fallback to hash (shouldn't happen)

                    ws.send(JSON.stringify({
                        type: 'auth_success',
                        address: hash,
                        shortCode: shortCode
                    }));
                    console.log(`[Auth] ${shortCode} (${hash.slice(0, 8)}...) connected`);
                    return;
                }

                // --- 4. Fetch History (Sync) ---
                if (data.type === 'request_history') {
                    if (!ws.isAuthed) return ws.close(4001, "Not Authed");

                    // Fetch messages where receiver = ws.address
                    // Limit to last 50 for performance
                    // Strict Conversation Filter: Only messages between ME and THIS PEER
                    const { targetAddress } = data; // Client MUST send this in request_history now
                    if (!targetAddress) return;

                    const { data: rawHistory, error } = await supabase
                        .from('messages')
                        .select('*')
                        .or(`receiver.eq.${ws.address},sender.eq.${ws.address}`) // Fetch ALL my messages (sent or received)
                        .order('created_at', { ascending: false })
                        .limit(100); // Fetch slightly more to ensure we find the specific chat history

                    if (!error && rawHistory) {
                        // SERVER-SIDE STRICT FILTER (Node.js Logic)
                        // Ensure we ONLY return messages for the specific conversation pair.
                        const filteredHistory = rawHistory.filter(msg => {
                            const isIncoming = (msg.sender === targetAddress && msg.receiver === ws.address);
                            const isOutgoing = (msg.sender === ws.address && msg.receiver === targetAddress);
                            return isIncoming || isOutgoing;
                        });

                        // Send back in reverse order (oldest first)
                        filteredHistory.reverse().forEach(msg => {
                            // Determine if I was sender
                            const isMe = msg.sender === ws.address;

                            // We need to reconstruct the payload for the client to decrypt
                            // We stored { ephemeralPublicKey, iv } in 'encrypted_session_key' column
                            let meta = {};
                            try { meta = JSON.parse(msg.encrypted_session_key); } catch (e) { }

                            ws.send(JSON.stringify({
                                type: 'message',
                                sender: msg.sender,
                                receiver: msg.receiver, // Add Receiver field for client filtering
                                payload: {
                                    ciphertext: msg.ciphertext,
                                    ephemeralPublicKey: meta.ephemeralPublicKey,
                                    iv: meta.iv,
                                    timestamp: msg.created_at,
                                    isHistory: true // Flag to tell client not to notify/sound
                                }
                            }));
                        });
                    }
                }

                // --- 5. Route Encrypted Packet ---
                if (data.type === 'message') {
                    if (!ws.isAuthed) return ws.close(4001, "Not Authed");

                    const { targetAddress, payload } = data;
                    // Payload contains { ephemeralPublicKey, iv, ciphertext, expiresAt }

                    // A. Enforce Expiration Cap (Max 24h)
                    const clientExpiry = new Date(payload.expires_at || Date.now() + 86400000);
                    const maxExpiry = new Date(Date.now() + 86400000);
                    const finalExpiry = clientExpiry > maxExpiry ? maxExpiry : clientExpiry;

                    // B. Store Blob (Blind Relay)
                    // We store the Whole Payload JSON object as 'ciphertext' text column to simplify schema
                    // Or we split it. Schema says 'ciphertext', 'encrypted_session_key' etc.
                    // Let's adapt to existing schema:
                    // schema: ciphertext, encrypted_session_key.
                    // New Packet: { ephemeralPublicKey, iv, ciphertext }. All are needed for decryption.
                    // We can pack {ephemeralPublicKey, iv} into `encrypted_session_key` column since that's just a text field.

                    const packedMeta = JSON.stringify({
                        ephemeralPublicKey: payload.ephemeralPublicKey,
                        iv: payload.iv
                    });

                    await supabase.from('messages').insert({
                        sender: ws.address,
                        receiver: targetAddress,
                        ciphertext: payload.ciphertext,
                        encrypted_session_key: packedMeta,
                        expires_at: finalExpiry.toISOString()
                    });

                    // C. Live Relay (If Online)
                    const recipient = clients.get(targetAddress);
                    if (recipient && recipient.readyState === 1) {
                        // Artificial Delay for Metadata Obfuscation
                        setTimeout(() => {
                            recipient.send(JSON.stringify({
                                type: 'message',
                                sender: ws.address, // We reveal SENDER Address
                                payload: {
                                    ciphertext: payload.ciphertext,
                                    // Expand packed meta back for client convenience?
                                    // Client expects packet structure.
                                    ephemeralPublicKey: payload.ephemeralPublicKey,
                                    iv: payload.iv,
                                    timestamp: new Date()
                                }
                            }));
                        }, Math.random() * 200 + 50); // 50-250ms Delay
                    }
                }

                if (data.type === 'report_abuse') {
                    if (!ws.isAuthed) return ws.close(4001, "Not Authed");

                    const { reportedAddress, reason } = data;
                    if (!reportedAddress || !reason) return;

                    // 1. Log Report
                    await supabase.from('abuse_reports').insert({
                        reporter_hash: ws.address,
                        reported_hash: reportedAddress,
                        reason: reason
                    });

                    // 2. Increment Abuse Score & Enforce Ban
                    const { data: userData } = await supabase.from('users').select('abuse_score').eq('public_key_hash', reportedAddress).single();

                    if (userData) {
                        const newScore = (userData.abuse_score || 0) + 1;
                        await supabase.from('users').update({ abuse_score: newScore }).eq('public_key_hash', reportedAddress);

                        console.log(`[Abuse] ${reportedAddress.slice(0, 8)} score: ${newScore}`);

                        // 3. IMMEDIATE ACTION: Shadowban / Kick
                        // Threshold 3: Warning/Disconnect (Soft)
                        // Threshold 5: Ban (Hard)
                        if (newScore >= 5) {
                            const reportedSocket = clients.get(reportedAddress);
                            if (reportedSocket) {
                                reportedSocket.send(JSON.stringify({ type: 'error', message: 'Account suspended due to abuse reports.' }));
                                reportedSocket.close(4003, "Account Suspended");
                                clients.delete(reportedAddress);
                                console.log(`[BANNED] Kicked user ${reportedAddress.slice(0, 8)}`);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("WS Error", e);
                // Don't close immediately on minor JSON errors, but log.
            }
        });

        ws.on('close', () => {
            if (ws.address) clients.delete(ws.address);
        });
    });

    server.listen(3000, (err) => {
        if (err) {
            console.error("❌ Failed to start server:", err);
            if (err.code === 'EADDRINUSE') {
                console.error("👉 Port 3000 is already in use. Close other instances or use a different port.");
            }
            process.exit(1);
        }
        console.log('> Server Ready on http://localhost:3000 (Ed25519 Mode)');

        // TTL Cleaner (Every 60s)
        setInterval(async () => {
            const { error } = await supabase.from('messages').delete().lt('expires_at', new Date().toISOString());
            if (error) console.error("TTL Error", error);
        }, 60000);
    });
}).catch((err) => {
    console.error("❌ Next.js App Preparation Failed:", err);
    process.exit(1);
});

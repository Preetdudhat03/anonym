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
const redisUrl = process.env.REDIS_URL;
const redis = redisUrl
    ? new Redis(redisUrl, {
        lazyConnect: true,
        retryStrategy: (times) => Math.min(times * 50, 2000)
    })
    : new Redis({
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

    // --- Schema Verification (Dev Mode Helper) ---
    // Checks if the 'ciphertext_sender' column exists to prevent "vanishing messages" bug.
    (async () => {
        const { error } = await supabase.from('messages').select('ciphertext_sender').limit(1);
        if (error && error.message.includes('column "ciphertext_sender" does not exist')) {
            console.error("\n\n🔴 CRITICAL ERROR: Database Migration Missing 🔴");
            console.error("The 'messages' table is missing the 'ciphertext_sender' column.");
            console.error("Sender history WILL NOT be saved until you run the migration.");
            console.error("👉 Run 'db/migrations/01_add_sender_encryption.sql' in your Supabase SQL Editor.\n\n");
        } else if (error) {
            console.warn("Schema Check Warning:", error.message);
        } else {
            console.log("✅ Database Schema: Verified (Sender Self-Encryption Enabled)");
        }
    })();

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

                    // Fetch messages where receiver = ws.address OR sender = ws.address
                    const { targetAddress } = data;
                    if (!targetAddress) return;

                    const { data: rawHistory, error } = await supabase
                        .from('messages')
                        .select('*')
                        .or(`receiver.eq.${ws.address},sender.eq.${ws.address}`)
                        .order('created_at', { ascending: false })
                        .limit(100);

                    if (!error && rawHistory) {
                        // SERVER-SIDE STRICT FILTER per Conversation
                        const filteredHistory = rawHistory.filter(msg => {
                            const isIncoming = (msg.sender === targetAddress && msg.receiver === ws.address);
                            const isOutgoing = (msg.sender === ws.address && msg.receiver === targetAddress);
                            return isIncoming || isOutgoing;
                        });

                        // Send back in reverse order (oldest first)
                        filteredHistory.reverse().forEach(msg => {
                            const isMe = msg.sender === ws.address;

                            // Determine which payload to send based on ownership
                            let rawMeta = isMe ? msg.encrypted_session_key_sender : msg.encrypted_session_key;
                            let rawCiphertext = isMe ? msg.ciphertext_sender : msg.ciphertext;

                            // Fallback for legacy messages (if sender copy doesn't exist)
                            // If I am sender but no sender-copy exists, I can't decrypt the receiver copy.
                            // We send nothing or a marker. Sending receiver copy will just cause decryption error.
                            if (isMe && !rawCiphertext) {
                                // Skip or send marker? Let's skip to keep UI clean.
                                // Or send a dummy to show "Message Sent (Encrypted)" placeholder?
                                // Let's send the receiver copy anyway so the client shows *something* (even if undecryptable)
                                // This maintains timeline consistency.
                                rawCiphertext = msg.ciphertext;
                                rawMeta = msg.encrypted_session_key;
                            }

                            let meta = {};
                            try { meta = JSON.parse(rawMeta); } catch (e) { }

                            ws.send(JSON.stringify({
                                type: 'message',
                                sender: msg.sender,
                                receiver: msg.receiver,
                                payload: {
                                    ciphertext: rawCiphertext,
                                    ephemeralPublicKey: meta.ephemeralPublicKey,
                                    iv: meta.iv,
                                    timestamp: msg.created_at,
                                    isHistory: true
                                }
                            }));
                        });
                    }
                }

                // --- 5. Route Encrypted Packet ---
                if (data.type === 'message') {
                    if (!ws.isAuthed) return ws.close(4001, "Not Authed");

                    const { targetAddress, payload, payloadSelf } = data;
                    // payload: For Recipient
                    // payloadSelf: For Sender (Optional but expected now)

                    // A. Enforce Expiration Cap (Max 24h)
                    const clientExpiry = new Date(payload.expires_at || Date.now() + 86400000);
                    const maxExpiry = new Date(Date.now() + 86400000);
                    const finalExpiry = clientExpiry > maxExpiry ? maxExpiry : clientExpiry;

                    // B. Pack Metadata
                    const packedMetaReceiver = JSON.stringify({
                        ephemeralPublicKey: payload.ephemeralPublicKey,
                        iv: payload.iv
                    });

                    let packedMetaSender = null;
                    let ciphertextSender = null;

                    if (payloadSelf) {
                        packedMetaSender = JSON.stringify({
                            ephemeralPublicKey: payloadSelf.ephemeralPublicKey,
                            iv: payloadSelf.iv
                        });
                        ciphertextSender = payloadSelf.ciphertext;
                    }

                    try {
                        const { error: insertError } = await supabase.from('messages').insert({
                            sender: ws.address,
                            receiver: targetAddress,
                            ciphertext: payload.ciphertext,
                            encrypted_session_key: packedMetaReceiver,

                            // New Columns for Self-Encryption
                            ciphertext_sender: ciphertextSender,
                            encrypted_session_key_sender: packedMetaSender,

                            expires_at: finalExpiry.toISOString()
                        });

                        if (insertError) {
                            console.error("❌ DB Insert Failed:", insertError.message, insertError.details);
                        }
                    } catch (dbErr) {
                        console.error("❌ DB Exception:", dbErr.message);
                    }

                    // C. Live Relay (If Online)
                    const recipient = clients.get(targetAddress);
                    if (recipient && recipient.readyState === 1) {
                        setTimeout(() => {
                            recipient.send(JSON.stringify({
                                type: 'message',
                                sender: ws.address,
                                payload: {
                                    ciphertext: payload.ciphertext,
                                    ephemeralPublicKey: payload.ephemeralPublicKey,
                                    iv: payload.iv,
                                    timestamp: new Date()
                                }
                            }));
                        }, Math.random() * 200 + 50);
                    }

                    // Note: We don't echo back to sender via WS because client optimistically updates UI.
                    // But if client refreshes, they will get the `ciphertext_sender` from history logic above.
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

    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
        if (err) {
            console.error("❌ Failed to start server:", err);
            if (err.code === 'EADDRINUSE') {
                console.error(`👉 Port ${port} is already in use. Close other instances or use a different port.`);
            }
            process.exit(1);
        }
        console.log(`> Server Ready on http://localhost:${port} (Ed25519 Mode)`);

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

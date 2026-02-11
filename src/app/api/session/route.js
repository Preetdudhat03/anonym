
import { createClient } from '@supabase/supabase-js';
import nacl from 'tweetnacl';
import { decodeBase64 } from 'tweetnacl-util';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We need the SERVICE_ROLE key to delete user data without RLS issues, 
// or at least a key with proper permissions. 
// Assuming NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY works or we need a secret key.
// Usually for destructive admin-like actions or global wipes, a service role key is better.
// However, the `server.js` uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
// If the DB has RLS, that key might only allow operations on "own" data.
// But we are identifying "own" data by address.
// Let's stick to what server.js uses, but if it fails we might need the service key if available.
// server.js checks `process.env.SUPABASE_SERVICE_KEY`? No, it uses `process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
// I'll stick to that.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Note: In a real prod env, better to use a secret service role key for backend ops 
// to ensure we bypass RLS if the user isn't strictly "authenticated" via Supabase Auth 
// but via our custom crypto auth. 
// If RLS is set up to strictly rely on Supabase Auth JWT, this might fail.
// But server.js seems to write messages fine.
const supabase = createClient(supabaseUrl, supabaseKey);

export async function DELETE(request) {
    try {
        const authHeader = request.headers.get('authorization');
        // Expected format: "Signature <base64_sig> Public-Key <base64_pub> Timestamp <ts>"
        // Simplified custom headers for clarity:
        const signature = request.headers.get('x-signature');
        const publicKey = request.headers.get('x-identity-pub');
        const timestamp = request.headers.get('x-timestamp');

        if (!signature || !publicKey || !timestamp) {
            return NextResponse.json({ error: 'Missing auth headers' }, { status: 401 });
        }

        // Prevent replay attacks (simple 5m window)
        const now = Date.now();
        const ts = parseInt(timestamp, 10);
        if (isNaN(ts) || Math.abs(now - ts) > 5 * 60 * 1000) {
            return NextResponse.json({ error: 'Request expired' }, { status: 401 });
        }

        // Verify Signature
        // Data signed: "DELETE_SESSION:" + timestamp
        const msgStr = `DELETE_SESSION:${timestamp}`;
        const msgBytes = new TextEncoder().encode(msgStr);
        const sigBytes = decodeBase64(signature);
        const pubBytes = decodeBase64(publicKey);

        const verified = nacl.sign.detached.verify(msgBytes, sigBytes, pubBytes);

        if (!verified) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // Compute ID of requester
        const requesterAddress = crypto.createHash('sha256').update(pubBytes).digest('hex');

        // Check for specific peer target (optional but recommended for precision)
        const { searchParams } = new URL(request.url);
        const peerAddress = searchParams.get('peerAddress');

        console.log(`[Session API] Deleting conversation: ${requesterAddress.slice(0, 8)} <-> ${peerAddress ? peerAddress.slice(0, 8) : 'ALL'}`);

        let query = supabase.from('messages').delete();

        if (peerAddress) {
            // Delete ONLY messages between these two
            // (sender = A AND receiver = B) OR (sender = B AND receiver = A)
            // Supabase postgrest filter for complex OR is tricky. 
            // .or(`and(sender.eq.${requesterAddress},receiver.eq.${peerAddress}),and(sender.eq.${peerAddress},receiver.eq.${requesterAddress})`)
            query = query.or(`and(sender.eq.${requesterAddress},receiver.eq.${peerAddress}),and(sender.eq.${peerAddress},receiver.eq.${requesterAddress})`);
        } else {
            // Fallback: Delete ALL messages involving the requester (Session Wipe)
            // But user asked to "not delete user account".
            // If no peer specified, maybe we shouldn't proceed? 
            // Current client implementation below will be updated to send peerAddress.
            // Safe fallback: Delete all messages for this user.
            query = query.or(`sender.eq.${requesterAddress},receiver.eq.${requesterAddress}`);
        }

        const { error: msgError } = await query;

        if (msgError) {
            console.error("Failed to delete messages:", msgError);
            return NextResponse.json({ error: 'Database partial failure' }, { status: 500 });
        }

        // MOVED: We do NOT delete the user account anymore per request.

        return NextResponse.json({ success: true, message: 'Conversation deleted' });

    } catch (e) {
        console.error("Session Delete Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

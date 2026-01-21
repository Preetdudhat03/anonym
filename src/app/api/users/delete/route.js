import { createClient } from '@supabase/supabase-js';
import nacl from 'tweetnacl';
import { decodeBase64 } from 'tweetnacl-util';
import crypto from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();
        const { publicKey, signature, timestamp } = body;

        if (!publicKey || !signature || !timestamp) {
            return Response.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Validate Timestamp (Prevent Replay Attacks > 5 mins old)
        const now = Date.now();
        if (Math.abs(now - timestamp) > 300000) { // 5 minutes tolerance
            return Response.json({ error: 'Request expired' }, { status: 400 });
        }

        // 2. Verify Signature
        // Message format: "DELETE_ACCOUNT:<TIMESTAMP>"
        const msgStr = `DELETE_ACCOUNT:${timestamp}`;
        const msgBytes = new TextEncoder().encode(msgStr);
        const sigBytes = decodeBase64(signature);
        const pubBytes = decodeBase64(publicKey);

        if (!nacl.sign.detached.verify(msgBytes, sigBytes, pubBytes)) {
            return Response.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // 3. Compute Hash to find User (SHA-256 of Raw PubKey)
        const addressHash = crypto.createHash('sha256').update(pubBytes).digest('hex');

        // 4. Delete from DB
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('public_key_hash', addressHash);

        if (error) {
            console.error("Supabase Deletion Error:", error);
            return Response.json({ error: 'Database deletion failed' }, { status: 500 });
        }

        return Response.json({ success: true, deletedAddress: addressHash });

    } catch (e) {
        console.error("Delete API Error:", e);
        return Response.json({ error: 'Server validation error' }, { status: 500 });
    }
}

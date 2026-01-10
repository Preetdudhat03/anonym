import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

export async function GET(request, { params }) {
    // 1. Get Code
    const { code } = await params;
    const cleanCode = code.toUpperCase().trim();

    // 2. Strict Exact Lookup
    // NO LIKE, NO Prefix.
    const { data, error } = await supabase
        .from('users')
        .select('public_key_hash, encryption_public_key')
        .eq('short_code', cleanCode)
        .single();

    if (error || !data) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Return Real Crypto Identity
    return new Response(JSON.stringify({
        address: data.public_key_hash,
        encryptionPublicKey: data.encryption_public_key
    }), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    });
}

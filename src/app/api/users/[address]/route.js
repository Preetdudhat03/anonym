import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

export async function GET(request, { params }) {
    const { address } = await params;

    const { data, error } = await supabase
        .from('users')
        .select('encryption_public_key')
        .eq('public_key_hash', address)
        .single();

    if (error || !data) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return new Response(JSON.stringify({ encryptionPublicKey: data.encryption_public_key }), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Content-Type': 'application/json'
        }
    });
}
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS'
        }
    });
}

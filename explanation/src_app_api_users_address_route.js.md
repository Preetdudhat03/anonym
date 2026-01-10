File: s:\anonym\src\app\api\users\[address]\route.js

Overview:
This is a standard Next.js API Route (Server-Side). It acts as a public phonebook lookup. Since we need to encrypt messages *before* sending them, we need to ask the server: "What is the Encryption Public Key for User X?". This endpoint answers that question.

Detailed Line-by-Line Explanation:

1: import { createClient } from '@supabase/supabase-js';
Reason: Import Supabase client to talk to the database.

3: const supabase = createClient(
4:     process.env.NEXT_PUBLIC_SUPABASE_URL,
5:     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
6: );
Reason: Initialize Supabase. Note: Using the public key key is fine here because we are only reading public data (Row Level Security on DB usually prevents sensitive writes, though here we are server-side so we could use a service role key if needed, but public data is public).

8: export async function GET(request, { params }) {
9:     const { address } = await params;
Reason: Extract the requested address from the URL.

11:     const { data, error } = await supabase
12:         .from('users')
13:         .select('encryption_public_key')
14:         .eq('public_key_hash', address)
15:         .single();
Reason: Query the 'users' table. Find the row where 'public_key_hash' matches the requested address. Select ONLY the 'encryption_public_key'.

17:     if (error || !data) {
18:         return Response.json({ error: 'User not found' }, { status: 404 });
19:     }
Reason: If no user found, return 404.

21:     return new Response(JSON.stringify({ encryptionPublicKey: data.encryption_public_key }), {
Reason: Return the key as JSON. Note: We do NOT return the 'short_code' or other metadata here to keep it minimal, just what's needed for crypto.

30: export async function OPTIONS() {
Reason: Handle Preflight CORS requests. This allows this API to be called from other domains if we wanted (though currently it's same-origin).

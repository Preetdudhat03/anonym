File: s:\anonym\src\app\api\code\[code]\route.js

Overview:
This API route resolves "Friend Codes" (Short Codes) into full cryptographic addresses. When a user types "AX9K...", the frontend calls this endpoint to find out the real hex address of the destination.

Detailed Line-by-Line Explanation:

8: export async function GET(request, { params }) {
9:     // 1. Get Code
10:     const { code } = await params;
11:     const cleanCode = code.toUpperCase().trim();
Reason: Get the code from URL. Normalize it (force Uppercase) because our codes are stored uppercase, and we want to be case-insensitive for user input.

15:     const { data, error } = await supabase
16:         .from('users')
17:         .select('public_key_hash, encryption_public_key')
18:         .eq('short_code', cleanCode)
19:         .single();
Reason: Query the database to find the user with this 'short_code'.

26:     return new Response(JSON.stringify({
27:         address: data.public_key_hash,
28:         encryptionPublicKey: data.encryption_public_key
29:     }), {
Reason: Return BOTH the full address (Hash) and the Encryption Key. This saves the frontend from having to make a second call to `/api/users/[address]` immediately after resolving the code. Optimization.

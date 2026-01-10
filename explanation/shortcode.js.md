File: s:\anonym\shortcode.js

Overview:
This file contains the logic to generating user-friendly "Friend Codes" (Short Codes) from their long, complex cryptographic hash addresses. The goal is to create a code like "AX9K-2P8Q-LR7M" that is easier to share than a 64-character hex string, while remaining mathematically linked to their identity.

Detailed Line-by-Line Explanation:

1: const crypto = require('crypto');
Reason: Import Node.js crypto library to perform SHA-256 hashing.

3: // Standard Base32 Alphabet (RFC 4648)
4: const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
Reason: Define the characters allowed in our short code. Base32 is chosen because it avoids ambiguous characters like 'I', '1', '0', 'O', making it human-readable.

6: function toBase32(buffer) {
Reason: Define a helper function to convert raw binary data (Buffer) into a Base32 string.

7:     let bits = 0;
8:     let value = 0;
9:     let output = '';
Reason: Initialize variables to act as a "sliding window" or buffer for bit manipulation. We need to regroup bits from 8-bit bytes into 5-bit chunks (since 2^5 = 32).

11:     for (let i = 0; i < buffer.length; i++) {
Reason: Loop through every byte of the input buffer.

12:         value = (value << 8) | buffer[i];
Reason: Shift existing bits left by 8 and add the new byte. We are building a long integer stream of bits.

13:         bits += 8;
Reason: Keep track of how many valid bits we currently have in 'value'.

15:         while (bits >= 5) {
Reason: As long as we have at least 5 bits (enough for one Base32 character), extract them.

16:             output += ALPHABET[(value >>> (bits - 5)) & 31];
Reason: Shift 'value' right to isolate the top 5 bits. '& 31' (binary 11111) ensures we strictly take only 5 bits. Use this number as an index to pick a letter from ALPHABET.

17:             bits -= 5;
Reason: We used 5 bits, so decrease the count.

21:     if (bits > 0) {
22:         output += ALPHABET[(value << (5 - bits)) & 31];
23:     }
Reason: Handle any leftover bits at the end. Shift them to align correctly and convert the final chunk.

25:     return output;
Reason: Return the resulting Base32 string.

28: /**
29:  * Generates a Short Code from a Public Key Hash (Hex Address)
...
36: function generateShortCode(addressHex, nonce = 0) {
Reason: Main export function. Takes the user's full address (hex string) and an optional 'nonce' (number) to handle potential collisions (though rare).

39:     const input = addressHex + (nonce > 0 ? `_${nonce}` : '');
Reason: Create a unique input string. If this is a retry (nonce > 0), we append the nonce so the hash changes.

40:     const hash = crypto.createHash('sha256').update(input).digest();
Reason: Hash the input using SHA-256. This ensures the output is seemingly random but deterministic. We need randomness distribution so codes are spread out.

44:     const truncated = hash.slice(0, 8); // 64 bits
Reason: We don't need the huge 256-bit hash. We slice the first 8 bytes (64 bits). This allows for enough entropy for unique codes while keeping it short.
Reasoning for 64 bits: Base32 encoding uses 5 bits per char. A 12-char code requires 60 bits (12 * 5). 64 bits is the closest byte-aligned size covering that.

48:     const fullCode = toBase32(truncated);
Reason: Convert those 8 bytes into a Base32 string.

49:     const code12 = fullCode.slice(0, 12);
Reason: Take strictly the first 12 characters. This gives us our desired length.

52:     return `${code12.slice(0, 4)}-${code12.slice(4, 8)}-${code12.slice(8, 12)}`;
Reason: Format the string with dashes (e.g., AAAA-BBBB-CCCC) to make it easier for humans to read and type.

55: module.exports = { generateShortCode };
Reason: Export the function so 'server.js' can use it.

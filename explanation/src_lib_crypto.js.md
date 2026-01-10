File: s:\anonym\src\lib\crypto.js

Overview:
This file implements the "Senior Secure Crypto Module". It is the security core of the application, running entirely in the browser (client-side). It handles key generation, hashing, and the complex encryption/decryption of messages using standard cryptographic primitives (Ed25519, X25519, AES-GCM, SHA-256).

Detailed Line-by-Line Explanation:

12: import nacl from 'tweetnacl';
Reason: Import TweetNaCl (JavaScript implementation of NaCl). It is a highly trusted library for high-speed cryptography, specifically for Elliptic Curve operations (Ed25519, X25519).

13: import { encodeBase64, decodeBase64 } from 'tweetnacl-util';
Reason: Import helpers to convert between raw binary arrays (Uint8Array) and Base64 strings, which is how we store keys in the database.

17: export const toBase64 = (uint8Arr) => encodeBase64(uint8Arr);
Reason: Export a wrapper for Base64 encoding to keep our API clean.

18: export const fromBase64 = (str) => decodeBase64(str);
Reason: Export wrapper for Base64 decoding.

20: export const toHex = (buffer) => {
Reason: Define a helper to convert a binary buffer to a Hexadecimal string (e.g., "a3f9...").

21:   return Array.from(new Uint8Array(buffer))
22:     .map(x => x.toString(16).padStart(2, '0'))
23:     .join('');
Reason: Convert each byte to a 2-char hex code and join them.

26: export const fromHex = (hexString) => {
Reason: Define a helper to convert a Hex string back to binary.

27:   return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
Reason: Split the string into 2-char chunks and parse each as a hex number.

32: export function generateIdentityKeyPair() {
33:   return nacl.sign.keyPair();
34: }
Reason: Generate an Ed25519 Keypair. This is used for IDENTITY (Signing/Auth), not encryption. It allows the user to prove "I am who I say I am".

39: export async function computeAddress(publicKeyUint8) {
Reason: Define how we calculate a user's "Address".

40:   const hashBuffer = await window.crypto.subtle.digest('SHA-256', publicKeyUint8);
Reason: Use the browser's native Web Crypto API to hash the public key with SHA-256.

41:   return toHex(hashBuffer);
Reason: Return the hex representation of that hash.

44: export function signChallenge(privateKey, dataString) {
Reason: Define a function to sign a piece of text (like a login challenge).

45:   const data = new TextEncoder().encode(dataString);
Reason: Convert string to bytes.

46:   return nacl.sign.detached(data, privateKey);
Reason: Sign the data using the Ed25519 private key. "Detached" means we get just the signature, not the message+signature combined.

51: export function generateEncryptionKeyPair() {
52:   return nacl.box.keyPair();
53: }
Reason: Generate an X25519 Keypair. This is used for ENCRYPTION (Diffie-Hellman), to securely share secrets.

57: async function deriveAesKey(sharedSecret) {
Reason: Internal helper to turn a "Shared Secret" (from Diffie-Hellman) into a usable AES encryption key.

59:   const keyMaterial = await window.crypto.subtle.importKey(
60:     'raw', sharedSecret, { name: 'HKDF' }, false, ['deriveKey']
61:   );
Reason: Import the raw secret bytes into the Web Crypto API as key material for HKDF.

71:   return await window.crypto.subtle.deriveKey(
Reason: Use HKDF (HMAC-based Key Derivation Function) to derive a strong AES-GCM key.

76:       info: enc.encode('anonym_v1_aes')
Reason: The 'info' parameter binds this key to our specific protocol version ("anonym_v1_aes"). This prevents key confusion attacks.

88: function padMessage(plaintext) {
Reason: Implement ISO 7816-4 Padding. This hides the exact length of the message by padding it to a fixed block size.

94:   const bucketSize = 512;
Reason: Define the block size. Every message will be a multiple of 512 bytes. A 10-byte message and a 400-byte message will both look like 512 bytes on the wire.

95:   const targetLen = Math.ceil((raw.length + 1) / bucketSize) * bucketSize;
Reason: Calculate the next multiple of 512 that fits the message + 1 delimiter byte.

99:   padded[raw.length] = 0x80; // Delimiter
Reason: Add the 0x80 byte (10000000 binary) to mark the end of the real message. Everything after this is 0x00.

104: function unpadMessage(paddedBuffer) {
Reason: Function to remove the padding after decryption.

111:   for (let i = paddedBuffer.length - 1; i >= 0; i--) {
112:     if (paddedBuffer[i] === 0x80) {
Reason: Scan backwards to find the 0x80 delimiter.

127:   return new TextDecoder().decode(paddedBuffer.slice(0, idx));
Reason: Decode everything before the delimiter as the original text.

136: export async function encryptMessage(receiverPubBase64, plaintext) {
Reason: Main encryption function. Sends a message to a recipient.

137:   const receiverPub = fromBase64(receiverPubBase64);
Reason: Decode receiver's public key.

140:   const ephemeral = nacl.box.keyPair();
Reason: Generate a BRAND NEW keypair just for this one message ("Ephemeral Key"). This ensures "Forward Secrecy" for this half of the exchange.

144:   const sharedSecret = nacl.scalarMult(ephemeral.secretKey, receiverPub);
Reason: Perform Diffie-Hellman (ECDH) between our Ephemeral Private Key and their Static Public Key. This creates a secret only we and they know.

147:   const aesKey = await deriveAesKey(sharedSecret);
Reason: Turn that secret into an AES key.

151:   const encodedPlaintext = padMessage(plaintext);
Reason: Pad the message.

153:   const iv = window.crypto.getRandomValues(new Uint8Array(12));
Reason: Generate a random 12-byte Initialization Vector (IV). Required for AES-GCM security. Never reuse an IV with the same key (though here we change keys every time anyway).

155:   const ciphertextBuffer = await window.crypto.subtle.encrypt(
Reason: Encrypt the padded data using AES-GCM.

164:   return {
165:     ephemeralPublicKey: toBase64(ephemeral.publicKey),
166:     iv: toBase64(iv),
167:     ciphertext: toBase64(new Uint8Array(ciphertextBuffer))
168:   };
Reason: Return the package. We MUST send our Ephemeral Public Key so the receiver can do the math to reproduce the shared secret.

171: export async function decryptMessage(myEncryptionPrivateBase64, packet) {
Reason: Main decryption function.

176:   const sharedSecret = nacl.scalarMult(myPriv, ephemeralPub);
Reason: Perform Diffie-Hellman: My Private Key * Their Ephemeral Public Key. This results in the SAME shared secret as the sender calculated.

183:     const decryptedBuffer = await window.crypto.subtle.decrypt(
Reason: Decrypt using the derived AES key.

189:     return unpadMessage(new Uint8Array(decryptedBuffer));
Reason: Remove padding to get the original text.

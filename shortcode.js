const crypto = require('crypto');

// Standard Base32 Alphabet (RFC 4648)
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function toBase32(buffer) {
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
        value = (value << 8) | buffer[i];
        bits += 8;

        while (bits >= 5) {
            output += ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }

    if (bits > 0) {
        output += ALPHABET[(value << (5 - bits)) & 31];
    }

    return output;
}

/**
 * Generates a Short Code from a Public Key Hash (Hex Address)
 * Spec: Base32( Truncate( SHA-256(address), 60 bits ) )
 * 
 * @param {string} addressHex - The full 256-bit hex address
 * @param {number} nonce - Optional nonce for collision resolution
 * @returns {string} Formatted code (e.g. "AX9K-2P8Q-LR7M")
 */
function generateShortCode(addressHex, nonce = 0) {
    // 1. Hash the Address (again) to decouple from identity slightly 
    // AND allow nonce for collision handling.
    const input = addressHex + (nonce > 0 ? `_${nonce}` : '');
    const hash = crypto.createHash('sha256').update(input).digest();

    // 2. Truncate to 8 bytes (64 bits) - slightly more than 60 but cleaner for buffers
    // We only need 12 Base32 chars * 5 bits = 60 bits from it.
    const truncated = hash.slice(0, 8); // 64 bits

    // 3. Base32 Encode
    // 8 bytes (64 bits) -> 12.8 Base32 chars. We take first 12.
    const fullCode = toBase32(truncated);
    const code12 = fullCode.slice(0, 12);

    // 4. Format (XXXX-XXXX-XXXX)
    return `${code12.slice(0, 4)}-${code12.slice(4, 8)}-${code12.slice(8, 12)}`;
}

module.exports = { generateShortCode };

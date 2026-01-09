/**
 * Senior Secure Crypto Module
 * 
 * Primitives:
 * - Ed25519 (Signing) via tweetnacl
 * - X25519 (Diffie-Hellman) via tweetnacl
 * - AES-GCM-256 (Encryption) via Web Crypto API
 * - SHA-256 (Hashing) via Web Crypto API
 * - HKDF (Key Derivation) via Web Crypto API
 */

import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

// --- Encoding Utilities ---

export const toBase64 = (uint8Arr) => encodeBase64(uint8Arr);
export const fromBase64 = (str) => decodeBase64(str);

export const toHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
};

export const fromHex = (hexString) => {
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};

// --- 1. Identity (Ed25519) ---

export function generateIdentityKeyPair() {
  return nacl.sign.keyPair();
}

/**
 * Computes Address = SHA-256(Ed25519 Public Key Bytes)
 */
export async function computeAddress(publicKeyUint8) {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', publicKeyUint8);
  return toHex(hashBuffer);
}

export function signChallenge(privateKey, dataString) {
  const data = new TextEncoder().encode(dataString);
  return nacl.sign.detached(data, privateKey);
}

// --- 2. Encryption Identity (X25519) ---

export function generateEncryptionKeyPair() {
  return nacl.box.keyPair();
}

// --- 3. Key Derivation (HKDF) ---

async function deriveAesKey(sharedSecret) {
  // Import the shared secret (raw bytes) as a key for HKDF
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    sharedSecret,
    { name: 'HKDF' },
    false,
    ['deriveKey']
  );

  // Derive AES-GCM-256 Key
  // Salt is empty (standard for this ephemeral exchange)
  // Info binds to protocol version
  const enc = new TextEncoder();
  return await window.crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array([]),
      info: enc.encode('anonym_v1_aes')
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, // Key not extractable
    ['encrypt', 'decrypt']
  );
}

// --- 4. Core Messaging Logic ---

// Helper: ISO 7816-4 Padding (0x80 followed by 0x00s)
function padMessage(plaintext) {
  const enc = new TextEncoder();
  const raw = enc.encode(plaintext);

  // Bucket Size: 512 Bytes
  // Formula: Closest multiple of 512 that can fit raw + 1 byte delimiter
  const bucketSize = 512;
  const targetLen = Math.ceil((raw.length + 1) / bucketSize) * bucketSize;

  const padded = new Uint8Array(targetLen);
  padded.set(raw);
  padded[raw.length] = 0x80; // Delimiter
  // Remaining bytes are already 0
  return padded;
}

function unpadMessage(paddedBuffer) {
  // Scan from end for 0x80
  // In ISO 7816-4, valid padding must contain 0x80. 
  // If not found, it's invalid or empty.

  // We scan backwards
  let idx = -1;
  for (let i = paddedBuffer.length - 1; i >= 0; i--) {
    if (paddedBuffer[i] === 0x80) {
      idx = i;
      break;
    }
    if (paddedBuffer[i] !== 0x00) {
      // Found non-zero byte after purported padding? 
      // Technically invalid if we strictly follow standard, but AES-GCM ensures nobody tampered.
      // So this must be part of message if we didn't find 0x80 yet?
      // Actually, if we hit non-zero before 0x80, it's not ISO padding.
      // But we created it, so it should be correct.
    }
  }

  if (idx === -1) throw new Error("Invalid Padding");

  return new TextDecoder().decode(paddedBuffer.slice(0, idx));
}

/**
 * Encrypts a message for a Receiver (Public X25519 Key).
 * 
 * flow:
 * Ephemeral Key -> Shared Secret -> HKDF -> AES-GCM
 */
export async function encryptMessage(receiverPubBase64, plaintext) {
  const receiverPub = fromBase64(receiverPubBase64);

  // 1. Ephemeral Keypair (X25519)
  const ephemeral = nacl.box.keyPair();

  // 2. Diffie-Hellman (X25519)
  // nacl.scalarMult(priv, pub) -> Shared Secret (32 bytes)
  const sharedSecret = nacl.scalarMult(ephemeral.secretKey, receiverPub);

  // 3. HKDF -> AES Key
  const aesKey = await deriveAesKey(sharedSecret);

  // 4. Encrypt with AES-GCM
  // Pad Plaintext to fixed bucket
  const encodedPlaintext = padMessage(plaintext);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encodedPlaintext
  );

  // Clean up
  sharedSecret.fill(0); // Best effort wipe

  return {
    ephemeralPublicKey: toBase64(ephemeral.publicKey),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertextBuffer))
  };
}

export async function decryptMessage(myEncryptionPrivateBase64, packet) {
  const myPriv = fromBase64(myEncryptionPrivateBase64);
  const ephemeralPub = fromBase64(packet.ephemeralPublicKey);

  // 1. Diffie-Hellman
  const sharedSecret = nacl.scalarMult(myPriv, ephemeralPub);

  // 2. HKDF -> AES Key
  const aesKey = await deriveAesKey(sharedSecret);

  // 3. Decrypt
  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(packet.iv) },
      aesKey,
      fromBase64(packet.ciphertext)
    );
    // Unpad
    return unpadMessage(new Uint8Array(decryptedBuffer));
  } catch (e) {
    throw new Error("Decryption Failed: " + e.message);
  }
}

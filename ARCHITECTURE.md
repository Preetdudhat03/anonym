# Cryptographic Architecture & Specifications

## 1. Primitives
| Component | Primitive | Library |
| :--- | :--- | :--- |
| **Identity Signing** | Ed25519 | `tweetnacl` |
| **Key Agreement** | X25519 (Curve25519) | `tweetnacl` |
| **Hashing** | SHA-256 | Web Crypto API |
| **Key Derivation** | HKDF (SHA-256) | Web Crypto API |
| **Symmetric Encryption** | AES-GCM-256 | Web Crypto API |
| **Randomness** | `crypto.getRandomValues` | Web Crypto API |

## 2. Key Hierarchy
### A. Identity Keypair (Long-Term)
*   **Algo**: Ed25519
*   **Storage**: `IndexedDB` (non-extractable if possible, or raw JSON).
*   **Purpose**: Sign Auth Challenges to prove ownership of an address.
*   **Address**: `SHA-256(Ed25519_PublicKey_Bytes)` (Hex Encoded).

### B. Encryption Keypair (Long-Term)
*   **Algo**: X25519
*   **Storage**: `IndexedDB`.
*   **Purpose**: Allow offline/async message receipt. Senders derive a shared secret using this public key.

### C. Ephemeral Keypair (Per-Message)
*   **Algo**: X25519
*   **Storage**: RAM only. Destroyed immediately after encryption.
*   **Purpose**: Provide Forward Secrecy for that specific message.

## 3. Protocol Flows

### 3.1 Authentication (WebSocket Handshake)
1.  **Client** -> **Server**: `AUTH_REQ { identity_pub, encryption_pub }`
2.  **Server**: Checks loose validity. Generates `nonce` (32 bytes hex).
3.  **Server** -> **Client**: `AUTH_CHALLENGE { nonce }`
4.  **Client**: `signature = Ed25519_Sign(nonce, identity_priv)`
5.  **Client** -> **Server**: `AUTH_RESP { signature }`
6.  **Server**:
    *   `valid = Ed25519_Verify(nonce, signature, identity_pub)`
    *   If valid: Compute `Address = Hash(identity_pub)`.
    *   Bind Socket to Address.
    *   Store/Update Public Keys in DB `users` table.

### 3.2 Message Packet Structure (On Wire)
```json
{
  "type": "message",
  "target_address": "sha256_hash...",
  "payload": {
    "ephemeral_public_key": "base64...",
    "iv": "base64_12bytes...",
    "ciphertext": "base64...",
    "expires_at": "iso_string" // Client suggested expiry, server caps it
  }
}
```

### 3.3 Encryption Steps (Sender)
1.  **Input**: `MessagePayload` (String).
2.  **Recipient Path**:
    *   **Ephemeral**: Generate `Ephemeral_Keypair_Recip` (X25519).
    *   **Diffie-Hellman**: `Secret_Recip = X25519(Ephemeral_Priv_Recip, Recipient_Encryption_Pub)`.
    *   **KDF**: `Key_Recip = HKDF(Secret_Recip)`.
    *   **Encrypt**: `Ciphertext_Recip = AES-GCM(Key_Recip, Random_IV, MessagePayload)`.
3.  **Self Path (New)**:
    *   **Ephemeral**: Generate `Ephemeral_Keypair_Self` (X25519).
    *   **Diffie-Hellman**: `Secret_Self = X25519(Ephemeral_Priv_Self, My_Encryption_Pub)`.
    *   **KDF**: `Key_Self = HKDF(Secret_Self)`.
    *   **Encrypt**: `Ciphertext_Self = AES-GCM(Key_Self, Random_IV_2, MessagePayload)`.
4.  **Send**: Packet containing BOTH `Ciphertext_Recip` and `Ciphertext_Self`.

### 3.4 Decryption Steps (Receiver / Sender)
1.  **Input**: Packet.
2.  **Selection**: 
    *   If `Me == Recipient`, select `Ciphertext_Recip`.
    *   If `Me == Sender`, select `Ciphertext_Self`.
3.  **Diffie-Hellman**: `Shared_Secret = X25519(My_Encryption_Priv, Packet.Ephemeral_Pub)`.
4.  **KDF**: `AES_Key = HKDF(Shared_Secret)`.
5.  **Decrypt**: `Plaintext = AES-GCM(Key=AES_Key, IV=Packet.IV, Data=Packet.Ciphertext)`.

## 4. Metadata Minimization Strategies
*   **Padding**: All messages padded to nearest 256 bytes before encryption.
*   **Delays**: Server holds relayed messages for `Math.random() * 500` ms (simulated network jitter) to reduce timing correlation.

## 5. Database Schema (Minimalist)
**No Foreign Keys to prevent cascading identity leaks if tables are dumped partially.**

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  public_key_hash text UNIQUE NOT NULL, -- The Real Address
  short_code text UNIQUE NOT NULL,
  public_key text NOT NULL,
  encryption_public_key text NOT NULL,
  last_seen timestamp
);

CREATE TABLE messages (
  id uuid PRIMARY KEY,
  sender text NOT NULL,   -- Address Hash
  receiver text NOT NULL, -- Address Hash
  
  -- Recipient Copy
  ciphertext text NOT NULL, 
  encrypted_session_key text NOT NULL, -- Metadata (Ephemeral PubKey + IV)

  -- Sender Copy
  ciphertext_sender text,
  encrypted_session_key_sender text,

  created_at timestamp DEFAULT now(),
  expires_at timestamp NOT NULL
);
```

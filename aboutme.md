# Anonymous End-to-End Encrypted Chat System - Project Summary

## 1. Project Overview
A privacy-focused, 1-to-1 messaging application designed with a zero-trust architecture. It features no user accounts, cryptographic identity, end-to-end encryption, and automated data expiration.

## 2. Technology Stack
- **Frontend Framework**: Next.js 16 (App Router)
- **Runtime Environment**: Node.js (Custom Server)
- **Cryptography**: Web Crypto API (Native Browser Standards)
- **Real-Time Transport**: WebSocket (`ws` library)
- **Local Storage**: IndexedDB (for secure private key storage)
- **Remote Storage**: Supabase (PostgreSQL) - storing *only* encrypted blobs and public keys.
- **Styling**: CSS Modules with a dark, glassmorphism aesthetic.

## 3. Core Components Created

### A. Cryptographic Core (`src/lib/crypto.js`)
- **Algorithms**: 
  - **ECDSA P-256**: For digital signatures and identity verification.
  - **ECDH P-256**: For shared secret derivation (Key Exchange).
  - **AES-GCM 256**: For symmetric message encryption.
- **Functions**: Key generation, JWK export/import, signing/verification, and hybrid encryption/decryption logic.

### B. Client-Side secure Storage (`src/lib/db.js`)
- Implemented a wrapper around **IndexedDB**.
- Safely stores the user's `Identity KeyPair` (for signing) and `Encryption KeyPair` (for receiving messages).
- Ensures private keys are persistent on the device but *never* exposed to the network.

### C. Custom Backend Server (`server.js`)
- Integrated a custom Node.js server with Next.js.
- **WebSocket Server**: Handles real-time connections at `/api/ws`.
- **Authentication**: Implemented a Challenge-Response protocol.
  1. Client sends Public Key.
  2. Server sends a random Nonce.
  3. Client signs Nonce with Private Key.
  4. Server verifies signature -> Connection Authenticated.
- **Relay System**: Routes encrypted packets between connected peers using their Public Key Hash (Address).
- **TTL Enforcer**: A background background job (cron-like) that auto-deletes expired messages from the database every minute.

### D. Frontend Interface
- **Dashboard (`src/app/page.js`)**:
  - Identity management (Generate/Destroy keys).
  - Display of user's unique cryptographic address.
  - Input to connect to a peer.
- **Chat Interface (`src/app/chat/[address]/page.js`)**:
  - Real-time encrypted messaging UI.
  - Visual feedback for connection status (Secure/Offline).
  - Auto-scroll and message timestamping.

### E. Custom Hooks
- **`useIdentity`**: Manages the creation, loading, and deletion of user cryptographic keys.
- **`useChat`**: Handles the WebSocket lifecycle, handshake protocols, encryption of outgoing messages, and decryption of incoming messages.

## 4. Security & Privacy Features
1.  **Zero-Knowledge Server**: The server stores only public keys and encrypted text (`ciphertext`). It mathematically cannot read messages.
2.  **Anonymous Identity**: Users are identified solely by the SHA-256 hash of their Public Key. No names, emails, or phone numbers.
3.  **Forward Secrecy (Per Message)**: Each message uses a unique random AES session key, wrapped with the recipient's public key.
4.  **Auto-Expiration**: All database records (messages) have a strict `expires_at` timestamp and are wiped automatically.
5.  **Local-Only Private Keys**: Private keys are generated in the browser sandbox and saved to IndexedDB. They are never transmitted.

## 5. Database Schema
- **Users Table**: Stores `public_key_hash`, `public_key`, and `encryption_public_key`.
- **Messages Table**: Stores `sender`, `receiver`, `ciphertext`, `encrypted_session_key`, and `expires_at`.

## 6. Detailed Technical Architecture

### 6.1 Cryptographic Identity Model
The system uses a **Dual KeyPair Model** to separate Authentication from Encryption.
1.  **Identity KeyPair (ECDSA P-256)**
    *   **Usage**: Signing & Verification.
    *   **Public Key**: Published to server. Used to verify auth challenges.
    *   **Private Key**: Held in IndexedDB. Used to sign login challenges.
    *   **Address**: `SHA-256(Identity Public Key in SPKI format)`. This serves as the User ID.

2.  **Encryption KeyPair (ECDH P-256)**
    *   **Usage**: Key Agreement (Diffie-Hellman).
    *   **Public Key**: Published to server. Other users download this to send you messages.
    *   **Private Key**: Held in IndexedDB. Used to unwrap incoming session keys.

### 6.2 Authentication Protocol (Challenge-Response)
To prove you own an "Address" without sending your private key:
1.  **Client Connection**: WebSocket connects to server.
2.  **Auth Request**: Client sends `{ type: 'auth_request', publicKey, encryptionPublicKey }`.
3.  **Challenge Generation**: Server generates a random UUID (`nonce`) and sends it back.
4.  **Proof Generation**: Client signs the `nonce` with `Identity Private Key`.
5.  **Verification**: Server checks `verify(nonce, signature, publicKey)`.
6.  **Session Establishment**: If valid, Server hashes the public key to derive the `Address`, links the WebSocket to that Address, and stores the keys in the DB.

### 6.3 Hybrid Encryption Protocol (ECIES-Like)
Every message is encrypted with a unique key.
1.  **Sender Steps**:
    *   Fetch Recipient's **Encryption Public Key** from server.
    *   Generate a strictly ephemeral **Sender Ephemeral KeyPair** (ECDH).
    *   Derive **Shared Wrapping Key** = `ECDH(Sender Ephemeral Priv, Recipient Pub)`.
    *   Generate a random **AES-GCM-256 Session Key**.
    *   **Wrap** (Encrypt) the Session Key using the Wrapping Key.
    *   **Encrypt** the actual Message Text using the Session Key.
    *   **Pack**: `{ Ephemeral Pub, Wrapped Session Key, IVs }` -> JSON -> Hex.
    *   Send `{ targetAddress, ciphertext, packedKey }` to server.

2.  **Receiver Steps**:
    *   Receive Encrypted Payload.
    *   Extract **Sender Ephemeral Public Key**.
    *   Derive **Shared Wrapping Key** = `ECDH(Receiver Priv, Ephemeral Pub)`.
    *   **Unwrap** (Decrypt) the Session Key.
    *   **Decrypt** the Message Text using the Session Key.

## 7. System Data Flow

### Step 1: Initialization (Client Only)
*   User opens app -> `useIdentity` hook takes over.
*   Checks `IndexedDB` for existing keys.
*   **Case A (New User)**: Calls `window.crypto.subtle.generateKey` twice. Stores both pairs in DB. Derives Address.
*   **Case B (Returning)**: Loads keys into memory state.

### Step 2: Connection & Auth
*   `useChat` hook initiates WebSocket connection to `/api/ws`.
*   Performs the **Authentication Protocol** (described in 6.2).
*   On success, Server marks socket as `Authenticated` and adds to `clients` Map.

### Step 3: Sending a Message
1.  User types "Hello".
2.  Client fetches peer's keys from `/api/users/[address]`.
3.  Client runs **Hybrid Encryption** (described in 6.3).
4.  Client sends encrypted JSON payload to WebSocket.
5.  **Server Action**:
    *   Authenticates sender socket.
    *   Writes encrypted blob to Supabase `messages` table (for temporary persistence).
    *   Checks if Recipient is online (in `clients` Map).
    *   **If Online**: Relays the packet immediately via WebSocket.
    *   **If Offline**: Packet waits in DB (Client polls or loads history on reconnect).

### Step 4: Receiving a Message
1.  WebSocket receives `message` event.
2.  Client parses JSON payload.
3.  Client runs **Decryption** logic.
4.  Decrypted plaintext is pushed to React State (`messages` array).

### Step 5: Lifecycle & Cleanup
*   **Disconnection**: WebSocket close event -> Server removes from `clients` Map.
*   **Data Expiration**: 
    *   `server.js` starts a `setInterval` loop (1 min).
    *   Runs SQL: `DELETE FROM messages WHERE expires_at < NOW()`.
    *   Ensures true ephemeral nature of the chat.

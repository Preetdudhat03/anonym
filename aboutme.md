# Anonym: Project Development Log & Architecture

## Project Overview
**Anonym** is a production-ready, secure, anonymous chat application designed effectively for "Burner" communication. It prioritizes privacy, security, and ease of use without requiring any user accounts, emails, or phone numbers.

## Core Philosophy
1.  **Zero Trust**: The server is treated as a blind relay. It never sees plaintext messages.
2.  **Identity = Key**: Your private key *is* your account. If you lose it, you lose everything. If you destroy it, your history is cryptographically erased forever.
3.  **Ephemeral by Design**: Messages auto-expire (TTL 24h), and the system encourages "session-based" communication.

## Implementation Details

### 1. Technology Stack
*   **Frontend**: Next.js 14 (App Router)
*   **Backend Server**: Custom Node.js Server + `ws` (WebSockets)
*   **Database**: Supabase (PostgreSQL) - Stores encrypted blobs and public keys.
*   **Cryptography**: `tweetnacl` (Ed25519, X25519) + Web Crypto API (AES-GCM).

### 2. Security Architecture
*   **Identity Generation**:
    *   Users generate an **Ed25519 Keypair** locally in the browser.
    *   The **Public Key** is sent to the server to register.
    *   The **Private Key** is stored in `IndexedDB` (browser secure storage) and NEVER leaves the device.
    *   **Address**: A SHA-256 hash of the Public Key serves as the user's permanent ID.
    *   **Friend Code**: A user-friendly `XXXX-XXXX-XXXX` code derived from the address for easy sharing.

*   **Authentication (Challenge-Response)**:
    *   Server generates a random `nonce`.
    *   Client signs the nonce with their Private Key.
    *   Server verifies signature against the registered Public Key.
    *   **Result**: Secure, password-less login.

*   **End-to-End Encryption (E2EE)**:
    *   **Key Agreement**: Uses X25519 (Diffie-Hellman) to derive a shared secret between Sender and Receiver.
    *   **Message Encryption**: Uses AES-GCM (256-bit) with a unique IV for every message.
    *   **Forward Secrecy**: Uses ephemeral keys for each message packet to ensure that compromising one message key doesn't decrypt the whole chain easily (implementation detail: per-message ephemeral headers).

### 3. Features Implemented
*   **Real-time Chat**: Instant message delivery via secure WebSockets.
*   **Offline Message Delivery**: If a user is offline, the encrypted message is stored in Supabase. When they reconnect, the server syncs the last 50 messages.
*   **Message Expiry (TTL)**: A background server task deletes messages from the database older than 24 hours.
*   **Mobile Responsive**: Optimized UI (`100dvh`) for seamless mobile browser usage (Keyboard friendly).
*   **Friend Code System**:
    *   Users share a short code (e.g., `AX9K-2P8Q`).
    *   The app resolves this to the full secure hash in the background.
    *   Prevents typo-induced loss of connection.
*   **Trust & Transparency UX**:
    *   Dashboard explains "No Accounts" policy effectively.
    *   Chat screen includes permanent "End-to-End Encrypted" notice.
    *   "Destroy Identity" button wipes local keys, properly warning the user of permanent data loss.

### 4. Database Schema
*   **`users`**: Stores `public_key`, `encryption_public_key`, `public_key_hash`, and `short_code`.
*   **`messages`**: Stores `sender`, `receiver`, `ciphertext` (encrypted payload), `encrypted_session_key` (metadata), and `expires_at`.

### 5. Deployment Status
*   configured for deployment on **Render** / **Railway** (Node.js runtime required).
*   Compatible with **ngrok** for local tunneling.
*   Strict `Safe-to-Auto-Run` constraints on server processes.

## Latest Updates (Jan 10, 2026)
*   **Refined UX**: Added "Friend Code" Copy-to-Clipboard, Trust Panels, and improved status indicators.
*   **Security hardening**: Removed `server.js` auto-restarts to prevent lock file issues.
*   **History Sync**: Re-enabled "Request History" to ensure users see received messages upon page refresh.
*   **Migration**: Updated DB schema to support Short Codes natively.

## Next Steps
*   Further auditing of the crypto implementation.
*   Potential addition of file sharing (encrypted blobs).

# Anonymous End-to-End Encrypted Chat System (Redesigned)

## Security Architecture (Ed25519 + X25519 + AES-GCM)

This project has been redesigned to use strictly audited cryptographic primitives and minimized metadata leakage.

## 🚨 Security Disclaimers

### 1. No Forward Secrecy for Transcripts
We use **Ephemeral Keys per Message**, which provides Forward Secrecy for individual messages if the ephemeral keys are deleted. However, we do **NOT** implement the Double Ratchet Algorithm. A compromise of your device (and thus your identity/encryption private keys) allows an attacker to impersonate you in future messages, though they cannot retroactively decrypt old messages unless they also logged the ephemeral keys (which we destroy).

### 2. Metadata Leakage
While we pad messages to fixed 512-byte buckets and add randomized delays, a powerful network adversary (ISP/NSA) can likely infer:
- Who is talking to whom (by correlating packet timings).
- Approximate volume of communication.
- That you are using this specific chat protocol.

### 3. Identity Permanence
**If you lose your browser data (IndexedDB), your identity is lost forever.**
There is no password reset. There is no backup. This is a design feature, not a bug.

### 4. Server Trust
The server is **Blind** to content but **Trusted** for routing.
- **Can Server Read Messages?** NO.
- **Can Server Block Messages?** YES.
- **Can Server Metadata-Log?** YES.

## Technology Stack

- **Identity**: Ed25519 (via `tweetnacl`)
- **Key Agreement**: X25519 (via `tweetnacl`)
- **Encryption**: AES-GCM-256 (via Web Crypto API)
- **Key Derivation**: HKDF-SHA-256
- **Transport**: WebSocket (Secure Context Required)
- **Database**: PostgreSQL (Supabase) - Stores blobs only.

## Setup

1. `npm install`
2. `npm run dev` (Runs custom server on port 3000)
3. Ensure Supabase env vars are set in `.env.local`
4. **Database Setup**:
   - Run the SQL queries in `db/schema.sql` in your Supabase SQL Editor.
   - If upgrading, run `db/migrations/01_add_sender_encryption.sql`.

**Note**: This application MUST be run in a Secure Context (HTTPS or localhost) for Web Crypto API to function.

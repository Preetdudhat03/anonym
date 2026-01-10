File: s:\anonym\schema.sql

Overview:
This SQL file defines the database structure for Supabase (PostgreSQL). It creates the necessary tables to store user identities (public keys) and encrypted messages. It is designed to be privacy-focused; we store public keys but never private keys.

Detailed Line-by-Line Explanation:

1: -- Anonym Chat System Schema (v3 - Short Codes)
Reason: Comment indicating version and purpose.

3: DROP TABLE IF EXISTS messages;
4: DROP TABLE IF EXISTS users;
5: DROP TABLE IF EXISTS chats;
Reason: Cleanup commands to reset the database if we are re-running this script. It drops existing tables to start fresh (useful during dev).

8: create table users (
Reason: Define the 'users' table. This acts as a phonebook, mapping addresses to public keys.

9:   id uuid default gen_random_uuid() primary key,
Reason: Standard unique ID for the database row, generated automatically by Postgres.

10:   public_key_hash text not null unique, -- The Real 256-bit Address
Reason: Stores the SHA-256 hash of the user's public key. This is their primary "Wallet Address" or ID. It must be unique.

11:   short_code text not null unique,        -- The Friendly 15-char Display Code
Reason: Stores the generated "Friend Code". It must be unique so two people don't have the same code.

12:   public_key text not null,               -- Identity Public Key (Ed25519)
Reason: Stores the User's Ed25519 Public Key. Needed to verify signatures during login.

13:   encryption_public_key text not null,    -- Encryption Public Key (X25519)
Reason: Stores the User's X25519 Public Key. Only this key allows others to encrypt messages FOR this user.

14:   created_at timestamptz default now(),
15:   last_seen timestamptz default now()
Reason: Timestamps for auditing and user status (last seen online).

18: create table messages (
Reason: Define the 'messages' table. This stores encrypted packets temporarily until delivered.

19:   id uuid default gen_random_uuid() primary key,
Reason: Unique ID for the message.

20:   sender text not null,                 -- Sender Address (Real Hash)
21:   receiver text not null,               -- Receiver Address (Real Hash)
Reason: Store who sent it and who it is for. Note: Metadata (who is talking to whom) is visible to the server, but content is not.

22:   ciphertext text not null,             -- AES-GCM Encrypted Base64
Reason: The actual message content. It is encrypted on the client side before ever reaching here. The server CANNOT read this.

23:   encrypted_session_key text not null,  -- Metadata (Ephemeral PubKey + IV)
Reason: Stores technical data needed to decrypt. "Ephemeral PubKey" allows the receiver to derive the shared secret. "IV" (Initialization Vector) is needed for AES decryption.

25:   expires_at timestamptz not null
Reason: Mandatory expiration time. The server uses this to auto-delete messages to preserve privacy.

29: create index idx_users_hash on users(public_key_hash);
Reason: Create an index on the user hash. This makes looking up a user by their address extremely fast.

30: create index idx_users_shortcode on users(short_code); -- Fast Exact Lookup
Reason: Create an index on the short code. Critical for valid performance when searching for friends by code.

31: create index idx_messages_receiver on messages(receiver);
Reason: Create an index on 'receiver'. When a user asks "Get my messages", this allows the DB to find them instantly without scanning the whole table.

32: create index idx_messages_expires on messages(expires_at);
Reason: Create an index on expiration time. This makes the background "cleanup" job (deleting old messages) efficient.

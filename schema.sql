-- Anonym Chat System Schema (v2 - Final)
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX "PEER NOT REGISTERED" ERRORS

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS chats; -- Deprecated

-- Users table: Stores anonymous identities
-- We use TEXT for keys because we store Base64 strings now, not JSON.
create table users (
  id uuid default gen_random_uuid() primary key,
  public_key_hash text not null unique, -- The Address (SHA-256 Hex)
  public_key text not null,             -- Identity Public Key (Ed25519 Base64)
  encryption_public_key text not null,  -- Encryption Public Key (X25519 Base64)
  created_at timestamptz default now(),
  last_seen timestamptz default now()
);

-- Messages table: Stores encrypted messages
create table messages (
  id uuid default gen_random_uuid() primary key,
  sender text not null,                 -- Sender Address
  receiver text not null,               -- Receiver Address
  ciphertext text not null,             -- AES-GCM Encrypted Base64
  encrypted_session_key text not null,  -- Metadata (Ephemeral PubKey + IV)
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

-- Indexes for performance
create index idx_users_hash on users(public_key_hash);
create index idx_messages_receiver on messages(receiver);
create index idx_messages_expires on messages(expires_at);

-- Anonym Chat System Schema (v3 - Short Codes)

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS chats;

-- Users table: Stores anonymous identities
create table users (
  id uuid default gen_random_uuid() primary key,
  public_key_hash text not null unique, -- The Real 256-bit Address
  short_code text not null unique,        -- The Friendly 15-char Display Code
  public_key text not null,               -- Identity Public Key (Ed25519)
  encryption_public_key text not null,    -- Encryption Public Key (X25519)
  created_at timestamptz default now(),
  last_seen timestamptz default now()
);

create table messages (
  id uuid default gen_random_uuid() primary key,
  sender text not null,                 -- Sender Address (Real Hash)
  receiver text not null,               -- Receiver Address (Real Hash)
  ciphertext text not null,             -- AES-GCM Encrypted Base64
  encrypted_session_key text not null,  -- Metadata (Ephemeral PubKey + IV)
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

-- Indexes for performance and lookup safety
create index idx_users_hash on users(public_key_hash);
create index idx_users_shortcode on users(short_code); -- Fast Exact Lookup
create index idx_messages_receiver on messages(receiver);
create index idx_messages_expires on messages(expires_at);

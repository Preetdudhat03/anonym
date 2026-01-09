-- Anonym Chat System Schema

-- Users table: Stores anonymous identities (hashed public keys)
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  public_key_hash text not null unique,
  created_at timestamptz default now(),
  last_seen timestamptz default now(),
  status text default 'active'
);

-- Chats table: Stores active chat sessions between two users
create table if not exists chats (
  id uuid default gen_random_uuid() primary key,
  user_a text not null, -- Public Key Hash of User A
  user_b text not null, -- Public Key Hash of User B
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

-- Messages table: Stores encrypted messages
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) on delete cascade,
  sender text not null, -- Public Key Hash of Sender
  ciphertext text not null, -- Encrypted content
  encrypted_session_key text not null, -- Encrypted AES key
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

-- Create indexes for performance
create index if not exists idx_users_pkey_hash on users(public_key_hash);
create index if not exists idx_messages_chat_id on messages(chat_id);
create index if not exists idx_chats_participants on chats(user_a, user_b);

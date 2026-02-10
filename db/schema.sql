-- Full Database Schema for Anonym Chat
-- Based on current implementation as of 2026-02-10

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
-- Stores public keys and identity mappings. No personal data.
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    public_key_hash text UNIQUE NOT NULL, -- The canonical user ID (SHA-256 of Ed25519 PubKey)
    short_code text UNIQUE NOT NULL,      -- Human-readable alias (e.g., "cool-frog-42")
    public_key text NOT NULL,             -- Ed25519 Public Key (Base64) for Auth
    encryption_public_key text NOT NULL,  -- X25519 Public Key (Base64) for Messages
    last_seen timestamp with time zone DEFAULT now(),
    abuse_score integer DEFAULT 0,        -- Spam/Abuse counter. >= 5 triggers ban.
    created_at timestamp with time zone DEFAULT now()
);

-- Index for fast lookup by hash (Auth) and short_code (Discovery)
CREATE INDEX idx_users_hash ON users(public_key_hash);
CREATE INDEX idx_users_shortcode ON users(short_code);

-- 2. Messages Table
-- Ephemeral storage for encrypted messages. Auto-deleted by TTL.
CREATE TABLE messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Routing Metadata (Who to Who)
    sender text NOT NULL,   -- Address Hash
    receiver text NOT NULL, -- Address Hash
    
    -- Recipient's Copy (Encrypted with Recipient's Public Key)
    ciphertext text NOT NULL, 
    encrypted_session_key text NOT NULL, -- Metadata (Ephemeral PubKey + IV) for Recipient
    
    -- Sender's Copy (Encrypted with Sender's Public Key) - Added for UX consistency
    ciphertext_sender text,
    encrypted_session_key_sender text,   -- Metadata (Ephemeral PubKey + IV) for Sender

    -- Lifecycle
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL -- Hard deletion deadline
);

-- Index for fetching history (Sender OR Receiver)
CREATE INDEX idx_messages_participants ON messages(sender, receiver);
-- Index for TTL cleanup
CREATE INDEX idx_messages_expiry ON messages(expires_at);

-- 3. Abuse Reports Table
-- Logs reports to calculate abuse_score.
CREATE TABLE abuse_reports (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_hash text NOT NULL,
    reported_hash text NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies (Example for Supabase - though logic is currently server-side)
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Insert" ON messages FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Owner Select" ON messages FOR SELECT USING (sender = auth.uid() OR receiver = auth.uid()); 
-- Note: Since we use custom Auth via WebSocket, standard Supabase Auth policies might not apply directly unless using anonym key with restricted privileges.

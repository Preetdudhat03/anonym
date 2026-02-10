-- Migration: Add Sender Self-Encryption Columns
-- Run this in your Supabase SQL Editor to enable self-encrypted message storage.

ALTER TABLE messages
ADD COLUMN ciphertext_sender TEXT,
ADD COLUMN encrypted_session_key_sender TEXT;

-- Optional: Add a comment or description if supported by your tooling
COMMENT ON COLUMN messages.ciphertext_sender IS 'Encrypted message copy for the sender (self-encryption)';
COMMENT ON COLUMN messages.encrypted_session_key_sender IS 'Encrypted session key (metadata) for the sender';

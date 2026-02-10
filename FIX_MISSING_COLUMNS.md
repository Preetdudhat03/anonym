# 🛑 CRITICAL SETUP REQUIRED 🛑

To fix the "Decryption Failed" error and make sent messages visible, you **MUST** run this SQL in your Supabase Dashboard.

### 1. Copy this SQL Code:
```sql
-- Migration: Enable Sender Self-Encryption
ALTER TABLE messages
ADD COLUMN ciphertext_sender TEXT,
ADD COLUMN encrypted_session_key_sender TEXT;
```

### 2. Apply it in Supabase:
1.  Go to **[Supabase Dashboard](https://supabase.com/dashboard)**.
2.  Open your project (**anonym**).
3.  Click on **SQL Editor** (icon looking like `>_` on the left sidebar).
4.  Click **New Query**.
5.  **Paste the SQL code** from above.
6.  Click **Run** (bottom right).

### 3. Verify:
After running it, you should see "Success".
Then **restart your local server** and try sending a message.

---
**Why is this needed?**
Your database currently doesn't have the columns to store your own copy of the encrypted messages. Without this, the server discards your copy, so you can't read your own messages after a refresh.

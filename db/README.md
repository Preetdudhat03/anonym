# Database Migrations

This directory contains SQL migrations for the Anonym chat application.

## How to Apply

Since this project uses Supabase with a public key in `.env.local`, you cannot run migrations programmatically from the client.

**You must apply these migrations manually in the Supabase Dashboard:**

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Go to the **SQL Editor** (in the left sidebar).
4.  Click **New Query**.
5.  Copy and paste the content of the `.sql` file(s) from the `migrations` folder.
6.  Click **Run**.

## Migrations List

-   `01_add_sender_encryption.sql`: Adds `ciphertext_sender` and `encrypted_session_key_sender` columns to the `messages` table. This is required for the "Sender Self-Encrypted Message Copy" feature.

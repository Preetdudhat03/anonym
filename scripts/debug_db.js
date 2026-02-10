
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Environment Variables. Make sure .env.local exists.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
    console.log("🔍 Starting Database Diagnostics...");
    console.log(`Endpoint: ${supabaseUrl}`);

    // 1. Check Schema Columns
    console.log("\n1️⃣ Checking Schema...");
    // We can't query information_schema easily with supabase-js client usually, 
    // so we'll try a select on the specific column.

    // Attempt to select the specific columns from a random row
    const { data: schemaCheck, error: schemaError } = await supabase
        .from('messages')
        .select('ciphertext_sender, encrypted_session_key_sender')
        .limit(1);

    if (schemaError) {
        if (schemaError.message.includes("does not exist")) {
            console.error("❌ FAIL: Columns missing.");
            console.error("   The migration '01_add_sender_encryption.sql' has NOT been applied.");
            return;
        } else {
            console.error("⚠️ Warning: Could not verify schema directly:", schemaError.message);
        }
    } else {
        console.log("✅ Schema looks correct (columns exist).");
    }

    // 2. Try Insert with new columns
    console.log("\n2️⃣ Attempting Test Insert...");
    const testId = uuidv4();
    const testPayload = "TEST_CIPHERTEXT_" + testId;

    const { data: insertData, error: insertError } = await supabase.from('messages').insert({
        sender: 'debug_script',
        receiver: 'debug_script',
        ciphertext: 'test_receiver_blob',
        encrypted_session_key: '{}',
        ciphertext_sender: testPayload,
        encrypted_session_key_sender: '{}',
        expires_at: new Date(Date.now() + 60000).toISOString() // 1 min expiry
    }).select();

    if (insertError) {
        console.error("❌ FAIL: Insert failed.");
        console.error("   Error:", insertError.message);
        console.error("   Details:", insertError.details);
        return;
    }
    console.log("✅ Insert successful.");

    // 3. Try Read Back
    console.log("\n3️⃣ Verifying Persistence...");
    const { data: readData, error: readError } = await supabase
        .from('messages')
        .select('ciphertext_sender')
        .eq('ciphertext_sender', testPayload)
        .single();

    if (readError || !readData) {
        console.error("❌ FAIL: Could not read back the specific sender ciphertext.");
        console.error("   This might mean the column exists but data isn't being saved (Trigger/RLS issue?).");
        if (readError) console.error("   Error:", readError.message);
    } else {
        if (readData.ciphertext_sender === testPayload) {
            console.log("✅ SUCCESS: Data persisted correctly!");
            console.log("\n🎉 The Database is fully ready. The issue is likely in the application logic.");
        } else {
            console.error("❌ FAIL: Data mismatch. Got:", readData);
        }
    }

    // Cleanup
    await supabase.from('messages').delete().eq('sender', 'debug_script');
}

runDiagnostics();

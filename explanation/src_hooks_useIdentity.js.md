File: s:\anonym\src\hooks\useIdentity.js

Overview:
This React Hook manages the user's "Account". Since there are no usernames/passwords, the "Account" is just a set of cryptographic keys stored in the browser. This hook handles loading those keys on startup, creating new ones, and deleting them.

Detailed Line-by-Line Explanation:

1: import { useState, useEffect } from 'react';
2: import * as db from '@/lib/db';
3: import * as crypto from '@/lib/crypto';
Reason: Import React state management and our custom database/crypto libraries.

5: export function useIdentity() {
6:     const [identity, setIdentity] = useState(null);
Reason: State to hold the current user's identity details (public keys, address) in memory.

7:     const [loading, setLoading] = useState(true);
Reason: State to track if we are still checking the database.

9:     useEffect(() => {
10:         loadIdentity();
11:     }, []);
Reason: On component mount (page load), immediately try to load an existing identity.

13:     async function loadIdentity() {
15:             const idKey = await db.getKey('identity');
16:             if (idKey) {
Reason: Check IndexedDB for a key named 'identity'.

18:                 const encodedPub = idKey.publicKey; // Base64
19:                 const rawPub = crypto.fromBase64(encodedPub);
20:                 const address = await crypto.computeAddress(rawPub);
Reason: We don't store the Address explicitly in the DB (can be derived). So we re-calculate it from the public key every time we load. This ensures the address matches the key.

21:                 setIdentity({ ...idKey, address });
Reason: Update state with the full identity object.

30:     async function createIdentity() {
Reason: Function to generate a FRESH identity.

34:             const idKp = crypto.generateIdentityKeyPair();
Reason: Generate Ed25519 keys (for signing/auth).

41:             const encKp = crypto.generateEncryptionKeyPair();
Reason: Generate X25519 keys (for encrypting messages).

47:             await db.storeKey('identity', idKeyData);
48:             await db.storeKey('encryption', encKeyData);
Reason: Save both keys to IndexedDB permanently.

50:             const address = await crypto.computeAddress(idKp.publicKey);
Reason: Calculate the new address.

61:     async function resetIdentity() {
62:         await db.clearKeys();
Reason: Wipe the database.

63:         setIdentity(null);
Reason: Clear memory state. User is now "logged out" / anonymous.

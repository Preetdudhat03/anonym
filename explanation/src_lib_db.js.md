File: s:\anonym\src\lib\db.js

Overview:
This file is a simple wrapper around the browser's IndexedDB API. It allows the application to persistently store cryptographic keys (Identity and Encryption keys) in the user's browser securely. We do not use LocalStorage because LocalStorage is synchronous (blocks UI) and more vulnerable to XSS (though IndexedDB is also accessible via JS, it is structured better for binary/large data).

Detailed Line-by-Line Explanation:

1: /**
2:  * IndexedDB Wrapper for STRICT key storage
...
6: const DB_NAME = 'AnonymChatDB_v2';
Reason: Define the name of the database that will appear in the browser's developer tools.

7: const DB_VERSION = 1;
Reason: Version number. If we change the database structure (add stores), we must increment this to trigger 'onupgradeneeded'.

8: const STORE_KEYS = 'keys';
Reason: Name of the "Object Store" (like a table in SQL) where we will save the keys.

10: const openDB = () => {
11:     return new Promise((resolve, reject) => {
Reason: Wrap the event-based IndexedDB API in a Promise so we can use modern 'await' syntax in the rest of the app.

12:         if (!globalThis.indexedDB) return reject(new Error("No IndexedDB"));
Reason: Check if the browser supports IndexedDB.

13:         const request = indexedDB.open(DB_NAME, DB_VERSION);
Reason: Request to open the database.

14:         request.onupgradeneeded = (e) => {
15:             const db = e.target.result;
16:             if (!db.objectStoreNames.contains(STORE_KEYS)) {
17:                 db.createObjectStore(STORE_KEYS, { keyPath: 'type' });
18:             }
19:         };
Reason: This runs only if the DB is new or version changed. We create the 'keys' store. 'keyPath: type' means every item we save must have a 'type' property (like 'identity' or 'encryption'), which acts as the Primary Key.

25: export const storeKey = async (type, keyData) => {
Reason: Function to save a key.

28:         const tx = db.transaction(STORE_KEYS, 'readwrite');
Reason: Start a Read-Write transaction. Atomic operation.

29:         tx.objectStore(STORE_KEYS).put({ type, keyData });
Reason: Insert or Update (put) the key data.

35: export const getKey = async (type) => {
Reason: Function to retrieve a key by its type.

38:         const tx = db.transaction(STORE_KEYS, 'readonly');
Reason: Start a Read-Only transaction (faster/safer).

40:         req.onsuccess = () => resolve(req.result ? req.result.keyData : null);
Reason: If found, return the data. If not found, return null.

45: export const clearKeys = async () => {
Reason: Function to wipe all keys (Destroy Identity).

49:         tx.objectStore(STORE_KEYS).clear();
Reason: Delete all records in the store.

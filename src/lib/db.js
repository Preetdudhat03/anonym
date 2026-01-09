/**
 * IndexedDB Wrapper for STRICT key storage
 * Stores keys as JSON (Base64 strings) because we're using raw TweetNaCl keys
 */

const DB_NAME = 'AnonymChatDB_v2';
const DB_VERSION = 1;
const STORE_KEYS = 'keys';

const openDB = () => {
    return new Promise((resolve, reject) => {
        if (!globalThis.indexedDB) return reject(new Error("No IndexedDB"));
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_KEYS)) {
                db.createObjectStore(STORE_KEYS, { keyPath: 'type' });
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const storeKey = async (type, keyData) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_KEYS, 'readwrite');
        tx.objectStore(STORE_KEYS).put({ type, keyData });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

export const getKey = async (type) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_KEYS, 'readonly');
        const req = tx.objectStore(STORE_KEYS).get(type);
        req.onsuccess = () => resolve(req.result ? req.result.keyData : null);
        req.onerror = () => reject(req.error);
    });
};

export const clearKeys = async () => {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_KEYS, 'readwrite');
        tx.objectStore(STORE_KEYS).clear();
        tx.oncomplete = () => resolve();
    });
};

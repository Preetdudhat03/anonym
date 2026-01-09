import { useState, useEffect } from 'react';
import * as db from '@/lib/db';
import * as crypto from '@/lib/crypto';

export function useIdentity() {
    const [identity, setIdentity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIdentity();
    }, []);

    async function loadIdentity() {
        try {
            const idKey = await db.getKey('identity');
            if (idKey) {
                // Reconstruct Address from Public Key
                const encodedPub = idKey.publicKey; // Base64
                const rawPub = crypto.fromBase64(encodedPub);
                const address = await crypto.computeAddress(rawPub);
                setIdentity({ ...idKey, address });
            }
        } catch (e) {
            console.error("Identity Load Failed", e);
        } finally {
            setLoading(false);
        }
    }

    async function createIdentity() {
        setLoading(true);
        try {
            // Ed25519 for Identity
            const idKp = crypto.generateIdentityKeyPair();
            const idKeyData = {
                publicKey: crypto.toBase64(idKp.publicKey),
                privateKey: crypto.toBase64(idKp.secretKey)
            };

            // X25519 for Encryption
            const encKp = crypto.generateEncryptionKeyPair();
            const encKeyData = {
                publicKey: crypto.toBase64(encKp.publicKey),
                privateKey: crypto.toBase64(encKp.secretKey)
            };

            await db.storeKey('identity', idKeyData);
            await db.storeKey('encryption', encKeyData);

            const address = await crypto.computeAddress(idKp.publicKey);
            setIdentity({ ...idKeyData, address });
            return address;

        } catch (e) {
            console.error("Identity Gen Failed", e);
        } finally {
            setLoading(false);
        }
    }

    async function resetIdentity() {
        await db.clearKeys();
        setIdentity(null);
    }

    return { identity, loading, createIdentity, resetIdentity };
}

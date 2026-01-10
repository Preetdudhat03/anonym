import { useEffect, useState, useRef } from 'react';
import * as crypto from '@/lib/crypto';
import * as db from '@/lib/db';

export function useChat(identity, peerAddress) {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected');
    const [shortCode, setShortCode] = useState(null);
    const wsRef = useRef(null);
    const peerKeyRef = useRef(null);

    useEffect(() => {
        if (!identity) return;

        setStatus('connecting');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
        wsRef.current = ws;

        ws.onopen = async () => {
            const encKey = await db.getKey('encryption');
            // 1. Send Auth Request
            ws.send(JSON.stringify({
                type: 'auth_request',
                identityPublicKey: identity.publicKey,
                encryptionPublicKey: encKey.publicKey
            }));
        };

        ws.onmessage = async (e) => {
            try {
                const data = JSON.parse(e.data);

                // 2. Handle Challenge
                if (data.type === 'auth_challenge') {
                    // Sign Nonce using Ed25519 Secret Key (from Base64)
                    const privBytes = crypto.fromBase64(identity.privateKey);
                    const sigBytes = crypto.signChallenge(privBytes, data.nonce);

                    ws.send(JSON.stringify({
                        type: 'auth_response',
                        signature: crypto.toBase64(sigBytes)
                    }));
                }

                else if (data.type === 'auth_success') {
                    setStatus('connected');
                    if (data.shortCode) setShortCode(data.shortCode);

                    if (peerAddress) fetchPeerKey();

                    // Request History Sync (Restored by User Request)
                    ws.send(JSON.stringify({ type: 'request_history' }));
                }

                // 3. Handle Incoming Message
                else if (data.type === 'message') {
                    const { payload, sender } = data;
                    const myEncKey = await db.getKey('encryption');
                    const isMe = sender === identity.address;

                    let plainText = "";

                    if (!isMe) {
                        try {
                            plainText = await crypto.decryptMessage(
                                myEncKey.privateKey,
                                payload
                            );
                        } catch (decErr) {
                            console.error("Decryption Failed", decErr);
                            plainText = "⚠️ Decryption Error";
                        }
                    } else {
                        plainText = "(Sent Message - Encrypted)";
                    }

                    setMessages(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        text: plainText,
                        sender: sender,
                        isMe: isMe,
                        timestamp: payload.timestamp || new Date().toISOString()
                    }]);
                }

            } catch (err) {
                console.error("WS Message Error", err);
            }
        };

        ws.onclose = (e) => {
            setStatus('disconnected');
            if (e.code >= 4000) console.error("Auth Failed Code:", e.code);
        };

        return () => ws.close();
    }, [identity, peerAddress]);

    const fetchPeerKey = async () => {
        if (!peerAddress) return;
        try {
            // Check if peerAddress is a Short Code (contains hyphen) or full hash
            // If short code, verify or fetch full address? 
            // The API /api/users/[address] handles HASH.
            // We should assume peerAddress prop *is* the FULL HASH in this hook.
            // The UI is responsible for resolving code -> hash before passing it here.

            const res = await fetch(`/api/users/${peerAddress}`);
            if (!res.ok) throw new Error("Peer not found");
            const json = await res.json();
            peerKeyRef.current = json.encryptionPublicKey;
        } catch (e) {
            console.warn("Peer lookup failed", e);
        }
    };

    const sendMessage = async (text) => {
        if (!peerKeyRef.current) await fetchPeerKey();
        if (!peerKeyRef.current) {
            alert("Peer not registered yet. Please check the address.");
            return;
        }

        const packet = await crypto.encryptMessage(peerKeyRef.current, text);
        const ws = wsRef.current;

        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({
                type: 'message',
                targetAddress: peerAddress,
                payload: {
                    ...packet,
                    expires_at: new Date(Date.now() + 86400000).toISOString()
                }
            }));

            setMessages(prev => [...prev, {
                id: Date.now(),
                text,
                sender: 'me',
                isMe: true,
                timestamp: new Date().toISOString()
            }]);
        }
    };

    return { messages, status, sendMessage, shortCode };
}

import { useEffect, useState, useRef } from 'react';
import * as crypto from '@/lib/crypto';
import * as db from '@/lib/db';

export function useChat(identity, peerAddress) {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected');
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
                    if (peerAddress) fetchPeerKey();

                    // Request History Sync
                    ws.send(JSON.stringify({ type: 'request_history' }));
                }

                // 3. Handle Incoming Message
                else if (data.type === 'message') {
                    const { payload, sender } = data;
                    // Payload: { ciphertext, ephemeralPublicKey, iv }

                    const myEncKey = await db.getKey('encryption');

                    // Check if message is from myself (Address Hash)
                    // We need to re-derive my address to know if 'sender' == 'me'
                    // Helper: identity.address should be available
                    const isMe = sender === identity.address;

                    let plainText = "";
                    let decryptionSuccess = false;

                    if (!isMe) {
                        try {
                            plainText = await crypto.decryptMessage(
                                myEncKey.privateKey,
                                payload
                            );
                            decryptionSuccess = true;
                        } catch (decErr) {
                            console.error("Decryption Failed", decErr);
                            plainText = "⚠️ Decryption Error";
                        }
                    } else {
                        // We cannot decrypt our own sent messages from server history 
                        // because we didn't store the session key.
                        plainText = "(Sent Message - Encrypted)";
                        decryptionSuccess = true;
                    }

                    // Deduplicate based on timestamp + sender (rough) or just append
                    // For now, React key will handle rendering dedup if we are smart, 
                    // but state append is manual.
                    // Let's just append.

                    setMessages(prev => {
                        // Simple Dedup: Check if last message has same content/time? 
                        // Or use ID from server? Server didn't send ID. 
                        // Let's trust it's new/history.

                        return [...prev, {
                            id: Date.now() + Math.random(),
                            text: plainText,
                            sender: sender,
                            isMe: isMe,
                            timestamp: payload.timestamp || new Date().toISOString()
                        }];
                    });
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

        // Encrypt (X25519 + AES)
        const packet = await crypto.encryptMessage(peerKeyRef.current, text);

        // Send
        const ws = wsRef.current;
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({
                type: 'message',
                targetAddress: peerAddress,
                payload: {
                    ...packet, // ephemeralPublicKey, iv, ciphertext
                    expires_at: new Date(Date.now() + 86400000).toISOString()
                }
            }));

            // Optimistic Local Update
            setMessages(prev => [...prev, {
                id: Date.now(),
                text,
                sender: 'me',
                isMe: true,
                timestamp: new Date().toISOString()
            }]);
        }
    };

    return { messages, status, sendMessage };
}

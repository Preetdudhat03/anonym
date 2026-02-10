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
        setMessages([]);
    }, [peerAddress]);

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
                    ws.send(JSON.stringify({
                        type: 'request_history',
                        targetAddress: peerAddress
                    }));
                }

                // 3. Handle Incoming Message
                else if (data.type === 'message') {
                    const { payload, sender, receiver } = data; // Get receiver too
                    const myEncKey = await db.getKey('encryption');
                    const isMe = sender === identity.address;

                    // STRICT CLIENT-SIDE FILTER
                    // 1. If it's NOT from me, it must be FROM the peer.
                    // 2. If it IS from me, it must be TO the peer.
                    if (!isMe && sender !== peerAddress) {
                        return; // Ignore clutter from other people sending to me
                    }
                    if (isMe && (!receiver || receiver !== peerAddress)) {
                        // Check for case mismatch or potential encoding issues
                        if (receiver && peerAddress && receiver.toLowerCase() === peerAddress.toLowerCase()) {
                            // Allow if case-insentive match
                        } else {
                            return;
                        }
                    }

                    let plainText = "";

                    // Decrypt Payload (Works for both Incoming and Self-History)
                    // Server serves the correct encrypted payload for "me" in both cases.
                    try {
                        if (isMe && !myEncKey) {
                            throw new Error("Missing Identity Key");
                        }

                        plainText = await crypto.decryptMessage(
                            myEncKey.privateKey,
                            payload
                        );
                    } catch (decErr) {
                        console.warn("Decryption Failed:", decErr.message);
                        // If decryption fails, it likely means we received the Recipient's copy
                        // because the Sender's copy (ciphertext_sender) was missing in the DB.
                        if (isMe) {
                            plainText = "🔒 Encrypted Message (Copy not saved to server yet)";
                        } else {
                            plainText = "⚠️ Decryption Error";
                        }
                    }

                    setMessages(prev => {
                        // Avoid duplicates from history sync
                        if (prev.some(m => m.timestamp === (payload.timestamp || ''))) return prev;

                        return [...prev, {
                            id: Date.now() + Math.random(),
                            text: plainText,
                            sender: sender,
                            isMe: isMe,
                            timestamp: payload.timestamp || new Date().toISOString()
                        }].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Ensure order
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

        // 1. Fetch My Key (for Self-Encryption)
        const myEncKey = await db.getKey('encryption');
        if (!myEncKey) {
            alert("Security Error: Identity missing");
            return;
        }

        // 2. Encrypt for Peer
        const packetReceiver = await crypto.encryptMessage(peerKeyRef.current, text);

        // 3. Encrypt for Self (New)
        const packetSelf = await crypto.encryptMessage(myEncKey.publicKey, text);

        const ws = wsRef.current;

        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({
                type: 'message',
                targetAddress: peerAddress,
                payload: {
                    ...packetReceiver,
                    expires_at: new Date(Date.now() + 86400000).toISOString()
                },
                payloadSelf: {
                    ...packetSelf
                }
            }));

            // Optimistic Update
            setMessages(prev => [...prev, {
                id: Date.now(),
                text,
                sender: 'me',
                receiver: peerAddress,
                isMe: true,
                timestamp: new Date().toISOString()
            }]);
        }
    };

    const reportUser = (reason) => {
        const ws = wsRef.current;
        if (ws && ws.readyState === 1 && peerAddress) {
            ws.send(JSON.stringify({
                type: 'report_abuse',
                reportedAddress: peerAddress,
                reason: reason
            }));
        }
    };

    return { messages, status, sendMessage, shortCode, reportUser };
}

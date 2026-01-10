File: s:\anonym\src\hooks\useChat.js

Overview:
This React Hook wraps the complex WebSocket and Cryptography logic into a simple API for the UI. It manages connecting to the server, handling the authentication handshake, sending encrypted messages, and listening for incoming messages.

Detailed Line-by-Line Explanation:

1: import { useEffect, useState, useRef } from 'react';
Reason: Import standard React hooks. 'useRef' is crucial here for holding the WebSocket instance and encryption keys without triggering re-renders.

5: export function useChat(identity, peerAddress) {
Reason: Define the hook. It takes the current user's 'identity' (keys) and the 'peerAddress' (who they are talking to).

6:     const [messages, setMessages] = useState([]);
Reason: Request state for the list of messages in the chat.

7:     const [status, setStatus] = useState('disconnected');
Reason: Request state for connection status (disconnected, connecting, connected).

8:     const [shortCode, setShortCode] = useState(null);
Reason: Request state to store my own Short Code once the server tells me what it is.

9:     const wsRef = useRef(null);
Reason: Store the WebSocket object. We use a Ref because we don't want a re-render every time the socket object changes (which is internal detail).

12:     useEffect(() => {
13:         if (!identity) return;
Reason: Only attempt to connect if the user has actually logged in (generated/loaded an identity).

16:         const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
17:         const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
Reason: Connect to the WebSocket endpoint. Dynamically choose 'ws:' or 'wss:' (secure) based on the current page protocol.

20:         ws.onopen = async () => {
21:             const encKey = await db.getKey('encryption');
Reason: Fetch our encryption public key from local storage (IndexDB via db helper).

23:             ws.send(JSON.stringify({
24:                 type: 'auth_request',
25:                 identityPublicKey: identity.publicKey,
26:                 encryptionPublicKey: encKey.publicKey
27:             }));
Reason: Step 1 of Handshake: Send "Hello, I want to authenticate" with my public keys.

30:         ws.onmessage = async (e) => {
31:             try {
32:                 const data = JSON.parse(e.data);
Reason: Handle incoming data from server.

35:                 if (data.type === 'auth_challenge') {
Reason: Step 2 of Handshake: Server sent a challenge string.

37:                     const privBytes = crypto.fromBase64(identity.privateKey);
38:                     const sigBytes = crypto.signChallenge(privBytes, data.nonce);
Reason: crypto.signChallenge signs the nonce with my private key. This proves I own the key.

40:                     ws.send(JSON.stringify({
41:                         type: 'auth_response',
42:                         signature: crypto.toBase64(sigBytes)
43:                     }));
Reason: Send the signature back to the server.

46:                 else if (data.type === 'auth_success') {
Reason: Step 3: Server accepted the signature.

47:                     setStatus('connected');
Reason: Update UI to show connected state.

50:                     if (peerAddress) fetchPeerKey();
Reason: If we are already looking at a chat with someone, go fetch their keys so we can send immediately.

53:                     ws.send(JSON.stringify({ type: 'request_history' }));
Reason: Ask the server to dump my recent messages so I can see what I missed.

57:                 else if (data.type === 'message') {
Reason: Handle a normal chat message.

59:                     const myEncKey = await db.getKey('encryption');
60:                     const isMe = sender === identity.address;
Reason: Check if I sent this message or received it.

64:                     if (!isMe) {
66:                             plainText = await crypto.decryptMessage(
67:                                 myEncKey.privateKey,
68:                                 payload
69:                             );
Reason: If it's from someone else, it's encrypted. Decrypt it using my Private Encrpytion Key.

74:                     } else {
75:                         plainText = "(Sent Message - Encrypted)";
Reason: If I sent it (coming from history sync), I might not be able to decrypt it easily if I didn't store my own copy, because it was encrypted FOR THE RECEIVER. (In this simple version, we don't store sent message content locally permanently, so history sync shows placeholder).

100:     const fetchPeerKey = async () => {
Reason: Function to lookup the public key of the person we want to talk to.

109:             const res = await fetch(`/api/users/${peerAddress}`);
Reason: Call the HTTP API to get their generic info (keys).

112:             peerKeyRef.current = json.encryptionPublicKey;
Reason: Store their Encryption Public Key in a ref. We need this to lock the message so only they can open it.

118:     const sendMessage = async (text) => {
Reason: Function called by UI when user hits Send.

125:         const packet = await crypto.encryptMessage(peerKeyRef.current, text);
Reason: Encrypt the text using their Public Key. Result is { ciphertext, ephemeralKey, iv }.

129:             ws.send(JSON.stringify({
130:                 type: 'message',
131:                 targetAddress: peerAddress,
132:                 payload: { ...packet, ... }
133:             }));
Reason: Send the encrypted blob to the server to forward.

138:             setMessages(prev => [...prev, {
140:                 text,
141:                 sender: 'me',
142:                 isMe: true,
...
144:             }]);
Reason: Optimistically add the message to the UI immediately so it feels instant, without waiting for round-trip.

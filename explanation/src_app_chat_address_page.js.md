File: s:\anonym\src\app\chat\[address]\page.js

Overview:
This is the main Chat Interface page. It handles the UI for sending and receiving messages. It uses the `useChat` hook to communicate with the server and `useIdentity` to ensure the user is authenticated.

Detailed Line-by-Line Explanation:

1: 'use client';
Reason: Next.js directive to mark this as a Client Component (runs in browser, uses React hooks).

8: export default function ChatPage({ params }) {
9:     const { address } = useParams();
10:     const peerAddress = decodeURIComponent(address);
Reason: Get the `[address]` parameter from the URL (the ID of the person we are talking to).

12:     const { identity, loading: idLoading } = useIdentity();
Reason: Get current user identity.

13:     const { messages, sendMessage, status } = useChat(identity, peerAddress);
Reason: Initialize the Chat System. Pass my identity and the target's address. We get back the live list of 'messages', a 'sendMessage' function, and connection 'status'.

16:     const messagesEndRef = useRef(null);
Reason: Reference to an invisible element at the bottom of the chat list. Used for auto-scrolling.

19:     const scrollToBottom = () => {
20:         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
21:     };
Reason: Scroll the view to the newest message.

23:     useEffect(() => {
24:         scrollToBottom();
25:     }, [messages]);
Reason: Every time 'messages' array changes (new message arrives), scroll to bottom.

29:     if (!identity) {
30:         if (typeof window !== 'undefined') router.push('/');
31:         return null;
32:     }
Reason: Security check. If user isn't logged in (no identity), kick them back to the Home Page.

34:     const handleSend = (e) => {
35:         e.preventDefault();
36:         if (input.trim()) {
37:             sendMessage(input.trim());
Reason: When user submits the form, call 'sendMessage' from the hook.

42:     return (
43:         <div className={styles.container}>
Reason: Render the chat layout.

54:                     <span style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5 }}>
55:                         🔒 Secure Session Established
56:                     </span>
Reason: Visual indicator that encryption is active.

104:                 {messages.map((msg) => (
105:                     <div
106:                         key={msg.id}
107:                         className={`${styles.message} ${msg.isMe ? styles.sent : styles.received}`}
108:                     >
109:                         {msg.text}
Reason: Map over the messages array and render each bubble. Styling differs based on 'isMe'.

115:                 <div ref={messagesEndRef} />
Reason: The invisible anchor for scrolling.

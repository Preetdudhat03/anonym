'use client';
import { useIdentity } from '@/hooks/useIdentity';
import { useChat } from '@/hooks/useChat';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, use } from 'react';
import styles from './page.module.css';

export default function ChatPage({ params }) {
    // Unwrap params in newer Next.js if needed, or use useParams.
    // Recommended: await params in server component, or use useParams in client component.
    // This is client component ('use client').
    // So `useParams` is correct.
    const { address } = useParams();
    const peerAddress = decodeURIComponent(address);

    const { identity, loading: idLoading } = useIdentity();
    const { messages, sendMessage, status } = useChat(identity, peerAddress);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (idLoading) return <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>Loading security context...</div>;

    if (!identity) {
        // Redirect to login if lost identity
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem' }}>
                    ← Dashboard
                </button>
                <div className={styles.peerInfo} style={{ alignItems: 'center' }}>
                    <span className={styles.peerLabel}>Encrypted Channel</span>
                    <span className={styles.peerAddress} title={peerAddress}>
                        {peerAddress.slice(0, 8)}...{peerAddress.slice(-8)}
                    </span>
                </div>
                <div style={{ width: 60, textAlign: 'right', fontSize: '0.8rem', color: status === 'connected' ? '#00ff9d' : '#ff4444' }}>
                    {status === 'connected' ? 'SECURE' : 'OFFLINE'}
                </div>
            </header>

            <div className={styles.messageList}>
                <div className={styles.system} style={{ background: 'rgba(50, 50, 50, 0.3)', padding: '1rem', borderRadius: 8, margin: '1rem', fontSize: '0.75rem', lineHeight: '1.5', textAlign: 'center', color: '#aaa' }}>
                    <p style={{ margin: 0 }}>🔒 <strong>End-to-End Encrypted</strong> • Auto-deletes in 24h</p>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>
                        Messages are delivered offline if recipient is away.
                        Once read or expired, they vanish.
                        Screenshots are still possible—be honest.
                    </p>
                </div>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${msg.isMe ? styles.sent : styles.received}`}
                    >
                        {msg.text}
                        <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: 4, textAlign: msg.isMe ? 'right' : 'left' }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
                <input
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a secure message..."
                    autoFocus
                />
                <button type="submit" className={styles.sendButton} disabled={status !== 'connected' || !input}>
                    ➤
                </button>
            </form>
        </div>
    );
}

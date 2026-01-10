'use client';
import { useIdentity } from '@/hooks/useIdentity';
import { useChat } from '@/hooks/useChat';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function ChatPage({ params }) {
    const { address } = useParams();
    const peerAddress = decodeURIComponent(address);

    const { identity, loading: idLoading } = useIdentity();
    const { messages, sendMessage, status } = useChat(identity, peerAddress);
    const [input, setInput] = useState('');
    const [showDetails, setShowDetails] = useState(false);
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
                <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', padding: '0 10px' }}>
                    ←
                </button>

                <div
                    className={styles.peerInfo}
                    style={{ alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 5 }}>
                        🔒 Secure Session Established
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>Keys exist only on your devices <span style={{ fontSize: '0.8rem' }}>ⓘ</span></span>
                </div>

                <div style={{ width: 40 }} /> {/* Spacer for centering */}
            </header>

            {/* Advanced Session Details Modal */}
            {showDetails && (
                <div style={{
                    background: '#111',
                    borderBottom: '1px solid #333',
                    padding: '1rem',
                    fontSize: '0.8rem',
                    color: '#aaa',
                    position: 'absolute',
                    top: 60,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.9rem' }}>Secure Session Details</h3>
                    <ul style={{ paddingLeft: 20, lineHeight: '1.6' }}>
                        <li><strong>Recipient Hash:</strong> <span style={{ fontFamily: 'monospace', color: '#00ff9d' }}>{peerAddress.slice(0, 8)}...{peerAddress.slice(-8)}</span></li>
                        <li><strong>Encryption:</strong> End-to-end (Client-side X25519/AES-GCM)</li>
                        <li><strong>Storage:</strong> Keys never leave your device.</li>
                        <li><strong>Retention:</strong> Messages auto-delete after 24h.</li>
                        <li><strong>Scope:</strong> Session valid only while keys exist in browser.</li>
                    </ul>
                    <button
                        onClick={() => setShowDetails(false)}
                        style={{ width: '100%', marginTop: 10, padding: 8, background: '#222', border: '1px solid #333', color: 'white', borderRadius: 4, cursor: 'pointer' }}
                    >
                        Close Details
                    </button>
                </div>
            )}

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

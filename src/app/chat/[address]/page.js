'use client';
import { useIdentity } from '@/hooks/useIdentity';
import { useChat } from '@/hooks/useChat';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useSessionExpiry } from '@/hooks/useSessionExpiry';
import SessionExpiryBanner from '@/app/components/SessionExpiryBanner';
import * as db from '@/lib/db';
import * as cryptoLib from '@/lib/crypto';
import styles from './page.module.css';

export default function ChatPage({ params }) {
    const { address } = useParams();
    const peerAddress = decodeURIComponent(address);

    const { identity, loading: idLoading } = useIdentity();
    const { messages, sendMessage, status, reportUser, signalDeletion } = useChat(identity, peerAddress);
    const [input, setInput] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDestroyModal, setShowDestroyModal] = useState(false);
    const [confirmReport, setConfirmReport] = useState(null);
    const messagesEndRef = useRef(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const { expiryTimestamp, isExpired, loading: expiryLoading } = useSessionExpiry(peerAddress);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isExpired]); // Scroll when expired state changes too

    if (idLoading || expiryLoading) return <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>Loading security context...</div>;

    if (!identity) {
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && !isExpired) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    const handleDestroySession = async () => {
        if (!identity) return;

        try {
            // 1. Authenticate Deletion Request
            const timestamp = Date.now().toString();
            const signature = cryptoLib.signChallenge(
                cryptoLib.fromBase64(identity.privateKey),
                `DELETE_SESSION:${timestamp}`
            );

            // 2. Signal Peer via WebSocket (Real-time kick)
            // We await a small delay to ensure the WS frame leaves the buffer before we navigate away/close socket.
            signalDeletion(peerAddress);
            await new Promise(resolve => setTimeout(resolve, 500));

            // 3. Send Server Request (Best Effort, Data Wipe)
            // We verify identity so server can delete our messages.
            await fetch(`/api/session?peerAddress=${encodeURIComponent(peerAddress)}`, {
                method: 'DELETE',
                headers: {
                    'x-identity-pub': identity.publicKey,
                    'x-signature': cryptoLib.toBase64(signature),
                    'x-timestamp': timestamp
                }
            });
        } catch (e) {
            console.error("Server deletion failed", e);
            // Proceed anyway - local destruction is paramount
        }

        // 3. Local Reset (Stay logged in, just clear this chat view)
        // db.clearKeys(); // <-- REMOVED per user request
        // localStorage.clear(); // <-- REMOVED per user request

        // 4. Force Redirect
        window.location.href = '/';
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

                <div style={{ width: 40 }} /> {/* Spacer */}

                <button
                    onClick={() => setShowDestroyModal(true)}
                    style={{
                        background: '#330000',
                        border: '1px solid #550000',
                        color: '#ff4444',
                        fontSize: '0.7rem',
                        padding: '6px 12px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginLeft: 10
                    }}
                >
                    Delete Chat
                </button>
            </header>

            <SessionExpiryBanner expiresAt={expiryTimestamp} />

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

                    <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                        <button
                            onClick={() => setShowDetails(false)}
                            style={{ flex: 1, padding: 8, background: '#222', border: '1px solid #333', color: 'white', borderRadius: 4, cursor: 'pointer' }}
                        >
                            Close Details
                        </button>
                        <button
                            onClick={() => setShowReportModal(true)}
                            style={{ flex: 1, padding: 8, background: '#331111', border: '1px solid #550000', color: '#ff4444', borderRadius: 4, cursor: 'pointer' }}
                        >
                            Report Abuse
                        </button>
                    </div>
                </div>
            )}

            {/* Report Abuse Modal */}
            {showReportModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: 12, width: '90%', maxWidth: 400, border: '1px solid #333' }}>
                        <h3 style={{ marginTop: 0, color: '#ff4444' }}>Report Abuse</h3>
                        <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5' }}>
                            Reports are reviewed automatically. Repeated abuse may limit a user’s access.
                            <br /><br />
                            {/*For urgent safety concerns, contact: <a href="mailto:support@anonym-app.com" style={{ color: '#aaa', textDecoration: 'underline' }}>support@anonym-app.com</a>*/}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '1rem 0' }}>
                            {!confirmReport ? (
                                ['Harassment', 'Spam', 'Threats', 'Hate Speech', 'Other'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setConfirmReport(r)}
                                        style={{ padding: '0.8rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: 6, textAlign: 'left', cursor: 'pointer', marginBottom: 8 }}
                                    >
                                        {r}
                                    </button>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                    <p style={{ color: '#ff4444', fontWeight: 'bold' }}>Reject & Block User?</p>
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 15 }}>
                                        Reason: {confirmReport}<br />
                                        This conversation will be permanently removed.
                                    </p>
                                    <button
                                        onClick={() => {
                                            reportUser(confirmReport.toLowerCase());
                                            router.push('/');
                                            // Optional: Custom toast instead of alert
                                        }}
                                        style={{ width: '100%', padding: '0.8rem', background: '#550000', border: '1px solid #770000', color: 'white', borderRadius: 4, cursor: 'pointer', marginBottom: 8 }}
                                    >
                                        Yes, Block & Report
                                    </button>
                                    <button
                                        onClick={() => setConfirmReport(null)}
                                        style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #333', color: '#aaa', borderRadius: 4, cursor: 'pointer' }}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowReportModal(false)}
                            style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Destroy Session Modal */}
            {
                showDestroyModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ background: '#1a0505', padding: '1.5rem', borderRadius: 12, width: '90%', maxWidth: 400, border: '1px solid #550000', textAlign: 'center' }}>
                            <h3 style={{ marginTop: 0, color: '#ff4444', fontSize: '1.2rem' }}>⚠️ Delete Conversation?</h3>

                            <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6', margin: '1rem 0' }}>
                                This will <strong>permanently delete</strong> the chat history for <strong>BOTH</strong> you and the recipient.
                                <br /><br />
                                Your account will remain active.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <button
                                    onClick={handleDestroySession}
                                    style={{
                                        padding: '1rem',
                                        background: '#ff0000',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Delete for Everyone
                                </button>

                                <button
                                    onClick={() => setShowDestroyModal(false)}
                                    style={{
                                        padding: '0.8rem',
                                        background: 'transparent',
                                        border: '1px solid #444',
                                        color: '#aaa',
                                        borderRadius: 6,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className={styles.messageList}>
                {!isExpired && (
                    <>
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
                                {/*<div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: 4, textAlign: msg.isMe ? 'right' : 'left' }}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>*/}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
                {isExpired && (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#666',
                        textAlign: 'center',
                        marginTop: '2rem'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⌛</div>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Session Expired</p>
                        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Messages have been permanently destroyed.</p>
                    </div>
                )}
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
                <input
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isExpired ? "Session expired" : "Type a secure message..."}
                    autoFocus={!isExpired}
                    disabled={isExpired}
                />
                <button type="submit" className={styles.sendButton} disabled={status !== 'connected' || !input || isExpired}>
                    ➤
                </button>
            </form>
        </div >
    );
}

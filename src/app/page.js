'use client';
import { useIdentity } from '@/hooks/useIdentity';
import { useChat } from '@/hooks/useChat';
import styles from './page.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { identity, loading, createIdentity, resetIdentity } = useIdentity();
  // Auto-connect to register presence/keys
  const { status } = useChat(identity, null);

  const [targetAddress, setTargetAddress] = useState('');
  const router = useRouter();

  if (loading) {
    return <div className={styles.container} style={{ color: '#666' }}>Loading security context...</div>;
  }

  const handleStartChat = (e) => {
    e.preventDefault();
    if (targetAddress.trim()) {
      router.push(`/chat/${targetAddress.trim()}`);
    }
  };

  if (!identity) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Anonym</h1>
          <p className={styles.subtitle}>End-to-End Encrypted 1-to-1 Chat</p>

          <div style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '0.9rem', color: '#aaa', lineHeight: '1.6' }}>
            <p>🔒 <strong>Zero Knowledge:</strong> Server cannot read messages.</p>
            <p>🔑 <strong>Client Keys:</strong> Identity lives in your browser.</p>
            <p>⏳ <strong>Auto-Expiry:</strong> History vanishes automatically.</p>
          </div>

          <button onClick={createIdentity} className={styles.button}>
            Generate Key Identity
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Dashboard</h1>

        <div style={{ marginBottom: '2rem' }}>
          <label className={styles.label}>Your Unique Address</label>
          <div className={styles.addressBox} onClick={() => navigator.clipboard.writeText(identity.address)} style={{ cursor: 'pointer' }} title="Click to copy">
            {identity.address}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Share this address to receive messages.</p>
          <div style={{ marginTop: 5, fontSize: '0.7rem', color: status === 'connected' ? '#00ff9d' : '#ff4444' }}>
            Status: {status === 'connected' ? 'ONLINE (Keys Registered)' : 'OFFLINE'}
          </div>
        </div>

        <form onSubmit={handleStartChat} style={{ marginBottom: '2rem' }}>
            <label className={styles.label}>Connect to Peer</label>
            <input
            className={styles.input}
            placeholder="Paste Recipient Address Hash"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            required
            />
            <button type="submit" className={styles.button} disabled={!targetAddress}>
            Start Encrypted Session
            </button>
        </form>

        <button
            onClick={() => {
            if (window.confirm('WARNING: Deleting your identity is permanent. You will lose access to all chats and messages forever. Continue?')) {
                resetIdentity();
            }
            }}
            className={`${styles.button} ${styles.buttonSecondary}`}
        >
            Destroy Identity & Wipe Data
        </button>
      </div>
    </main>
  );
}

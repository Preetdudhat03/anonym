'use client';
import { useIdentity } from '@/hooks/useIdentity';
import { useChat } from '@/hooks/useChat';
import styles from './page.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './components/LandingPage';

export default function Home() {
  const { identity, loading, createIdentity, resetIdentity } = useIdentity();
  // Auto-connect to register presence/keys
  const { status, shortCode } = useChat(identity, null);

  const [targetAddress, setTargetAddress] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [showHash, setShowHash] = useState(false);
  const router = useRouter();

  if (loading) {
    return <div className={styles.container} style={{ color: '#666' }}>Loading security context...</div>;
  }

  const handleStartChat = async (e) => {
    e.preventDefault();
    setLookupError('');
    let target = targetAddress.trim();

    if (!target) return;

    // Check if it's a Short Code (format: XXXX-XXXX-XXXX)
    if (target.includes('-') && target.length <= 15) {
      try {
        const res = await fetch(`/api/code/${target}`);
        if (!res.ok) {
          setLookupError('Friend Code not found');
          return;
        }
        const data = await res.json();
        target = data.address; // Use the Real Hash
      } catch (err) {
        setLookupError('Lookup failed');
        return;
      }
    }

    router.push(`/chat/${target}`);
  };

  // ... (Login View omitted, assumed unchanged) ...

  if (!identity) {
    return <LandingPage onEnter={createIdentity} />;
  }

  /* Removed misplaced hook */

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Anonym Dashboard</h1>

        <div style={{ marginBottom: '2rem' }}>
          <label className={styles.label}>Your Friend Code</label>
          <div
            className={styles.addressBox}
            onClick={() => {
              if (shortCode) {
                navigator.clipboard.writeText(shortCode);
                alert("Friend Code Copied!");
              }
            }}
            style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', textAlign: 'center', borderColor: '#00ff9d' }}
            title="Click to copy"
          >
            {shortCode || <span style={{ fontSize: '1rem', opacity: 0.5 }}>Generating Secure Identity...</span>}
            {shortCode && <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', color: '#888', marginTop: 5 }}>Click to Copy</span>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => setShowHash(!showHash)}
              style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {showHash ? 'Hide Technical Details' : 'Advanced: View Internal Hash'}
            </button>

            {showHash && (
              <div style={{ marginTop: 10 }}>
                <label className={styles.label} style={{ fontSize: '0.7rem' }}>Internal 256-bit Address</label>
                <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#444', wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 4 }}>
                  {identity.address}
                </div>
              </div>
            )}
          </div>

          {/* TRUST PANEL */}
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#999', marginBottom: '2rem' }}>
            <p style={{ marginBottom: 8 }}>🔒 <strong>Privacy Summary</strong></p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>No accounts, emails, or phone numbers.</li>
              <li>Messages are encrypted on your device.</li>
              <li>Recipients can read messages only if you share your code.</li>
              <li>Identity exists only in this browser.</li>
            </ul>
          </div>

          <div style={{ fontSize: '0.7rem', color: status === 'connected' ? '#00ff9d' : '#888' }}>
            ● Status: {status === 'connected' ? 'Connected to Relay' : 'Connecting...'}
          </div>
        </div>

        <form onSubmit={handleStartChat} style={{ marginBottom: '2rem' }}>
          <label className={styles.label}>Connect to Peer</label>
          <input
            className={styles.input}
            placeholder="Enter Friend Code (XXXX-XXXX-XXXX)"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            required
          />
          {lookupError && <p style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '1rem' }}>{lookupError}</p>}
          <button type="submit" className={styles.button} disabled={!targetAddress}>
            Start Secure Chat
          </button>
        </form>

        <button
          onClick={() => {
            const word = prompt("TYPE 'DESTROY' TO DELETE YOUR IDENTITY PERMANENTLY.\n\nThis action cannot be undone. You will lose all messages and your Friend Code forever.");
            if (word === 'DESTROY') {
              resetIdentity();
            }
          }}
          className={`${styles.button} ${styles.buttonSecondary}`}
          style={{ color: '#ff4444', borderColor: '#331111' }}
        >
          Destroy Identity & Wipe Data
        </button>
      </div>
    </main>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../landing.module.css';

export default function LandingPage({ onEnter }) {
    const [consents, setConsents] = useState({
        noRecovery: false,
        tempStorage: false,
        metadata: false
    });

    const allConsented = consents.noRecovery && consents.tempStorage && consents.metadata;

    const toggleConsent = (key) => {
        setConsents(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const scrollToConsent = () => {
        document.getElementById('consent-gate').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            {/* 1. Hero Section */}
            <section className={styles.hero}>
                <div style={{ marginBottom: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Anonym</div>
                <h1 className={styles.heroTitle}>Private. Ephemeral. Yours.</h1>
                <p className={styles.heroSub}>End-to-end encrypted messaging with no accounts and no identity tracking.</p>
                <button className={styles.button} style={{ maxWidth: 200 }} onClick={scrollToConsent}>
                    Enter Secure Chat
                </button>
            </section>

            {/* 2. What This Is */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What This Is</h2>
                <div className={styles.grid}>
                    <div className={styles.text}>
                        <p>Anonym is a direct, one-to-one encrypted chat tool.</p>
                        <p>There are no servers managing your identity. There is no password to reset. Your identity is a cryptographic key generated right here in your browser. This key never leaves your device unencrypted and cannot be recovered by us.</p>
                    </div>
                    <div className={styles.infoBox}>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>No Accounts:</strong> You do not sign up.</li>
                            <li className={styles.listItem}><strong>No Data Mining:</strong> We generally don't know who you are.</li>
                            <li className={styles.listItem}><strong>Browser Based:</strong> No installation required.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. What This Is NOT */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle} style={{ borderColor: 'var(--status-danger)' }}>What This Is NOT</h2>
                <div className={styles.warningBox}>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Not WhatsApp/Signal:</strong> We do not use phone numbers to find friends.</li>
                        <li className={styles.listItem}><strong>Not Recoverable:</strong> If you clear cookies, your account is gone forever.</li>
                        <li className={styles.listItem}><strong>Not network anonymity tool (like Tor):</strong> Your ISP can still see you are connecting to our server. We hide <em>what</em> you say, not that you are online.</li>
                        <li className={styles.listItem}><strong>Not Screenshot Proof:</strong> The recipient can always take a photo of their screen. Trust your peer.</li>
                        <li className={styles.listItem}><strong>Not File Storage:</strong> Text only. No images, no files.</li>
                    </ul>
                </div>
            </section>

            {/* 4. How It Works */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <div className={styles.grid}>
                    <div className={styles.infoBox} style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>1. Generate</h3>
                        <p className={styles.text} style={{ fontSize: '0.9rem' }}>Your device creates a unique digital key. This key never leaves your device.</p>
                    </div>
                    <div className={styles.infoBox} style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>2. Connect</h3>
                        <p className={styles.text} style={{ fontSize: '0.9rem' }}>Share your Friend Code. The app establishes an encrypted session routed through a relay server.</p>
                    </div>
                    <div className={styles.infoBox} style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>3. Encrypt</h3>
                        <p className={styles.text} style={{ fontSize: '0.9rem' }}>Messages are locked before leaving your browser. Only the recipient has the key to unlock them.</p>
                    </div>
                    <div className={styles.infoBox} style={{ borderLeft: '2px solid var(--border-subtle)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>4. Destroy</h3>
                        <p className={styles.text} style={{ fontSize: '0.9rem' }}>History auto-deletes after 24 hours. Wipe your keys to vanish instantly.</p>
                    </div>
                </div>
            </section>

            {/* 5. Data & Privacy */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Data Transparency</h2>
                <p className={styles.text}>
                    We believe you should know exactly what the server sees.
                    <Link href="/privacy" className={styles.link} style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                        Read full Privacy Policy →
                    </Link>
                </p>

                <div className={styles.infoBox}>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Message Content:</strong> <span style={{ color: 'var(--accent-primary)' }}>Unknown (Encrypted Blob)</span></li>
                        <li className={styles.listItem}><strong>Your Identity:</strong> A SHA-256 Hash of your Public Key(a non-reversible identifier).</li>
                        <li className={styles.listItem}><strong>Metadata:</strong> Connection time, message size, and rough sender/receiver relationship (to route packets).</li>
                        <li className={styles.listItem}><strong>Persistence:</strong> Encrypted messages are stored for up to 24 hours to handle offline delivery, then hard-deleted.</li>
                    </ul>
                </div>
            </section>

            {/* 6. Warnings & Security */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle} style={{ borderColor: 'var(--status-warning)' }}>Boundaries & Expectations</h2>
                <div className={styles.grid}>
                    <div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Who Should Use This</h3>
                        <ul className={styles.list} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li className={styles.listItem}>Short-lived, private conversations.</li>
                            <li className={styles.listItem}>People who don't want to link chats to a phone number.</li>
                            <li className={styles.listItem}>Temporary secure communication.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Who Should NOT Use This</h3>
                        <ul className={styles.list} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li className={styles.listItem}>Anyone needing long-term history (years).</li>
                            <li className={styles.listItem}>People requiring protection against nation-state level surveillance. (Use Tor/Signal).</li>
                            <li className={styles.listItem}>Those needing legal evidence trails.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 10. Consent Gate */}
            <section id="consent-gate" className={styles.consentSection}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Initialization Consent</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Before entering, confirm you understand the following limitations.</p>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={consents.noRecovery}
                        onChange={() => toggleConsent('noRecovery')}
                    />
                    <span>I understand that if I clear my browser data, my identity and messages are lost forever with no recovery possible.</span>
                </label>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={consents.tempStorage}
                        onChange={() => toggleConsent('tempStorage')}
                    />
                    <span>I understand that encrypted messages are temporarily stored on the relay server for delivery (max 24h).</span>
                </label>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={consents.metadata}
                        onChange={() => toggleConsent('metadata')}
                    />
                    <span>I understand that while content is hidden, standard network metadata (connection time, size) is visible to the server.</span>
                </label>

                <button
                    className={styles.button}
                    disabled={!allConsented}
                    onClick={onEnter}
                >
                    {allConsented ? "I Understand — Enter Chat" : "Review & Accept All to Continue"}
                </button>

                <p className={styles.consentDisclaimer}>
                    By continuing, you acknowledge that you have read and understood our <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
                </p>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerLinks}>
                    <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                    <span className={styles.separator}>·</span>
                    <Link href="/terms" className={styles.footerLink}>Terms of Use</Link>
                    <span className={styles.separator}>·</span>
                    <Link href="/abuse" className={styles.footerLink}>Abuse Policy</Link>
                </div>
                <p>Anonym © 2026. Zero warranties. Use at your own risk.</p>
            </footer>
        </div>
    );
}

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
                <p className={styles.heroSub}>
                    Zero-Knowledge messaging architecture.<br />
                    End-to-End Encryption (E2EE) by default.<br />
                    No sign-ups. No tracking. No history.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className={styles.button} style={{ maxWidth: 200, marginTop: '2rem' }} onClick={scrollToConsent}>
                        Enter Secure Chat
                    </button>
                    <Link href="/privacy">
                        <button className={styles.button} style={{ maxWidth: 200, marginTop: '2rem', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            Read Security Policy
                        </button>
                    </Link>
                </div>
            </section>

            {/* 2. Determine Our Integrity */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Our Integrity Model</h2>
                <div className={styles.grid}>
                    <div className={styles.text}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>We Cannot Be Subpoenaed For Content</h3>
                        <p>
                            Anonym is designed to protect your privacy even from us. We store encrypted blobs that look like random noise. We hold no decryption keys.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            Your Identity is a cryptographic Key Pair (Ed25519) generated locally in your browser. We never see your Private Key.
                        </p>
                    </div>
                    <div className={styles.infoBox}>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Protocol:</strong> Double-Ratchet inspired encryption.</li>
                            <li className={styles.listItem}><strong>Message Cipher:</strong> AES-GCM (256-bit).</li>
                            <li className={styles.listItem}><strong>Key Exchange:</strong> X25519 (Elliptic Curve).</li>
                            <li className={styles.listItem}><strong>Signing:</strong> Ed25519 signatures for authenticating commands.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. The Rules of Engagement */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Rules of Engagement</h2>
                <div className={styles.warningBox}>
                    <h3 style={{ color: '#ff6b6b', marginTop: 0, fontSize: '1rem' }}>⚠️ This Platform Is Unforgiving by Design</h3>
                    <ul className={styles.list} style={{ marginTop: '1rem' }}>
                        <li className={styles.listItem}><strong>One Device Only:</strong> Your identity lives in this browser. If you switch devices, you are a new person.</li>
                        <li className={styles.listItem}><strong>No Recovery:</strong> Forget your keys? Clear your cache? Your account is gone forever. We cannot help you.</li>
                        <li className={styles.listItem}><strong>24-Hour TTL:</strong> All messages self-destruct from the server 24 hours after creation.</li>
                        <li className={styles.listItem}><strong>Mutual Kill Switch:</strong> Either participant can delete the chat history for <strong>both</strong> parties instantly.</li>
                    </ul>
                </div>
            </section>

            {/* 4. Data Transparency */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Radical Transparency</h2>
                <p className={styles.text}>
                    We collect minimal metadata to function.
                </p>
                <div className={styles.grid}>
                    <div className={styles.infoBox} style={{ borderLeft: '2px solid var(--accent-primary)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>What We Know</h3>
                        <ul className={styles.list} style={{ fontSize: '0.9rem' }}>
                            <li className={styles.listItem}>Your Public Key Hash (ID).</li>
                            <li className={styles.listItem}>When you connected (Timestamp).</li>
                            <li className={styles.listItem}>Approximate message size (in bytes).</li>
                            <li className={styles.listItem}>Your IP address (ephemeral logs).</li>
                        </ul>
                    </div>
                    <div className={styles.infoBox} style={{ borderLeft: '2px solid var(--status-danger)' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>What We Don't Know</h3>
                        <ul className={styles.list} style={{ fontSize: '0.9rem' }}>
                            <li className={styles.listItem}>Your Name, Email, or Phone.</li>
                            <li className={styles.listItem}>Who you are messaging (we route by ID, we don't know the human).</li>
                            <li className={styles.listItem}><strong>What you are saying.</strong></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 10. Consent Gate */}
            <section id="consent-gate" className={styles.consentSection}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Initialization Consent</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    By proceeding, you verify that you understand the following:
                </p>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={consents.noRecovery}
                        onChange={() => toggleConsent('noRecovery')}
                    />
                    <span><strong>No Recovery:</strong> If I lose my browser data, my identity is permanently lost.</span>
                </label>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={consents.tempStorage}
                        onChange={() => toggleConsent('tempStorage')}
                    />
                    <span><strong>Zero-Knowledge:</strong> Anonym cannot decrypt my messages or recover them for legal requests.</span>
                </label>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={consents.metadata}
                        onChange={() => toggleConsent('metadata')}
                    />
                    <span><strong>Ephemeral:</strong> Everything I send will be deleted automatically within 24 hours.</span>
                </label>

                <button
                    className={styles.button}
                    disabled={!allConsented}
                    onClick={onEnter}
                >
                    {allConsented ? "Initialize Identity & Enter" : "Acknowledge Risks to Continue"}
                </button>

                <p className={styles.consentDisclaimer}>
                    I have read and agree to the <Link href="/terms" className={styles.link}>Terms of Service</Link> and <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
                </p>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerLinks}>
                    <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                    <span className={styles.separator}>·</span>
                    <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
                    <span className={styles.separator}>·</span>
                    <Link href="/abuse" className={styles.footerLink}>Abuse Policy</Link>
                </div>
                <p>Anonym © 2026. Experimental Secure Software.</p>
                <p>Developed by <Link href="https://github.com/Preetdudhat03" className={styles.link}>Preet Dudhat</Link></p>
            </footer>
        </div>
    );
}

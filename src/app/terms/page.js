'use client';
import Link from 'next/link';
import styles from '../landing.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            {/* Back Link */}
            <div style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>← Back to Home</span>
                </Link>
            </div>

            {/* Header */}
            <header className={styles.hero} style={{ marginBottom: '3rem', borderBottom: 'none', paddingBottom: 0 }}>
                <h1 className={styles.heroTitle}>Terms of Use</h1>
                <p className={styles.heroSub} style={{ fontSize: '0.9rem' }}>
                    <strong>Effective Date:</strong> January 2026
                </p>
            </header>

            {/* Intro */}
            <section className={styles.section}>
                <p className={styles.text} style={{ fontSize: '1.1rem' }}>
                    Welcome to <strong>Anonym</strong>. By accessing or using this website and application, you agree to these Terms of Use. If you do not agree, do not use the service.
                </p>
            </section>

            {/* 1. What Anonym Is */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. What Anonym Is</h2>
                <p className={styles.text}>
                    Anonym is a <strong>browser-based, one‑to‑one encrypted messaging tool</strong> designed for short‑lived private conversations.
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>No accounts</li>
                    <li className={styles.listItem}>No passwords</li>
                    <li className={styles.listItem}>No phone numbers</li>
                    <li className={styles.listItem}>No message history guarantees</li>
                </ul>
                <p className={styles.text} style={{ fontStyle: 'italic' }}>
                    The service is provided as-is for experimental and informational use.
                </p>
            </section>

            {/* 2. Eligibility */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Eligibility</h2>
                <p className={styles.text}>You must:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Be at least <strong>13 years old</strong> (or the minimum legal age in your jurisdiction)</li>
                    <li className={styles.listItem}>Have the legal ability to accept these terms</li>
                </ul>
                <p className={styles.text}>We do not knowingly provide service to children.</p>
            </section>

            {/* 3. User Responsibilities */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. User Responsibilities</h2>
                <p className={styles.text}>
                    By using Anonym, you agree that you will <strong>not</strong>:
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Use the service for harassment, threats, or abuse</li>
                    <li className={styles.listItem}>Share illegal content</li>
                    <li className={styles.listItem}>Attempt to deanonymize other users</li>
                    <li className={styles.listItem}>Attack or attempt to compromise the infrastructure</li>
                    <li className={styles.listItem}>Circumvent rate limits or abuse reporting systems</li>
                </ul>
                <p className={styles.text}>You are fully responsible for the content you send.</p>
            </section>

            {/* 4. Abuse Reporting & Enforcement */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Abuse Reporting & Enforcement</h2>
                <p className={styles.text}>Anonym includes a <strong>client-side abuse reporting mechanism</strong>.</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Reports are metadata-based (no message content is readable)</li>
                    <li className={styles.listItem}>A user reported <strong>5 times</strong> may be automatically restricted or blocked</li>
                    <li className={styles.listItem}>Enforcement actions may include:
                        <ul className={styles.list} style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                            <li className={styles.listItem} style={{ marginBottom: '0.2rem' }}>Temporary access suspension</li>
                            <li className={styles.listItem}>Permanent blocking of cryptographic identity</li>
                        </ul>
                    </li>
                </ul>
                <p className={styles.text}>We reserve the right to act without notice to protect users and the platform.</p>
            </section>

            {/* 5. No Content Moderation Guarantee */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. No Content Moderation Guarantee</h2>
                <p className={styles.text}>Because Anonym uses <strong>end‑to‑end encryption</strong>:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>We <strong>cannot read messages</strong></li>
                    <li className={styles.listItem}>We <strong>cannot verify reported content</strong></li>
                    <li className={styles.listItem}>We <strong>cannot restore deleted messages</strong></li>
                </ul>
                <p className={styles.text}>Use discretion and trust only peers you know.</p>
            </section>

            {/* 6. Data Persistence & Loss */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Data Persistence & Loss</h2>
                <p className={styles.text}>You acknowledge and accept that:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Messages auto-delete after a limited time (typically 24 hours)</li>
                    <li className={styles.listItem}>Clearing browser storage permanently deletes your identity</li>
                    <li className={styles.listItem}>Lost identities <strong>cannot be recovered</strong></li>
                </ul>
                <p className={styles.text}>This behavior is intentional.</p>
            </section>

            {/* 7. Security Limitations */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Security Limitations</h2>
                <p className={styles.text}>Anonym <strong>does not guarantee</strong>:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Screenshot prevention</li>
                    <li className={styles.listItem}>Screen recording prevention</li>
                    <li className={styles.listItem}>Protection against malicious peers</li>
                    <li className={styles.listItem}>State‑level anonymity</li>
                </ul>
                <p className={styles.text}>Anyone can capture messages displayed on their screen.</p>
            </section>

            {/* 8. Availability & Service Changes */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Availability & Service Changes</h2>
                <p className={styles.text}>We may:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Modify or discontinue features at any time</li>
                    <li className={styles.listItem}>Change infrastructure or providers</li>
                    <li className={styles.listItem}>Impose usage limits</li>
                </ul>
                <p className={styles.text}>The service may be unavailable without notice.</p>
            </section>

            {/* 9. Disclaimer of Warranties */}
            <section className={styles.infoBox}>
                <h2 className={styles.sectionTitle} style={{ borderLeft: 'none', paddingLeft: 0, marginBottom: '1rem' }}>9. Disclaimer of Warranties</h2>
                <p className={styles.text}>Anonym is provided:</p>
                <blockquote style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', fontStyle: 'italic', color: 'var(--text-primary)', margin: '1rem 0' }}>
                    "AS IS" and "AS AVAILABLE"
                </blockquote>
                <p className={styles.text} style={{ marginBottom: '0.5rem' }}>We make <strong>no warranties</strong>, including:</p>
                <ul className={styles.list} style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li className={styles.listItem}>Fitness for a particular purpose</li>
                    <li className={styles.listItem}>Continuous availability</li>
                    <li className={styles.listItem}>Error-free operation</li>
                </ul>
                <p className={styles.text}>Use at your own risk.</p>
            </section>

            {/* 10. Limitation of Liability */}
            <section className={styles.section} style={{ marginTop: '3rem' }}>
                <h2 className={styles.sectionTitle}>10. Limitation of Liability</h2>
                <p className={styles.text}>To the maximum extent permitted by law:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>We are not liable for data loss</li>
                    <li className={styles.listItem}>We are not liable for misuse by other users</li>
                    <li className={styles.listItem}>We are not liable for indirect or consequential damages</li>
                </ul>
            </section>

            {/* 11. Changes to These Terms */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>11. Changes to These Terms</h2>
                <p className={styles.text}>
                    We may update these Terms at any time. Continued use of Anonym means you accept the updated Terms.
                </p>
            </section>

            <section className={styles.warningBox} style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', margin: 0 }}>If you do not accept these terms, do not use Anonym.</p>
            </section>

            <footer className={styles.footer} style={{ borderTop: 'none' }}>
                <Link href="/" className={styles.link}>
                    ← Return to Anonym
                </Link>
            </footer>

        </div>
    );
}

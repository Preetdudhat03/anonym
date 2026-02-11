'use client';
import Link from 'next/link';
import styles from '../landing.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <header className={styles.hero} style={{ marginBottom: '3rem', borderBottom: 'none', paddingBottom: 0 }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>← Back to Home</span>
                    </Link>
                </div>
                <h1 className={styles.heroTitle}>Privacy Policy</h1>
                <p className={styles.heroSub} style={{ fontSize: '0.9rem' }}>
                    Last updated: January 2026
                </p>
            </header>

            <section className={styles.section}>
                <p className={styles.text} style={{ fontSize: '1.1rem' }}>Welcome to Anonym.</p>
                <p className={styles.text}>
                    Anonym is a privacy‑first, browser‑based, end‑to‑end encrypted messaging application designed for short‑lived, direct communication without accounts, phone numbers, or personal profiles.
                </p>
                <p className={styles.text}>
                    This Privacy Policy explains exactly what data we handle, why we handle it, how long it exists, and what we do NOT collect. We believe transparency is essential for trust.
                </p>
            </section>

            {/* 1. Core Principles */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Core Principles</h2>
                <p className={styles.text}>Anonym is built on the following principles:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>No accounts, usernames, emails, or phone numbers</li>
                    <li className={styles.listItem}>No long‑term message storage</li>
                    <li className={styles.listItem}>No behavioral tracking or profiling</li>
                    <li className={styles.listItem}>No selling or sharing of user data</li>
                    <li className={styles.listItem}>Cryptography happens on your device, not on our servers</li>
                </ul>
                <p className={styles.text}>
                    If a feature conflicts with these principles, it is intentionally not implemented.
                </p>
            </section>

            {/* 2. What Information We Do NOT Collect */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. What Information We Do NOT Collect</h2>
                <p className={styles.text}>We do not collect:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Your name</li>
                    <li className={styles.listItem}>Your email address</li>
                    <li className={styles.listItem}>Your phone number</li>
                    <li className={styles.listItem}>Your IP address as a stored identifier</li>
                    <li className={styles.listItem}>Contact lists</li>
                    <li className={styles.listItem}>Device identifiers</li>
                    <li className={styles.listItem}>Location data</li>
                    <li className={styles.listItem}>Advertising identifiers</li>
                    <li className={styles.listItem}>Analytics profiles or tracking cookies</li>
                </ul>
                <p className={styles.text}>
                    We cannot recover accounts because we do not know who you are.
                </p>
            </section>

            {/* 3. Identity & Cryptographic Keys */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Identity & Cryptographic Keys</h2>
                <p className={styles.text}>When you use Anonym:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Your browser generates a cryptographic key pair locally using the Web Crypto API.</li>
                    <li className={styles.listItem}>The private key never leaves your device.</li>
                    <li className={styles.listItem}>A SHA‑256 hash of your public key is used as a temporary identifier to route messages.</li>
                </ul>
                <p className={styles.text}>
                    We do not know your real‑world identity and cannot associate your cryptographic identity with a person.
                </p>
                <div className={styles.warningBox}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>⚠️ Important</p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>If you clear your browser storage, your keys are permanently lost. We cannot recover them.</p>
                </div>
            </section>

            {/* 4. Message Content */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. Message Content</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>All messages are end‑to‑end encrypted before leaving your device.</li>
                    <li className={styles.listItem}>Our servers only see encrypted data blobs.</li>
                    <li className={styles.listItem}>We cannot read, decrypt, or modify message content.</li>
                </ul>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Temporary Storage</h3>
                <p className={styles.text}>To support offline delivery:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Encrypted messages may be temporarily stored on the relay server.</li>
                    <li className={styles.listItem}>Messages are automatically deleted after a maximum of 24 hours, or earlier if delivered.</li>
                    <li className={styles.listItem}>Messages are not archived, backed up, or retained beyond this window.</li>
                </ul>
            </section>

            {/* 5. Metadata We Process */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Metadata We Process</h2>
                <p className={styles.text}>While message content is encrypted, some metadata is technically required for basic operation.</p>
                <p className={styles.text}>This includes:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Connection timestamps</li>
                    <li className={styles.listItem}>Message size (in bytes)</li>
                    <li className={styles.listItem}>Sender ↔ recipient relationship (hashed identifiers only)</li>
                </ul>
                <p className={styles.text}>This metadata:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Is used solely for message routing and abuse prevention</li>
                    <li className={styles.listItem}>Is not used for analytics or profiling</li>
                    <li className={styles.listItem}>Is not shared with third parties</li>
                    <li className={styles.listItem}>Is retained only as long as operationally necessary</li>
                </ul>
                <p className={styles.text}>
                    We do not attempt to anonymize network‑level metadata beyond standard best practices.
                </p>
            </section>

            {/* 6. Cookies & Local Storage */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. Cookies & Local Storage</h2>
                <p className={styles.text}>Anonym uses local browser storage only for:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Storing cryptographic keys</li>
                    <li className={styles.listItem}>Session state</li>
                    <li className={styles.listItem}>UI preferences</li>
                </ul>
                <p className={styles.text}>We do not use:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Tracking cookies</li>
                    <li className={styles.listItem}>Third‑party cookies</li>
                    <li className={styles.listItem}>Advertising cookies</li>
                </ul>
                <p className={styles.text}>
                    Clearing your browser data will permanently erase your Anonym identity.
                </p>
            </section>

            {/* 7. Screenshots & Screen Recording */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>7. Screenshots & Screen Recording</h2>
                <p className={styles.text}>Anonym cannot technically prevent:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Screenshots</li>
                    <li className={styles.listItem}>Screen recording</li>
                    <li className={styles.listItem}>External camera capture</li>
                </ul>
                <p className={styles.text}>
                    If you share sensitive information, you do so at your own discretion. Trust is established between users, not enforced by the platform.
                </p>
            </section>

            {/* 8. Abuse Reporting */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Abuse Reporting</h2>
                <p className={styles.text}>Anonym provides a basic abuse reporting mechanism to prevent misuse.</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Reports may be associated with hashed identifiers.</li>
                    <li className={styles.listItem}>Repeated abuse reports (e.g., 5 verified reports) may result in temporary or permanent blocking of an identifier.</li>
                    <li className={styles.listItem}>Abuse handling is minimal and targeted only at protecting platform integrity.</li>
                    <li className={styles.listItem}>We do not moderate message content proactively.</li>
                </ul>
            </section>

            {/* 9. Children’s Privacy */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>9. Children’s Privacy</h2>
                <p className={styles.text}>
                    Anonym is not intended for users under the age of 13. We do not knowingly collect data from children. If you believe a child is using the service, discontinue use immediately.
                </p>
            </section>

            {/* 10. Third‑Party Services */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>10. Third‑Party Services</h2>
                <p className={styles.text}>Anonym relies on limited third‑party infrastructure strictly for operational purposes, such as:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Hosting</li>
                    <li className={styles.listItem}>Database relay for encrypted payloads</li>
                    <li className={styles.listItem}>Rate limiting and abuse prevention</li>
                </ul>
                <p className={styles.text}>
                    These services do not receive message content and are contractually restricted from data misuse.
                </p>
            </section>

            {/* 11. Legal Requests */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>11. Legal Requests</h2>
                <p className={styles.text}>Because messages are encrypted and ephemeral:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>We cannot provide readable message content.</li>
                    <li className={styles.listItem}>We have limited metadata available, if any, depending on retention timing.</li>
                    <li className={styles.listItem}>We comply with valid legal requests only to the extent technically possible.</li>
                </ul>
            </section>

            {/* 12. Security Limitations */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>12. Security Limitations</h2>
                <p className={styles.text}>No system is perfectly secure. You should not use Anonym for:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Life‑critical communication</li>
                    <li className={styles.listItem}>Whistleblowing under nation‑state threat models</li>
                    <li className={styles.listItem}>Situations requiring legal evidence trails</li>
                </ul>
                <p className={styles.text}>
                    For those use cases, consider specialized tools such as Signal with additional protections.
                </p>
            </section>

            {/* 13. Changes to This Policy */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>13. Changes to This Policy</h2>
                <p className={styles.text}>
                    This Privacy Policy may be updated as the product evolves. Changes will be reflected by updating the "Last updated" date. Continued use of Anonym constitutes acceptance of the updated policy.
                </p>
            </section>

            {/* Final Note */}
            <section className={styles.infoBox} style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Final Note</h3>
                <p className={styles.text}>Anonym is a tool — not a promise.</p>
                <p className={styles.text} style={{ fontStyle: 'italic' }}>
                    We protect message content through cryptography, but privacy ultimately depends on how you use the system and who you trust on the other end.
                </p>
                <p style={{ color: 'var(--text-primary)', marginTop: '1rem', fontWeight: 'bold' }}>Use responsibly.</p>
            </section>

            <footer className={styles.footer} style={{ borderTop: 'none' }}>
                <Link href="/" className={styles.link}>
                    ← Return to Anonym
                </Link>
            </footer>

        </div>
    );
}

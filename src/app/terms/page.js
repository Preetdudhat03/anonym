import styles from '../landing.module.css';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className={styles.container}>
            <header className={styles.hero} style={{ marginBottom: '3rem', borderBottom: 'none', paddingBottom: 0 }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>← Return to Home</span>
                    </Link>
                </div>
                <h1 className={styles.heroTitle}>Terms of Service</h1>
                <p className={styles.heroSub}>
                    Understand the rules before you communicate.
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Effective Date: February 14, 2026
                </div>
            </header>

            <main>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
                    <p className={styles.text}>
                        By accessing or using the Anonym platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must immediately cease using the Service.
                    </p>
                    <p className={styles.text}>
                        We reserve the right to modify these Terms at any time. Continued use constitutes acceptance of updated terms.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. "As Is" Disclaimer</h2>
                    <div className={styles.warningBox}>
                        <strong>NO WARRANTY:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND.
                    </div>
                    <p className={styles.text}>
                        Anonym is experimental software. We expressly disclaim all warranties, including but not limited to fitness for a particular purpose and non-infringement.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Data Loss:</strong> We are not liable for any lost messages, keys, or data due to browser clearing, server failure, or network issues.</li>
                        <li className={styles.listItem}><strong>Security Breaches:</strong> While we use industry-standard encryption, no system is impenetrable. You use the service at your own risk.</li>
                        <li className={styles.listItem}><strong>Uptime:</strong> We do not guarantee continuous, uninterrupted access to the Service.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. User Responsibilities & Conduct</h2>
                    <p className={styles.text}>
                        You are solely responsible for your use of the Service and for any content you transmit.
                    </p>
                    <div className={styles.infoBox}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Prohibited Activities</h3>
                        <ul className={styles.list} style={{ fontSize: '0.9rem' }}>
                            <li className={styles.listItem}>Using the Service for illegal activities (e.g., fraud, distributing malware, harassment).</li>
                            <li className={styles.listItem}>Attempting to reverse-engineer, decompile, or attack the Service infrastructure.</li>
                            <li className={styles.listItem}>Automated scraping or spamming of other users via Short Codes.</li>
                        </ul>
                    </div>
                    <p className={styles.text} style={{ marginTop: '1rem' }}>
                        <strong>Key Management:</strong> You are responsible for safeguarding your device and browser storage. If you lose access to your device or clear your browser data, your identity is lost forever.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Ephemeral Nature of content</h2>
                    <p className={styles.text}>
                        You acknowledge that Anonym is designed as an ephemeral communication tool.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>Messages are automatically deleted from our servers after 24 hours.</li>
                        <li className={styles.listItem}>We do not maintain backups of message content.</li>
                        <li className={styles.listItem}>Once deleted (locally or remotely), data cannot be recovered by any means.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Termination</h2>
                    <p className={styles.text}>
                        We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Governing Law</h2>
                    <p className={styles.text}>
                        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service is operated, without regard to its conflict of law provisions.
                    </p>
                </section>

                <footer className={styles.footer} style={{ borderTop: 'none', textAlign: 'left', paddingLeft: 0 }}>
                    <p>
                        <strong>Questions?</strong> See our <Link href="/privacy" className={styles.link}>Privacy Policy</Link> concerning data handling.
                    </p>
                </footer>
            </main>
        </div>
    );
}

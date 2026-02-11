import styles from '../landing.module.css';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <header className={styles.hero} style={{ marginBottom: '3rem', borderBottom: 'none', paddingBottom: 0 }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>← Return to Home</span>
                    </Link>
                </div>
                <h1 className={styles.heroTitle}>Privacy Policy</h1>
                <p className={styles.heroSub}>
                    Security by Design. Privacy by Default. <br />
                    We cannot read your messages even if compelled to do so.
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Effective Date: February 14, 2026
                </div>
            </header>

            <main>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Our Zero-Knowledge Architecture</h2>
                    <p className={styles.text}>
                        Anonym is built on a "Zero-Knowledge" architecture. This means the server acts purely as a blind relay. It moves encrypted data packets from Client A to Client B without having the cryptographic keys necessary to decrypt them.
                    </p>
                    <div className={styles.infoBox}>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>End-to-End Encryption (E2EE):</strong> All messages are encrypted on your device using X25519 (Key Exchange) and AES-GCM (Message Encryption) before they travel over the network.</li>
                            <li className={styles.listItem}><strong>Client-Side Keys:</strong> Your Identity (Ed25519 Key Pair) is generated inside your browser and stored in <code>IndexedDB</code>. The private key never leaves your device.</li>
                            <li className={styles.listItem}><strong>No Server-Side Decryption:</strong> The server literally sees random noise (ciphertext). It cannot decrypt your chats.</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Information We Do NOT Collect</h2>
                    <p className={styles.text}>
                        We have intentionally designed our database schema to technically limit what we can know about you.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>No Personal Identifiers:</strong> We do not collect names, emails, phone numbers, or social profiles.</li>
                        <li className={styles.listItem}><strong>No Plaintext Content:</strong> We store only encrypted blobs. We have no way to restore or view your messages.</li>
                        <li className={styles.listItem}><strong>No Persistent Session Cookies:</strong> We do not use third-party tracking cookies or analytics pixels (e.g., Google Analytics, Facebook Pixel).</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Information We Technically Must Collect</h2>
                    <p className={styles.text}>
                        To function as a relay server and prevent abuse, we must process minimal metadata.
                    </p>
                    <div className={styles.grid}>
                        <div className={styles.infoBox}>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Ephemeral Data</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <strong>IP Addresses & Timestamps:</strong> Collected solely for rate-limiting (preventing DDoS) and abuse detection. These logs are ephemeral and rotated frequently.
                            </p>
                        </div>
                        <div className={styles.infoBox}>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Protocol Metadata</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <strong>Public Keys:</strong> Required to route messages to the correct recipient.<br /><br />
                                <strong>Ciphertext Blobs:</strong> The encrypted content itself, stored temporarily until retrieval or expiration.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Data Retention & Destruction</h2>
                    <p className={styles.text}>
                        Data liability is a risk we refuse to accept. Therefore, we delete data aggressively.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Message TTL (Time-To-Live):</strong> All messages, delivered or undelivered, are hard-deleted from our database automatically after 24 hours.</li>
                        <li className={styles.listItem}><strong>"Delete Chat" Feature:</strong> If either participant initiates a chat deletion, the server immediately purges all stored messages associated with that conversation pair.</li>
                        <li className={styles.listItem}><strong>Identity Wipe:</strong> If you verify your identity and request account deletion, your record is removed from the public directory.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Local Storage (Your Device)</h2>
                    <p className={styles.text}>
                        Because we don't hold your keys, your browser acts as your database. We use the browser's <code>IndexedDB</code> and <code>LocalStorage</code> to persist your Identity Keys.
                    </p>
                    <div className={styles.warningBox}>
                        <strong>Critical Warning:</strong> If you clear your browser's "Site Data" or "Cookies", your Private Key is destroyed. Since we do not have a copy, <strong>your account and all messages will be permanently unrecoverable.</strong>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Third-Party Infrastructure</h2>
                    <p className={styles.text}>
                        We rely on trusted cloud providers to keep the lights on. They may have visibility into network-level packet data (IP headers), but never content.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Supabase (Database):</strong> Stores encrypted blobs and public keys.</li>
                        <li className={styles.listItem}><strong>Vercel (Hosting):</strong> Serves the application logic and API.</li>
                    </ul>
                </section>

                <footer className={styles.footer} style={{ borderTop: 'none', textAlign: 'left', paddingLeft: 0 }}>
                    <p>
                        <strong>Contact:</strong> Since we don't collect emails, we cannot verify users via email support. Setup a chat with our admin Short Code if available, or submit a GitHub issue for technical bugs.
                    </p>
                </footer>
            </main>
        </div>
    );
}

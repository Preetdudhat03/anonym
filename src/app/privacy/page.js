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
                    <h2 className={styles.sectionTitle}>1. The "Zero-Knowledge" Promise</h2>
                    <p className={styles.text}>
                        Think of Anonym like a digital tunnel. We built the tunnel, but we cannot see what travels through it.
                    </p>
                    <div className={styles.infoBox}>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>We are Blind:</strong> Your messages are locked (encrypted) on your phone/computer before they even touch our wires. Only the person you are chatting with has the key to unlock them.</li>
                            <li className={styles.listItem}><strong>No Master Key:</strong> We do not have a "backdoor." Even if the police asked us to read your messages, we technologically cannot do it.</li>
                            <li className={styles.listItem}><strong>Your Device is the Vault:</strong> Your "Identity" is just a file on your device. We don't store passwords or accounts.</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. What We Do NOT Collect</h2>
                    <p className={styles.text}>
                        We designed our system to know as little about you as possible.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>No Personal Info:</strong> We don't want your name, email, phone number, or social media profile.</li>
                        <li className={styles.listItem}><strong>No Message Content:</strong> We see "jumbled noise" (encrypted code), not your actual text.</li>
                        <li className={styles.listItem}><strong>No Creepy Tracking:</strong> We don't use Google Analytics, Facebook Pixels, or cookie trackers that follow you around the web.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. What We Have To Collect (To Make It Work)</h2>
                    <p className={styles.text}>
                        To send the mail, the postman needs an address on the envelope. Similarly, our servers need a tiny bit of technical data to deliver your messages.
                    </p>
                    <div className={styles.grid}>
                        <div className={styles.infoBox}>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Temporary Logs</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <strong>IP Addresses:</strong> We briefly see your internet address to prevent spam/attacks. These logs are wiped frequently.
                            </p>
                        </div>
                        <div className={styles.infoBox}>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Delivery Data</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <strong>Public Keys:</strong> Like a mailbox number, so we know where to drop the message.<br /><br />
                                <strong>The Locked Message:</strong> We hold the encrypted message until your friend picks it up (or for 24 hours).
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. How We Delete Data</h2>
                    <p className={styles.text}>
                        We are allergic to data hoarding. Here is how we clean up:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>24-Hour Timer:</strong> Every message has a self-destruct timer. After 24 hours, poof—it's gone from our servers forever.</li>
                        <li className={styles.listItem}><strong>"Delete Chat" Button:</strong> If you or your friend hits "Delete Chat," we immediately scrub the conversation from our database.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Important Warning</h2>
                    <div className={styles.warningBox}>
                        <strong>If You Clear Your Browser:</strong> Since we don't have your password or account, your identity lives 100% in your browser history/cache. If you clear your history or cookies, <strong>you disappear forever</strong>. We cannot recover your account.
                    </div>
                </section>

                <footer className={styles.footer} style={{ borderTop: 'none', textAlign: 'left', paddingLeft: 0 }}>
                    <p>
                        <strong>Contact:</strong> Since we don't collect emails, we can't really "lookup" your account to help you. If the system breaks, file a bug report on GitHub.
                    </p>
                </footer>
            </main>
        </div>
    );
}

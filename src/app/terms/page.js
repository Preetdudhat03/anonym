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
                    <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
                    <p className={styles.text}>
                        By using Anonym, you agree to these rules. Ideally, we want you to use our tool safely and responsibly. If you don't agree, please close this tab.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Use At Your Own Risk ("As Is")</h2>
                    <div className={styles.warningBox}>
                        <strong>NO PROMISES:</strong> This software is experimental. It might break. It might have bugs.
                    </div>
                    <p className={styles.text}>
                        We do not guarantee that the service will always be online or that it is 100% bug-free.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Data Loss:</strong> If your browser crashes or you clear your cookies, your account is gone. We cannot fix it.</li>
                        <li className={styles.listItem}><strong>Not for Life-Critical Use:</strong> Do not rely on Anonym for emergency services or situations where failure could cause harm.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Be A Good Human</h2>
                    <p className={styles.text}>
                        You are responsible for what you type.
                    </p>
                    <div className={styles.infoBox}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Do Not:</h3>
                        <ul className={styles.list} style={{ fontSize: '0.9rem' }}>
                            <li className={styles.listItem}>Use Anonym for illegal acts (fraud, malware, violence).</li>
                            <li className={styles.listItem}>Spam strangers with friend codes.</li>
                            <li className={styles.listItem}>Try to hack or break our servers.</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Disappearing Messages</h2>
                    <p className={styles.text}>
                        Understand that this is a temporary chat tool.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>Messages delete automatically after 24 hours.</li>
                        <li className={styles.listItem}>Once deleted, they are gone forever. No backups.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. We Can Ban You</h2>
                    <p className={styles.text}>
                        If we detect abuse (like spamming thousands of requests), we can block your IP address to protect other users.
                    </p>
                </section>

                <footer className={styles.footer} style={{ borderTop: 'none', textAlign: 'left', paddingLeft: 0 }}>
                    <p>
                        <strong>Questions?</strong> Check our <Link href="/privacy" className={styles.link}>Privacy Policy</Link> to see how we handle data.
                    </p>
                </footer>
            </main>
        </div>
    );
}

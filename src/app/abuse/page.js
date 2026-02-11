'use client';
import Link from 'next/link';
import styles from '../landing.module.css';

export default function AbusePage() {
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
                <h1 className={styles.heroTitle}>Abuse Reporting Policy</h1>
                <p className={styles.heroSub} style={{ fontSize: '0.9rem' }}>
                    <strong>Last updated:</strong> January 2026
                </p>
            </header>

            {/* 1. Purpose */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Purpose of This Policy</h2>
                <p className={styles.text}>
                    Anonym is designed for private, anonymous, and ephemeral communication. Privacy does <strong>not</strong> mean absence of responsibility. This policy explains how abuse is handled while preserving Anonym’s zero-knowledge and end‑to‑end encrypted architecture.
                </p>
                <p className={styles.text}>
                    We cannot read messages. We can act on <strong>behavioral patterns, reports, and cryptographic identifiers</strong>.
                </p>
            </section>

            {/* 2. What Counts as Abuse */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. What Counts as Abuse</h2>
                <p className={styles.text}>Abuse includes, but is not limited to:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Harassment, threats, or intimidation</li>
                    <li className={styles.listItem}>Repeated unsolicited contact (spam)</li>
                    <li className={styles.listItem}>Attempts to coerce, blackmail, or extort</li>
                    <li className={styles.listItem}>Impersonation or deception</li>
                    <li className={styles.listItem}>Sharing illegal content or coordinating illegal activity</li>
                    <li className={styles.listItem}>Attempts to exploit or attack the Anonym service</li>
                </ul>
                <p className={styles.text}>
                    Anonym does <strong>not</strong> judge opinions or private consensual conversations.
                </p>
            </section>

            {/* 3. What We Can and Cannot See */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. What We Can and Cannot See</h2>

                <div className={styles.grid}>
                    <div className={styles.infoBox} style={{ border: '1px solid var(--status-danger)', background: 'rgba(217, 83, 79, 0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--status-danger)', marginBottom: '0.5rem', marginTop: 0 }}>We CANNOT see:</h3>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Message content</li>
                            <li className={styles.listItem}>Images or files (file sharing is not supported)</li>
                            <li className={styles.listItem}>User identities (names, emails, phone numbers)</li>
                        </ul>
                    </div>

                    <div className={styles.infoBox} style={{ border: '1px solid var(--status-secure)', background: 'rgba(123, 196, 127, 0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--status-secure)', marginBottom: '0.5rem', marginTop: 0 }}>We CAN see:</h3>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Anonymous cryptographic addresses</li>
                            <li className={styles.listItem}>Connection timestamps</li>
                            <li className={styles.listItem}>Message frequency and size</li>
                            <li className={styles.listItem}>Abuse reports linked to an address</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 4. How Abuse Reporting Works */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>4. How Abuse Reporting Works</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>A user may report another address from within the chat interface.</li>
                    <li className={styles.listItem}>Reports are linked only to the <strong>reported cryptographic address</strong>.</li>
                    <li className={styles.listItem}>Reports do <strong>not</strong> include message content.</li>
                    <li className={styles.listItem}>Each report is timestamped and stored securely.</li>
                </ul>
                <p className={styles.text}>Reports are rate‑limited to prevent false reporting.</p>
            </section>

            {/* 5. Enforcement Model */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>5. Enforcement Model</h2>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Threshold-Based Action</h3>
                <ul className={styles.list} style={{ marginBottom: '1.5rem' }}>
                    <li className={styles.listItem}><strong>1–2 reports</strong> → Logged, no action</li>
                    <li className={styles.listItem}><strong>3–4 reports</strong> → Address flagged for monitoring</li>
                    <li className={styles.listItem}><strong style={{ color: 'var(--status-danger)' }}>5 confirmed reports</strong> → Automatic enforcement (Blocking)</li>
                </ul>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Enforcement Actions May Include:</h3>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Temporary communication restrictions</li>
                    <li className={styles.listItem}>Permanent address suspension</li>
                    <li className={styles.listItem}>Blocking access to the relay server</li>
                </ul>
                <p className={styles.text}>
                    Actions are applied <strong>only to the abusive address</strong>, not IP-wide unless required for security.
                </p>
            </section>

            {/* 6. No Appeal, No Recovery */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>6. No Appeal, No Recovery</h2>
                <p className={styles.text}>Because Anonym has:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>No accounts</li>
                    <li className={styles.listItem}>No identities</li>
                    <li className={styles.listItem}>No recovery mechanisms</li>
                </ul>
                <p className={styles.text} style={{ fontWeight: 'bold' }}>Suspended addresses cannot be restored.</p>
                <p className={styles.text}>Users may generate a new identity, but repeat abuse patterns may result in broader restrictions.</p>
            </section>

            {/* 7. False Reporting Policy */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>7. False Reporting Policy</h2>
                <p className={styles.text}>
                    Submitting false or malicious abuse reports is itself considered abuse and may result in:
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Loss of reporting privileges</li>
                    <li className={styles.listItem}>Temporary or permanent restrictions</li>
                </ul>
            </section>

            {/* 8. Legal Cooperation */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>8. Legal Cooperation</h2>
                <p className={styles.text}>
                    Anonym does not proactively monitor content. If legally required:
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>We may provide <strong>metadata only</strong> (timestamps, addresses, report counts)</li>
                    <li className={styles.listItem}>We cannot provide message content due to encryption</li>
                </ul>
            </section>

            {/* 9. User Responsibility */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>9. User Responsibility</h2>
                <p className={styles.text}>By using Anonym, you agree:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>To communicate lawfully</li>
                    <li className={styles.listItem}>Not to harass or harm others</li>
                    <li className={styles.listItem}>To accept enforcement decisions as final</li>
                </ul>
                <p className={styles.text}>Privacy is a shared responsibility.</p>
            </section>

            {/* 10. Policy Updates */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>10. Policy Updates</h2>
                <p className={styles.text}>
                    This policy may evolve as Anonym grows. Material changes will be reflected on the landing page.
                </p>
            </section>

            <section className={styles.infoBox} style={{ textAlign: 'center', marginTop: '4rem', borderTop: '4px solid var(--accent-primary)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Anonym</h3>
                <p className={styles.text} style={{ fontSize: '1.1rem', margin: 0 }}>Private by design. Accountable by necessity.</p>
            </section>

            <footer className={styles.footer} style={{ borderTop: 'none' }}>
                <Link href="/" className={styles.link}>
                    ← Return to Anonym
                </Link>
            </footer>

        </div>
    );
}

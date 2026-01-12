'use client';
import Link from 'next/link';

export default function AbusePage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', color: 'var(--text-primary)' }}>
            {/* Back Link */}
            <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Back to Home
            </Link>

            {/* Header */}
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Abuse Reporting & Enforcement Policy</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Last updated: January 2026
            </p>

            {/* 1. Purpose */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>1. Purpose of This Policy</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Anonym is designed for private, anonymous, and ephemeral communication. Privacy does <strong>not</strong> mean absence of responsibility. This policy explains how abuse is handled while preserving Anonym’s zero-knowledge and end‑to‑end encrypted architecture.
                </p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    We cannot read messages. We can act on <strong>behavioral patterns, reports, and cryptographic identifiers</strong>.
                </p>
            </section>

            {/* 2. What Counts as Abuse */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>2. What Counts as Abuse</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Abuse includes, but is not limited to:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Harassment, threats, or intimidation</li>
                    <li>Repeated unsolicited contact (spam)</li>
                    <li>Attempts to coerce, blackmail, or extort</li>
                    <li>Impersonation or deception</li>
                    <li>Sharing illegal content or coordinating illegal activity</li>
                    <li>Attempts to exploit or attack the Anonym service</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Anonym does <strong>not</strong> judge opinions or private consensual conversations.
                </p>
            </section>

            {/* 3. What We Can and Cannot See */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>3. What We Can and Cannot See</h2>

                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div style={{ padding: '1rem', border: '1px solid var(--status-danger)', borderRadius: '8px', background: 'rgba(217, 83, 79, 0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--status-danger)', marginBottom: '0.5rem' }}>We CANNOT see:</h3>
                        <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                            <li>Message content</li>
                            <li>Images or files (file sharing is not supported)</li>
                            <li>User identities (names, emails, phone numbers)</li>
                        </ul>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--status-secure)', borderRadius: '8px', background: 'rgba(123, 196, 127, 0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--status-secure)', marginBottom: '0.5rem' }}>We CAN see:</h3>
                        <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                            <li>Anonymous cryptographic addresses</li>
                            <li>Connection timestamps</li>
                            <li>Message frequency and size</li>
                            <li>Abuse reports linked to an address</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 4. How Abuse Reporting Works */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>4. How Abuse Reporting Works</h2>
                <ol style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>A user may report another address from within the chat interface.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Reports are linked only to the <strong>reported cryptographic address</strong>.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Reports do <strong>not</strong> include message content.</li>
                    <li>Each report is timestamped and stored securely.</li>
                </ol>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>Reports are rate‑limited to prevent false reporting.</p>
            </section>

            {/* 5. Enforcement Model */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>5. Enforcement Model</h2>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Threshold-Based Action</h3>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'none', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>• <strong>1–2 reports</strong> → Logged, no action</li>
                    <li style={{ marginBottom: '0.5rem' }}>• <strong>3–4 reports</strong> → Address flagged for monitoring</li>
                    <li>• <strong style={{ color: 'var(--status-danger)' }}>5 confirmed reports</strong> → Automatic enforcement</li>
                </ul>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Enforcement Actions May Include:</h3>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Temporary communication restrictions</li>
                    <li>Permanent address suspension</li>
                    <li>Blocking access to the relay server</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Actions are applied <strong>only to the abusive address</strong>, not IP-wide unless required for security.
                </p>
            </section>

            {/* 6. No Appeal, No Recovery */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>6. No Appeal, No Recovery</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Because Anonym has:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>No accounts</li>
                    <li>No identities</li>
                    <li>No recovery mechanisms</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Suspended addresses cannot be restored.</p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>Users may generate a new identity, but repeat abuse patterns may result in broader restrictions.</p>
            </section>

            {/* 7. False Reporting Policy */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>7. False Reporting Policy</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Submitting false or malicious abuse reports is itself considered abuse and may result in:
                </p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Loss of reporting privileges</li>
                    <li>Temporary or permanent restrictions</li>
                </ul>
            </section>

            {/* 8. Legal Cooperation */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>8. Legal Cooperation</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Anonym does not proactively monitor content. If legally required:
                </p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>We may provide <strong>metadata only</strong> (timestamps, addresses, report counts)</li>
                    <li>We cannot provide message content due to encryption</li>
                </ul>
            </section>

            {/* 9. User Responsibility */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>9. User Responsibility</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>By using Anonym, you agree:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>To communicate lawfully</li>
                    <li>Not to harass or harm others</li>
                    <li>To accept enforcement decisions as final</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>Privacy is a shared responsibility.</p>
            </section>

            {/* 10. Policy Updates */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>10. Policy Updates</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    This policy may evolve as Anonym grows. Material changes will be reflected on the landing page.
                </p>
            </section>

            <section style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '8px', textAlign: 'center', borderTop: '4px solid var(--accent-primary)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Anonym</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Private by design. Accountable by necessity.</p>
            </section>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
                    ← Return to Anonym
                </Link>
            </div>

        </div>
    );
}

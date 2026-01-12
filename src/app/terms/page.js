'use client';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', color: 'var(--text-primary)' }}>
            {/* Back Link */}
            <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Back to Home
            </Link>

            {/* Header */}
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Terms of Use</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '0.9rem' }}>
                <strong>Effective Date:</strong> January 2026
            </p>

            {/* Intro */}
            <p style={{ lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Welcome to <strong>Anonym</strong>. By accessing or using this website and application, you agree to these Terms of Use. If you do not agree, do not use the service.
            </p>

            {/* 1. What Anonym Is */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>1. What Anonym Is</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Anonym is a <strong>browser-based, one‑to‑one encrypted messaging tool</strong> designed for short‑lived private conversations.
                </p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>No accounts</li>
                    <li>No passwords</li>
                    <li>No phone numbers</li>
                    <li>No message history guarantees</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    The service is provided as-is for experimental and informational use.
                </p>
            </section>

            {/* 2. Eligibility */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>2. Eligibility</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>You must:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Be at least <strong>13 years old</strong> (or the minimum legal age in your jurisdiction)</li>
                    <li>Have the legal ability to accept these terms</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>We do not knowingly provide service to children.</p>
            </section>

            {/* 3. User Responsibilities */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>3. User Responsibilities</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    By using Anonym, you agree that you will <strong>not</strong>:
                </p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Use the service for harassment, threats, or abuse</li>
                    <li>Share illegal content</li>
                    <li>Attempt to deanonymize other users</li>
                    <li>Attack or attempt to compromise the infrastructure</li>
                    <li>Circumvent rate limits or abuse reporting systems</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>You are fully responsible for the content you send.</p>
            </section>

            {/* 4. Abuse Reporting & Enforcement */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>4. Abuse Reporting & Enforcement</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Anonym includes a <strong>client-side abuse reporting mechanism</strong>.</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Reports are metadata-based (no message content is readable)</li>
                    <li>A user reported <strong>5 times</strong> may be automatically restricted or blocked</li>
                    <li>Enforcement actions may include:
                        <ul style={{ marginTop: '0.5rem' }}>
                            <li>Temporary access suspension</li>
                            <li>Permanent blocking of cryptographic identity</li>
                        </ul>
                    </li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>We reserve the right to act without notice to protect users and the platform.</p>
            </section>

            {/* 5. No Content Moderation Guarantee */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>5. No Content Moderation Guarantee</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Because Anonym uses <strong>end‑to‑end encryption</strong>:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>We <strong>cannot read messages</strong></li>
                    <li>We <strong>cannot verify reported content</strong></li>
                    <li>We <strong>cannot restore deleted messages</strong></li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>Use discretion and trust only peers you know.</p>
            </section>

            {/* 6. Data Persistence & Loss */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>6. Data Persistence & Loss</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>You acknowledge and accept that:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Messages auto-delete after a limited time (typically 24 hours)</li>
                    <li>Clearing browser storage permanently deletes your identity</li>
                    <li>Lost identities <strong>cannot be recovered</strong></li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>This behavior is intentional.</p>
            </section>

            {/* 7. Security Limitations */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>7. Security Limitations</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Anonym <strong>does not guarantee</strong>:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Screenshot prevention</li>
                    <li>Screen recording prevention</li>
                    <li>Protection against malicious peers</li>
                    <li>State‑level anonymity</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>Anyone can capture messages displayed on their screen.</p>
            </section>

            {/* 8. Availability & Service Changes */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>8. Availability & Service Changes</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>We may:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Modify or discontinue features at any time</li>
                    <li>Change infrastructure or providers</li>
                    <li>Impose usage limits</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>The service may be unavailable without notice.</p>
            </section>

            {/* 9. Disclaimer of Warranties */}
            <section style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>9. Disclaimer of Warranties</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Anonym is provided:</p>
                <blockquote style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', fontStyle: 'italic', color: 'var(--text-primary)', margin: '1rem 0' }}>
                    "AS IS" and "AS AVAILABLE"
                </blockquote>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>We make <strong>no warranties</strong>, including:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Fitness for a particular purpose</li>
                    <li>Continuous availability</li>
                    <li>Error-free operation</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>Use at your own risk.</p>
            </section>

            {/* 10. Limitation of Liability */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>10. Limitation of Liability</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>To the maximum extent permitted by law:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>We are not liable for data loss</li>
                    <li>We are not liable for misuse by other users</li>
                    <li>We are not liable for indirect or consequential damages</li>
                </ul>
            </section>

            {/* 11. Changes to These Terms */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>11. Changes to These Terms</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    We may update these Terms at any time. Continued use of Anonym means you accept the updated Terms.
                </p>
            </section>

            {/* 12. Contact */}
            {/*<section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>12. Contact</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    For legal or policy questions: <br />
                    <strong>Email:</strong> <a href="mailto:contact@anonym-app.com" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>contact@anonym-app.com</a>
                </p>
            </section>*/}

            <section style={{ marginTop: '4rem', padding: '1.5rem', background: 'var(--bg-surface)', borderTop: '2px solid var(--status-danger)', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>If you do not accept these terms, do not use Anonym.</p>
            </section>

            {/* Footer Back Link */}
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
                    ← Return to Anonym
                </Link>
            </div>

        </div>
    );
}

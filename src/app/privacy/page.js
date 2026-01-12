'use client';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', color: 'var(--text-primary)' }}>
            <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Back to Home
            </Link>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Last updated: January 2026</p>

            <section style={{ marginBottom: '3rem' }}>
                <p style={{ lineHeight: '1.6', marginBottom: '1rem', fontSize: '1.1rem' }}>Welcome to Anonym.</p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Anonym is a privacy‑first, browser‑based, end‑to‑end encrypted messaging application designed for short‑lived, direct communication without accounts, phone numbers, or personal profiles.
                </p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    This Privacy Policy explains exactly what data we handle, why we handle it, how long it exists, and what we do NOT collect. We believe transparency is essential for trust.
                </p>
            </section>

            {/* 1. Core Principles */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>1. Core Principles</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Anonym is built on the following principles:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>No accounts, usernames, emails, or phone numbers</li>
                    <li>No long‑term message storage</li>
                    <li>No behavioral tracking or profiling</li>
                    <li>No selling or sharing of user data</li>
                    <li>Cryptography happens on your device, not on our servers</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    If a feature conflicts with these principles, it is intentionally not implemented.
                </p>
            </section>

            {/* 2. What Information We Do NOT Collect */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>2. What Information We Do NOT Collect</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>We do not collect:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Your phone number</li>
                    <li>Your IP address as a stored identifier</li>
                    <li>Contact lists</li>
                    <li>Device identifiers</li>
                    <li>Location data</li>
                    <li>Advertising identifiers</li>
                    <li>Analytics profiles or tracking cookies</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    We cannot recover accounts because we do not know who you are.
                </p>
            </section>

            {/* 3. Identity & Cryptographic Keys */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>3. Identity & Cryptographic Keys</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>When you use Anonym:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Your browser generates a cryptographic key pair locally using the Web Crypto API.</li>
                    <li>The private key never leaves your device.</li>
                    <li>A SHA‑256 hash of your public key is used as a temporary identifier to route messages.</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    We do not know your real‑world identity and cannot associate your cryptographic identity with a person.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(217, 83, 79, 0.1)', borderLeft: '3px solid var(--status-danger)', borderRadius: '4px' }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>⚠️ Important</p>
                    <p style={{ color: 'var(--text-secondary)' }}>If you clear your browser storage, your keys are permanently lost. We cannot recover them.</p>
                </div>
            </section>

            {/* 4. Message Content */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>4. Message Content</h2>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>All messages are end‑to‑end encrypted before leaving your device.</li>
                    <li>Our servers only see encrypted data blobs.</li>
                    <li>We cannot read, decrypt, or modify message content.</li>
                </ul>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Temporary Storage</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>To support offline delivery:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Encrypted messages may be temporarily stored on the relay server.</li>
                    <li>Messages are automatically deleted after a maximum of 24 hours, or earlier if delivered.</li>
                    <li>Messages are not archived, backed up, or retained beyond this window.</li>
                </ul>
            </section>

            {/* 5. Metadata We Process */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>5. Metadata We Process</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>While message content is encrypted, some metadata is technically required for basic operation.</p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>This includes:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Connection timestamps</li>
                    <li>Message size (in bytes)</li>
                    <li>Sender ↔ recipient relationship (hashed identifiers only)</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>This metadata:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Is used solely for message routing and abuse prevention</li>
                    <li>Is not used for analytics or profiling</li>
                    <li>Is not shared with third parties</li>
                    <li>Is retained only as long as operationally necessary</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    We do not attempt to anonymize network‑level metadata beyond standard best practices.
                </p>
            </section>

            {/* 6. Cookies & Local Storage */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>6. Cookies & Local Storage</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Anonym uses local browser storage only for:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Storing cryptographic keys</li>
                    <li>Session state</li>
                    <li>UI preferences</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>We do not use:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Tracking cookies</li>
                    <li>Third‑party cookies</li>
                    <li>Advertising cookies</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Clearing your browser data will permanently erase your Anonym identity.
                </p>
            </section>

            {/* 7. Screenshots & Screen Recording */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>7. Screenshots & Screen Recording</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Anonym cannot technically prevent:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Screenshots</li>
                    <li>Screen recording</li>
                    <li>External camera capture</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    If you share sensitive information, you do so at your own discretion. Trust is established between users, not enforced by the platform.
                </p>
            </section>

            {/* 8. Abuse Reporting */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>8. Abuse Reporting</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Anonym provides a basic abuse reporting mechanism to prevent misuse.</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                    <li>Reports may be associated with hashed identifiers.</li>
                    <li>Repeated abuse reports (e.g., 5 verified reports) may result in temporary or permanent blocking of an identifier.</li>
                    <li>Abuse handling is minimal and targeted only at protecting platform integrity.</li>
                    <li>We do not moderate message content proactively.</li>
                </ul>
            </section>

            {/* 9. Children’s Privacy */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>9. Children’s Privacy</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Anonym is not intended for users under the age of 13. We do not knowingly collect data from children. If you believe a child is using the service, discontinue use immediately.
                </p>
            </section>

            {/* 10. Third‑Party Services */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>10. Third‑Party Services</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Anonym relies on limited third‑party infrastructure strictly for operational purposes, such as:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Hosting</li>
                    <li>Database relay for encrypted payloads</li>
                    <li>Rate limiting and abuse prevention</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    These services do not receive message content and are contractually restricted from data misuse.
                </p>
            </section>

            {/* 11. Legal Requests */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>11. Legal Requests</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Because messages are encrypted and ephemeral:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>We cannot provide readable message content.</li>
                    <li>We have limited metadata available, if any, depending on retention timing.</li>
                    <li>We comply with valid legal requests only to the extent technically possible.</li>
                </ul>
            </section>

            {/* 12. Security Limitations */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>12. Security Limitations</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No system is perfectly secure. You should not use Anonym for:</p>
                <ul style={{ lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '1.5rem', listStyleType: 'disc', marginBottom: '1rem' }}>
                    <li>Life‑critical communication</li>
                    <li>Whistleblowing under nation‑state threat models</li>
                    <li>Situations requiring legal evidence trails</li>
                </ul>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    For those use cases, consider specialized tools such as Signal with additional protections.
                </p>
            </section>

            {/* 13. Changes to This Policy */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>13. Changes to This Policy</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    This Privacy Policy may be updated as the product evolves. Changes will be reflected by updating the "Last updated" date. Continued use of Anonym constitutes acceptance of the updated policy.
                </p>
            </section>

            {/* 14. Contact */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>14. Contact</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Because Anonym does not collect personal information, support communication is limited.
                </p>
                {/*<p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    For general inquiries or abuse reports: <br />
                    <a href="mailto:support@anonym-app.com" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>support@anonym-app.com</a>
                </p>*/}
            </section>

            {/* Final Note */}
            <section style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Final Note</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Anonym is a tool — not a promise.</p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    We protect message content through cryptography, but privacy ultimately depends on how you use the system and who you trust on the other end.
                </p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-primary)', marginTop: '1rem', fontWeight: 'bold' }}>Use responsibly.</p>
            </section>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
                    ← Return to Anonym
                </Link>
            </div>

        </div>
    );
}

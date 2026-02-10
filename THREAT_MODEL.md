# Threat Model & Security Boundaries

## 1. System Asset Definition
*   **Assets to Protect**:
    *   **User Identity**: The link between a physical person and their cryptographic keys.
    *   **Message Content**: The plaintext of private conversations.
    *   **Sender History**: Implementation now stores a "Sender Copy" of messages to improve UX. This is also encrypted but adds a data point.
    *   **Social Graph**: Usage patterns revealing who is talking to whom.
*   **Adversaries**:
    *   **Compromised Server**: Attacker has full read/write access to the database and Redis.
    *   **Passive Network Observer**: ISP or local network sniffing traffic.
    *   **Malicious Insider**: DB Admin with root access.
    *   **Device Seizure**: Physical access to a user's unlocked device.

## 2. Security Guarantees (What IS Protected)
1.  **Content Confidentiality**: The server cannot decrypt messages. Only the holder of the private key can.
    *   **Sender Copies**: Even the new "Sender Copy" is encrypted with the Sender's Public Key. The server holds two encrypted blobs (Sender's + Recipient's) but can read neither.
2.  **Message Integrity**: Modified ciphertext will fail decryption (AES-GCM Auth Tag).
3.  **Identity Unlinkability**: No phone numbers or emails are collected. Users are just random cryptographic strings.
4.  **Forward Secrecy (Limited)**: Messages are encrypted with ephemeral keys. Compromise of the Long-Term Identity Key does NOT decrypt past messages (assuming ephemeral keys were deleted).
    *   *Note*: This relies on the client successfully deleting ephemeral keys.
5.  **Transcript Deniability**: Since we do not sign the encrypted messages with the Identity Key (only the handshake is signed, or encryption is repudiable), a leaked transcript may not mathematically prove who sent it (depending on exact implementation of auth binding). *Clarification*: In this specific architecture, we sign the Auth Challenge, but we do NOT sign every individual message ciphertext with the Identity Key. We use the Session Key.

## 3. Known Vulnerabilities (What is NOT Protected)
1.  **Metadata Leakage**:
    *   The server knows WHO is talking to WHOM (Sender/Receiver public keys are visible to route packets).
    *   The server knows WHEN they talk and approximately HOW MUCH data is exchanged.
    *   **Mitigation**: We apply padding and random delays, but this only obfuscates, doesn't hide.
2.  **Device Compromise**:
    *   If an attacker gets the device and `IndexedDB` is readable, `Private Keys` are stolen.
    *   Identity is permanently compromised.
    *   **No Recovery**: There is no "Forgot Password". Lost device = Lost Identity.
3.  **No "Future Secrecy" (Post-Compromise Security)**:
    *   If a long-term private key is stolen, the attacker can impersonate the user in *future* chats.
    *   We do NOT implement the Double Ratchet, so we cannot self-heal a compromised session.
4.  **Traffic Analysis**: Deep Packet Inspection (DPI) can likely identify the protocol as WebSocket traffic.

## 4. Trust Model
*   **Server**: Untrusted for Content. Trusted for Routing and Availability.
*   **Client Device**: Trusted. Must remain secure.
*   **Network**: Untrusted. Assumed hostile.

## 5. Failure Scenarios
*   **Database Leak**: Attackers see public keys, encrypted blobs, and timestamps. No plaintext is revealed.
*   **Server Seizure**: Authorities can see who talked to whom (metadata) but cannot read the chats.
*   **Client Loss**: User loses access. No one else gains access unless they have the device.

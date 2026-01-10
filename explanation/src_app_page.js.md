File: s:\anonym\src\app\page.js

Overview:
This is the Home/Landing Page of the application. It serves two main purposes:
1. If the user is NEW: It shows the "Generate Key Identity" screen.
2. If the user is LOGGED IN: It shows the Dashboard with their Friend Code, allowing them to start a new chat.

Detailed Line-by-Line Explanation:

8: export default function Home() {
9:   const { identity, loading, createIdentity, resetIdentity } = useIdentity();
Reason: Use the Identity hook to check if we are logged in.

11:   const { status, shortCode } = useChat(identity, null);
Reason: Connect to the chat server immediately (with null peer) just to establish presence and get our own Short Code from the auth handshake.

13:   const [targetAddress, setTargetAddress] = useState('');
Reason: Input state for the "Enter Friend Code" box.

22:   const handleStartChat = async (e) => {
Reason: Function triggered when user clicks "Start Secure Chat".

30:     if (target.includes('-') && target.length <= 15) {
Reason: Heuristic check: If input looks like a Short Code (has hyphens, short length), we treat it as a code, not a raw hash.

32:         const res = await fetch(`/api/code/${target}`);
Reason: Call the API to resolve the code to an address.

38:         target = data.address; // Use the Real Hash
Reason: Update the 'target' variable provided to the router. We navigate to the HEX address, not the short code. The URL routing uses the hash.

45:     router.push(`/chat/${target}`);
Reason: Navigate to the chat page: `/chat/a3f9...`.

50:   if (!identity) {
Reason: Render the "Welcome" screen if no identity.

63:           <button onClick={createIdentity} className={styles.button}>
64:             Generate Key Identity
65:           </button>
Reason: Button to generate keys and "login".

73:   return (
Reason: Render the Dashboard if identity exists.

81:             className={styles.addressBox}
82:             onClick={() => {
83:               if (shortCode) {
84:                 navigator.clipboard.writeText(shortCode);
Reason: Click-to-copy functionality for the user's own Friend Code.

113:           {/* TRUST PANEL */}
Reason: Informational section explaining privacy guarantees to re-assure the user.

146:             const word = prompt("TYPE 'DESTROY' TO DELETE YOUR IDENTITY PERMANENTLY...");
Reason: Safety check before deleting keys. Since there is no "Cloud Recovery", deleting local keys means the account is gone forever. We force the user to type "DESTROY" to confirm they understand this.

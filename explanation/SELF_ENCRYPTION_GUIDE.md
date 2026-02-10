# Self-Encrypted Sender Copy

## Why senders can now see their messages
In privacy-focused messaging, "seeing what you just sent" is surprisingly complex. 

Originally, Anonym encrypted messages *only* for the recipient. This meant that once you clicked "Send", your device encrypted the text into a lockbox that only the recipient's key could open. As soon as you refreshed the page or closed the tab, your own device "forgot" what was inside that lockbox, and because you didn't have the recipient's key, you couldn't read your own message history.

We have now introduced a "Self-Encrypted Sender Copy". This allows you to see your sent messages after a refresh, without compromising the strict security model.

## How encryption still works
When you send a message, your local device now performs **two** separate encryption operations before anything leaves your browser:

1.  **Copy A (For Recipient)**: Encrypted with the Recipient's Public Key.
2.  **Copy B (For You)**: Encrypted with **Your Own** Public Key.

These two encrypted "blobs" are bundled together and sent to the server. They are chemically different—looking at one tells you nothing about the other.

When you reload the page:
- The server sends you back the list of encrypted blobs.
- For messages *you received*, your device downloads Copy A and unlocks it.
- For messages *you sent*, your device downloads Copy B and unlocks it.

## What data the server cannot see
This change **does not** give the server any new access.

*   The server receives two opaque blocks of random-looking text instead of one.
*   The server **cannot decrypt** Copy A (it doesn't have the recipient's private key).
*   The server **cannot decrypt** Copy B (it doesn't have your private key).
*   The server **cannot verify** if Copy A and Copy B contain the same text (though your client ensures they do).

No plaintext, keys, or passwords are ever sent to the server.

## Why messages still auto-delete
This feature does not change the ephemeral nature of Anonym.

*   Both Copy A and Copy B are tagged with the same unchangeable expiration time (TTL).
*   When the time runs out (e.g., 24 hours), the server permanently deletes the **entire record**, destroying both copies simultaneously.
*   Once deleted from the server, no amount of key recovery can bring the message back, because the encrypted data itself is gone.

## Why messages cannot be deleted from recipient devices
Anonym is a decentralized-style system where devices act independently. 

Once a recipient downloads and decrypts Copy A, it exists in their device's temporary memory. Just as you cannot reach into someone's brain and make them forget a conversation, you cannot force a remote device to delete data it has already received. The expiration timer acts as a mutual agreement—both honest clients will delete the data when the timer expires—but it technically relies on the deletion of the central encrypted record to prevent future access.

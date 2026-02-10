import { useState, useEffect } from 'react';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useSessionExpiry(peerAddress) {
    const [expiryTimestamp, setExpiryTimestamp] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!peerAddress) {
            setLoading(false);
            return;
        }

        const storageKey = `session_expiry_${peerAddress}`;
        const storedExpiry = localStorage.getItem(storageKey);

        let expiryTime;

        if (storedExpiry && !isNaN(parseInt(storedExpiry, 10))) {
            expiryTime = parseInt(storedExpiry, 10);
        } else {
            // New session: Set expiration for 24h from now
            expiryTime = Date.now() + SESSION_DURATION_MS;
            localStorage.setItem(storageKey, expiryTime.toString());
        }

        setExpiryTimestamp(expiryTime);

        // Initial check
        const currentlyExpired = Date.now() >= expiryTime;
        setIsExpired(currentlyExpired);
        setLoading(false);

        // Periodic check to flip the boolean state
        if (!currentlyExpired) {
            const checkInterval = setInterval(() => {
                if (Date.now() >= expiryTime) {
                    setIsExpired(true);
                    clearInterval(checkInterval);
                }
            }, 1000);
            return () => clearInterval(checkInterval);
        }

    }, [peerAddress]);

    return { expiryTimestamp, isExpired, loading };
}


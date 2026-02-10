'use client';

import { useState, useEffect } from 'react';

// Format milliseconds into "17h 42m", "38m", "45s"
const formatTimeLeft = (ms) => {
    if (ms <= 0) return "0s";

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
};

export default function SessionExpiryBanner({ expiresAt, onExpire }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!expiresAt) return;

        const calculateTimeLeft = () => {
            const now = Date.now();
            const end = new Date(expiresAt).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft(0);
                if (onExpire) onExpire();
                return 0;
            }

            setTimeLeft(diff);
            return diff;
        };

        // Initial check
        const remaining = calculateTimeLeft();
        if (remaining <= 0) return;

        // Update every second
        const interval = setInterval(() => {
            const diff = calculateTimeLeft();
            if (diff <= 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    if (timeLeft === null) return null; // Hydration/loading state

    if (timeLeft <= 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '0.5rem',
                backgroundColor: 'rgba(50, 50, 50, 0.3)',
                color: '#aaa',
                fontSize: '0.8rem',
                borderBottom: '1px solid #333'
            }}>
                Session expired. Messages permanently destroyed.
            </div>
        );
    }

    return (
        <div style={{
            textAlign: 'center',
            padding: '0.4rem',
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            color: '#888',
            fontSize: '0.75rem',
            borderBottom: '1px solid #222',
            transition: 'color 0.3s'
        }}>
            Session expires in <span style={{ color: '#aaa', fontWeight: 500 }}>{formatTimeLeft(timeLeft)}</span>
        </div>
    );
}

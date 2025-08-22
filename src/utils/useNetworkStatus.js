import { useState, useEffect, useRef } from 'react';

const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [connectionType, setConnectionType] = useState('unknown');
    const [isChecking, setIsChecking] = useState(false);
    const checkTimeoutRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    const checkNetworkStatus = async () => {
        if (isChecking) return;

        setIsChecking(true);

        try {
            // Try multiple endpoints for better reliability
            const endpoints = [
                'https://www.google.com',
                'https://www.cloudflare.com',
                'https://www.apple.com'
            ];

            let connected = false;

            for (const endpoint of endpoints) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                    const response = await fetch(endpoint, {
                        method: 'HEAD',
                        mode: 'no-cors',
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);
                    connected = true;
                    break;
                } catch (error) {
                    continue;
                }
            }

            if (connected) {
                setIsConnected(true);
                setConnectionType('wifi');

                // Clear any pending retry
                if (retryTimeoutRef.current) {
                    clearTimeout(retryTimeoutRef.current);
                    retryTimeoutRef.current = null;
                }
            } else {
                throw new Error('No endpoints reachable');
            }
        } catch (error) {
            setIsConnected(false);
            setConnectionType('none');

            // Auto-retry after 30 seconds
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = setTimeout(() => {
                checkNetworkStatus();
            }, 30000);
        } finally {
            setIsChecking(false);
        }
    };

    const manualRetry = () => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        checkNetworkStatus();
    };

    useEffect(() => {
        checkNetworkStatus();

        // Check every 10 seconds
        const interval = setInterval(checkNetworkStatus, 10000);

        return () => {
            clearInterval(interval);
            if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        };
    }, []);

    return {
        isConnected,
        connectionType,
        isChecking,
        checkNetworkStatus: manualRetry,
    };
};

export default useNetworkStatus; 
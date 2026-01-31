import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION_DELAY } from '../worldConstants';

/**
 * Custom hook for world navigation with messages
 * Eliminates repeated pattern of setMessage + setTimeout + navigate
 */
export function useWorldNavigation() {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    /**
     * Navigate to a path with a message
     * @param {string} text - Message text to display
     * @param {string} path - Route path to navigate to
     * @param {string} color - Message background color
     * @param {number} delay - Delay before navigation (default: NAVIGATION_DELAY)
     */
    const navigateWithMessage = useCallback((text, path, color, delay = NAVIGATION_DELAY, state = null) => {
        setMessage({ text, color });
        setTimeout(() => navigate(path, { state }), delay);
    }, [navigate]);

    /**
     * Clear the current message
     */
    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    /**
     * Set a message without navigation
     * @param {string} text - Message text
     * @param {string} color - Message color
     */
    const showMessage = useCallback((text, color) => {
        setMessage({ text, color });
    }, []);

    return {
        message,
        navigateWithMessage,
        clearMessage,
        showMessage
    };
}

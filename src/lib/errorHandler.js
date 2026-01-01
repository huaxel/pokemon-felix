/**
 * Centralized error handling utility
 * Provides consistent error handling patterns across the application
 */

/**
 * Handle async errors with consistent logging and optional UI feedback
 * 
 * @param {Error} error - The error object
 * @param {string} context - Context description for logging
 * @param {Object} options - Configuration options
 * @param {Function} options.onError - Callback for error handling
 * @param {Function} options.revert - Function to revert state changes
 * @param {string} options.message - User-friendly error message
 * @param {boolean} options.showToast - Whether to show toast notification
 */
export function handleAsyncError(error, context, options = {}) {
    // Always log errors with context
    console.error(`[${context}]`, error);
    
    // Revert optimistic updates if provided
    if (options.revert) {
        options.revert();
    }
    
    // Execute custom error handler
    if (options.onError) {
        options.onError(error);
    }
    
    // Return user-friendly message for UI display
    return options.message || 'An error occurred. Please try again.';
}

/**
 * Wrapper for async functions with automatic error handling
 * 
 * @param {Function} fn - Async function to execute
 * @param {string} context - Context for error logging
 * @param {Object} options - Error handling options
 */
export async function withErrorHandling(fn, context, options = {}) {
    try {
        return await fn();
    } catch (error) {
        const message = handleAsyncError(error, context, options);
        if (options.throwError !== false) {
            throw error;
        }
        return { error: message };
    }
}

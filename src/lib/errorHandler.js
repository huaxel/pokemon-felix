/**
 * Standardizes error handling across async API and service calls.
 * 
 * @param {Error} error - The caught error
 * @param {string} context - The context or function name where it occurred
 * @param {Object} [options] - Optional extra metadata
 */
export function handleAsyncError(error, context, options = {}) {
  const message = options.message || error.message || 'Unknown error occurred';
  console.error(`[${context}] Error:`, message, error);
  
  // Potential extension point: report to an error tracking service like Sentry
}

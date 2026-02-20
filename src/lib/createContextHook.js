import { useContext } from 'react';

/**
 * Factory function to create context hooks with error checking
 * Eliminates DRY violation of repeated context hook patterns
 *
 * @param {React.Context} Context - The React context to wrap
 * @param {string} name - The name of the hook (for error messages)
 * @returns {Function} A hook that returns the context value
 */
export function createContextHook(Context, name) {
  return function useContextHook() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`${name} must be used within its Provider`);
    }
    return context;
  };
}

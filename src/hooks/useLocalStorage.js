import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * Eliminates duplication across useCare, useInventory, useQuests
 *
 * @param {string} key - localStorage key
 * @param {*} defaultValue - default value if nothing in localStorage
 * @returns {[*, function]} - [state, setState] tuple
 */
export function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

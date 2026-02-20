// Utility functions for managing favorites persistence
import { COLLECTION_STORAGE_KEY } from './constants';

const STORAGE_KEY = COLLECTION_STORAGE_KEY;

/**
 * Load favorites from localStorage
 */
export const loadFavorites = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
    return [];
  }
};

/**
 * Save favorites to localStorage
 */
export const saveFavorites = favorites => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

/**
 * Export favorites to a JSON file (downloads to user's computer)
 */
export const exportFavoritesToJson = favorites => {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    favorites: favorites,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `pokemon-favorites-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import favorites from a JSON file
 * Returns a promise that resolves with the imported favorites array
 */
export const importFavoritesFromJson = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = event => {
      const file = event.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);
          // Support both old format (just array) and new format (object with favorites)
          const favorites = Array.isArray(data) ? data : data.favorites;

          if (!Array.isArray(favorites)) {
            reject(new Error('Invalid favorites format'));
            return;
          }

          // Validate that all items are numbers (pokemon IDs)
          const validFavorites = favorites.filter(id => typeof id === 'number');
          resolve(validFavorites);
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };

    input.click();
  });
};

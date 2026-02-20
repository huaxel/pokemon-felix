import { COLLECTION_STORAGE_KEY } from '../constants';

const STORAGE_KEY = COLLECTION_STORAGE_KEY;

/**
 * collectionService
 * Handles persistence for the player's Pokemon collection.
 */

export async function getCollection() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching collection:', error);
    return [];
  }
}

export async function addToCollection(id) {
  try {
    const current = await getCollection();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Error adding to collection:', error);
  }
}

export async function removeFromCollection(id) {
  try {
    const current = await getCollection();
    const updated = current.filter(itemId => itemId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from collection:', error);
  }
}

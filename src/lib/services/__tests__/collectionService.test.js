import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCollection, addToCollection, removeFromCollection, setCollection } from '../collectionService';
import { COLLECTION_STORAGE_KEY } from '../../constants';

describe('collectionService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getCollection', () => {
    it('should return an empty array if nothing is in localStorage', async () => {
      const collection = await getCollection();
      expect(collection).toEqual([]);
    });

    it('should return the parsed collection from localStorage', async () => {
      const mockCollection = [1, 2, 3];
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(mockCollection));

      const collection = await getCollection();
      expect(collection).toEqual(mockCollection);
    });

    it('should return an empty array and log error if JSON is malformed', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, 'invalid-json');

      const collection = await getCollection();
      expect(collection).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('addToCollection', () => {
    it('should add a new ID to the collection', async () => {
      await addToCollection(1);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1]);
    });

    it('should not add duplicate IDs', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1]));
      await addToCollection(1);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1]);
    });

    it('should add to an existing collection', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1]));
      await addToCollection(2);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1, 2]);
    });
  });

  describe('removeFromCollection', () => {
    it('should remove an ID from the collection', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1, 2, 3]));
      await removeFromCollection(2);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1, 3]);
    });

    it('should do nothing if the ID is not in the collection', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1, 3]));
      await removeFromCollection(2);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1, 3]);
    });
  });

  describe('setCollection', () => {
    it('should overwrite the collection with new IDs', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1, 2]));
      const newCollection = [3, 4, 5];
      await setCollection(newCollection);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual(newCollection);
    });

    it('should set an empty collection', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1, 2]));
      await setCollection([]);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([]);
    });

    it('should remove duplicate IDs when setting the collection', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1, 2]));
      const newCollectionWithDuplicates = [1, 2, 2, 3, 1];
      await setCollection(newCollectionWithDuplicates);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1, 2, 3]);
    });

    it('should ignore non-number entries when setting the collection', async () => {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([1, 2]));
      const newCollectionWithNonNumbers = [1, '2', null, 3, {}, 4];
      await setCollection(newCollectionWithNonNumbers);
      const stored = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
      expect(stored).toEqual([1, 3, 4]);
    });
  });
});

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  getCollection,
  addToCollection,
  removeFromCollection,
} from '../lib/services/collectionService';

/**
 * Custom hook to manage Pokemon collection (owned Pokemon IDs)
 * @returns {Object} Owned IDs and toggle function
 */
export function useCollection() {
  const [ownedIds, setOwnedIds] = useState([]);

  // Optimization: use a ref to hold the latest state synchronously,
  // preventing race conditions with rapid toggles
  const ownedIdsRef = useRef(ownedIds);

  useEffect(() => {
    let ignore = false;
    const loadCollection = async () => {
      try {
        const ids = await getCollection();
        if (!ignore) {
          setOwnedIds(ids);
          ownedIdsRef.current = ids;
        }
      } catch (error) {
        console.error('Failed to load collection', error);
      }
    };
    loadCollection();
    return () => {
      ignore = true;
    };
  }, []);

  const toggleOwned = useCallback(
    async id => {
      const isOwned = ownedIdsRef.current.includes(id);

      // Update ref synchronously
      if (isOwned) {
        ownedIdsRef.current = ownedIdsRef.current.filter(pId => pId !== id);
      } else {
        ownedIdsRef.current = [...ownedIdsRef.current, id];
      }

      // Update React state
      setOwnedIds(ownedIdsRef.current);

      try {
        if (isOwned) {
          await removeFromCollection(id);
        } else {
          await addToCollection(id);
        }
      } catch (error) {
        console.error('Failed to update collection', error);
        // Revert on error
        if (isOwned) {
          ownedIdsRef.current = [...ownedIdsRef.current, id];
        } else {
          ownedIdsRef.current = ownedIdsRef.current.filter(pId => pId !== id);
        }
        setOwnedIds(ownedIdsRef.current);
      }
    },
    []
  );

  return useMemo(
    () => ({
      ownedIds,
      setOwnedIds,
      toggleOwned,
    }),
    [ownedIds, toggleOwned]
  );
}

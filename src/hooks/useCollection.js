import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCollection, addToCollection, removeFromCollection } from '../lib/services/collectionService';

/**
 * Custom hook to manage Pokemon collection (owned Pokemon IDs)
 * @returns {Object} Owned IDs and toggle function
 */
export function useCollection() {
    const [ownedIds, setOwnedIds] = useState([]);

    useEffect(() => {
        let ignore = false;
        const loadCollection = async () => {
            try {
                const ids = await getCollection();
                if (!ignore) {
                    setOwnedIds(ids);
                }
            } catch (error) {
                console.error('Failed to load collection', error);
            }
        };
        loadCollection();
        return () => { ignore = true; };
    }, []);

    const toggleOwned = useCallback(async (id) => {
        const isOwned = ownedIds.includes(id);
        setOwnedIds(prev => isOwned ? prev.filter(pId => pId !== id) : [...prev, id]);

        try {
            if (isOwned) {
                await removeFromCollection(id);
            } else {
                await addToCollection(id);
            }
        } catch (error) {
            console.error('Failed to update collection', error);
            // Revert on error
            setOwnedIds(prev => (isOwned ? [...prev, id] : prev.filter(pId => pId !== id)));
        }
    }, [ownedIds]);

    return useMemo(() => ({
        ownedIds,
        setOwnedIds,
        toggleOwned
    }), [ownedIds, toggleOwned]);
}

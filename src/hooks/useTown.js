import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pokemon_town_layout';

export function useTown() {
    const [townObjects, setTownObjects] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(townObjects));
    }, [townObjects]);

    const addObject = (type, x, y) => {
        const newObj = {
            id: Date.now(),
            type,
            x,
            y
        };
        setTownObjects(prev => [...prev, newObj]);
    };

    const removeObject = (id) => {
        setTownObjects(prev => prev.filter(obj => obj.id !== id));
    };

    const clearTown = () => {
        setTownObjects([]);
    };

    return {
        townObjects,
        addObject,
        removeObject,
        clearTown
    };
}

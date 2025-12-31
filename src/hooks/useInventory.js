import { useState, useEffect } from 'react';

/**
 * Hook to manage a simple inventory system
 */
export function useInventory() {
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('pokeInventory');
        return saved ? JSON.parse(saved) : {
            'pokeball': 5,
            'greatball': 0,
            'ultraball': 0,
            'masterball': 0,
            'rare-candy': 0,
            'mystery-box': 0
        };
    });

    useEffect(() => {
        localStorage.setItem('pokeInventory', JSON.stringify(inventory));
    }, [inventory]);

    const addItem = (itemId, amount = 1) => {
        setInventory(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + amount
        }));
    };

    const removeItem = (itemId, amount = 1) => {
        if ((inventory[itemId] || 0) >= amount) {
            setInventory(prev => ({
                ...prev,
                [itemId]: prev[itemId] - amount
            }));
            return true;
        }
        return false;
    };

    return {
        inventory,
        addItem,
        removeItem
    };
}

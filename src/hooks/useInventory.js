import { useState, useEffect } from 'react';
import * as inventoryService from '../lib/services/inventoryService';

/**
 * Hook to manage a simple inventory system
 */
export function useInventory() {
    const [inventory, setInventory] = useState(null);

    useEffect(() => {
        let mounted = true;
        inventoryService.getInventory().then(data => {
            if (mounted) setInventory(data);
        });
        return () => { mounted = false };
    }, []);

    useEffect(() => {
        if (inventory !== null) {
            inventoryService.saveInventory(inventory);
        }
    }, [inventory]);

    const addItem = (itemId, amount = 1) => {
        setInventory(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + amount }));
    };

    const removeItem = (itemId, amount = 1) => {
        if (!inventory) return false;
        if ((inventory[itemId] || 0) >= amount) {
            setInventory(prev => ({ ...prev, [itemId]: prev[itemId] - amount }));
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

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import * as inventoryService from '../lib/services/inventoryService';

/**
 * Hook to manage a simple inventory system
 */
export function useInventory() {
    const [inventory, setInventory] = useLocalStorage('pokemon_inventory', null);

    // Initialize from service on mount
    useEffect(() => {
        if (inventory === null) {
            inventoryService.getInventory().then(data => {
                setInventory(data);
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync to service when inventory changes
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

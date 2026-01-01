import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../lib/constants';

export function useCoins(initialAmount = 500) {
    const [coins, setCoins] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.COINS);
        return saved ? parseInt(saved, 10) : initialAmount;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
    }, [coins]);

    const addCoins = (amount) => {
        setCoins(prev => prev + amount);
    };

    const removeCoins = (amount) => {
        if (coins >= amount) {
            setCoins(prev => prev - amount);
            return true;
        }
        return false;
    };

    const spendCoins = (amount) => {
        if (coins >= amount) {
            setCoins(prev => prev - amount);
            return true;
        }
        return false;
    };

    return {
        coins,
        addCoins,
        removeCoins,
        spendCoins
    };
}

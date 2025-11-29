import { useState, useEffect } from 'react';

export function useCoins(initialAmount = 500) {
    const [coins, setCoins] = useState(() => {
        const saved = localStorage.getItem('pokeCoins');
        return saved ? parseInt(saved, 10) : initialAmount;
    });

    useEffect(() => {
        localStorage.setItem('pokeCoins', coins.toString());
    }, [coins]);

    const addCoins = (amount) => {
        setCoins(prev => prev + amount);
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
        spendCoins
    };
}

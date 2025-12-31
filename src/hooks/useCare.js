import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pokemon_care_stats';

export function useCare(ownedIds) {
    const [careStats, setCareStats] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(careStats));
    }, [careStats]);

    // Initialize stats for new pokemon
    useEffect(() => {
        const newStats = { ...careStats };
        let changed = false;

        ownedIds.forEach(id => {
            if (!newStats[id]) {
                newStats[id] = {
                    hp: 100,
                    hunger: 0, // 0 is full, 100 is starving (using 0-100 logic)
                    happiness: 70
                };
                changed = true;
            }
        });

        if (changed) {
            setCareStats(newStats);
        }
    }, [ownedIds]);

    const healPokemon = (id) => {
        setCareStats(prev => ({
            ...prev,
            [id]: { ...prev[id], hp: 100 }
        }));
    };

    const healAll = () => {
        const allHealed = { ...careStats };
        Object.keys(allHealed).forEach(id => {
            allHealed[id] = { ...allHealed[id], hp: 100 };
        });
        setCareStats(allHealed);
    };

    const feedPokemon = (id) => {
        setCareStats(prev => {
            const current = prev[id] || { hp: 100, hunger: 0, happiness: 70 };
            return {
                ...prev,
                [id]: { 
                    ...current, 
                    hunger: Math.max(0, current.hunger - 30),
                    happiness: Math.min(100, current.happiness + 10)
                }
            };
        });
    };

    return {
        careStats,
        healPokemon,
        healAll,
        feedPokemon
    };
}

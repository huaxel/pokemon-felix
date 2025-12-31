import { useState, useEffect } from 'react';
import { CARE_STORAGE_KEY } from '../lib/constants';

export function useCare(ownedIds) {
    const [careStats, setCareStats] = useState(() => {
        const stored = localStorage.getItem(CARE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    });

    useEffect(() => {
        localStorage.setItem(CARE_STORAGE_KEY, JSON.stringify(careStats));
    }, [careStats]);

    // Initialize stats for new pokemon and cleanup removed ones
    useEffect(() => {
        setCareStats(prev => {
            const newStats = { ...prev };
            let changed = false;

            // Add defaults for any owned ids missing
            ownedIds.forEach(id => {
                if (!newStats[id]) {
                    newStats[id] = {
                        hp: 100,
                        hunger: 0,
                        happiness: 70,
                        fatigue: 0
                    };
                    changed = true;
                }
            });

            // Remove stats for IDs that are no longer owned
            Object.keys(newStats).forEach(key => {
                const numeric = parseInt(key, 10);
                if (!ownedIds.includes(numeric)) {
                    delete newStats[key];
                    changed = true;
                }
            });

            return changed ? newStats : prev;
        });
    }, [ownedIds]);

    const healPokemon = (id) => {
        setCareStats(prev => ({
            ...prev,
            [id]: { ...prev[id], hp: 100, fatigue: 0 }
        }));
    };

    const healAll = () => {
        setCareStats(prev => {
            const allHealed = { ...prev };
            Object.keys(allHealed).forEach(id => {
                allHealed[id] = { ...allHealed[id], hp: 100, fatigue: 0 };
            });
            return allHealed;
        });
    };

    const feedPokemon = (id) => {
        setCareStats(prev => {
            const current = prev[id] || { hp: 100, hunger: 0, happiness: 70, fatigue: 0 };
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

    const addFatigue = (id, amount) => {
        setCareStats(prev => {
            const current = prev[id] || { hp: 100, hunger: 0, happiness: 70, fatigue: 0 };
            return {
                ...prev,
                [id]: { ...current, fatigue: Math.min(100, (current.fatigue || 0) + amount) }
            };
        });
    };

    return {
        careStats,
        healPokemon,
        healAll,
        feedPokemon,
        addFatigue
    };
}

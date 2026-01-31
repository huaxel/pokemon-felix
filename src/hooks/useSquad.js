import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, BATTLE_CONFIG } from '../lib/constants';

export function useSquad(initialSquad = []) {
    const [squadIds, setSquadIds] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SQUAD);
        return saved ? JSON.parse(saved) : initialSquad;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SQUAD, JSON.stringify(squadIds));
    }, [squadIds]);

    const addToSquad = useCallback((pokemonId) => {
        let success = false;
        setSquadIds(prev => {
            if (prev.length < BATTLE_CONFIG.MAX_SQUAD_SIZE && !prev.includes(pokemonId)) {
                success = true;
                return [...prev, pokemonId];
            }
            return prev;
        });
        return success;
    }, []);

    const removeFromSquad = useCallback((pokemonId) => {
        setSquadIds(prev => prev.filter(id => id !== pokemonId));
    }, []);

    const isInSquad = useCallback((pokemonId) => {
        return squadIds.includes(pokemonId);
    }, [squadIds]);

    return useMemo(() => ({
        squadIds,
        addToSquad,
        removeFromSquad,
        isInSquad,
        isSquadFull: squadIds.length >= BATTLE_CONFIG.MAX_SQUAD_SIZE
    }), [squadIds, addToSquad, removeFromSquad, isInSquad]);
}

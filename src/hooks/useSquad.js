import { useState, useEffect } from 'react';
import { STORAGE_KEYS, BATTLE_CONFIG } from '../lib/constants';

export function useSquad(initialSquad = []) {
    const [squadIds, setSquadIds] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SQUAD);
        return saved ? JSON.parse(saved) : initialSquad;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SQUAD, JSON.stringify(squadIds));
    }, [squadIds]);

    const addToSquad = (pokemonId) => {
        if (squadIds.length < BATTLE_CONFIG.MAX_SQUAD_SIZE && !squadIds.includes(pokemonId)) {
            setSquadIds(prev => [...prev, pokemonId]);
            return true;
        }
        return false;
    };

    const removeFromSquad = (pokemonId) => {
        setSquadIds(prev => prev.filter(id => id !== pokemonId));
    };

    const isInSquad = (pokemonId) => {
        return squadIds.includes(pokemonId);
    };

    return {
        squadIds,
        addToSquad,
        removeFromSquad,
        isInSquad,
        isSquadFull: squadIds.length >= BATTLE_CONFIG.MAX_SQUAD_SIZE
    };
}

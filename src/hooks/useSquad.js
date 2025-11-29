import { useState, useEffect } from 'react';

export function useSquad(initialSquad = []) {
    const [squadIds, setSquadIds] = useState(() => {
        const saved = localStorage.getItem('pokeSquad');
        return saved ? JSON.parse(saved) : initialSquad;
    });

    useEffect(() => {
        localStorage.setItem('pokeSquad', JSON.stringify(squadIds));
    }, [squadIds]);

    const addToSquad = (pokemonId) => {
        if (squadIds.length < 4 && !squadIds.includes(pokemonId)) {
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
        isSquadFull: squadIds.length >= 4
    };
}

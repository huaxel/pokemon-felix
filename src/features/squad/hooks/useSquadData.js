import { useState, useEffect } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../../lib/api';

/**
 * Hook to manage squad and bench data fetching
 */
export function useSquadData() {
    const { ownedIds, squadIds } = usePokemonContext();
    const [benchPokemon, setBenchPokemon] = useState([]);
    const [squadPokemon, setSquadPokemon] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine which IDs we need to fetch
                // Minimization: We could use useQueries here if we wanted granular caching,
                // but Promise.all is fine for now as we transition.
                // Ideally this would be replaced by usePokemonQueries hooks too.
                const promises = ownedIds.map(id => getPokemonDetails(id));
                const results = await Promise.all(promises);
                
                const squad = results.filter(p => squadIds.includes(p.id));
                const bench = results.filter(p => !squadIds.includes(p.id));
                
                setSquadPokemon(squad);
                setBenchPokemon(bench);
            } catch (error) {
                console.error("Failed to load squad data", error);
            } finally {
                setLoading(false);
            }
        };

        if (ownedIds.length > 0) {
            fetchData();
        } else {
            setSquadPokemon([]);
            setBenchPokemon([]);
            setLoading(false);
        }
    }, [ownedIds, squadIds]);

    return {
        squadPokemon,
        benchPokemon,
        loading
    };
}

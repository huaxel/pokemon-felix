import { useState, useEffect } from 'react';
import { getPokemonList } from '../lib/api';

/**
 * Custom hook to manage Pokemon data fetching and pagination
 * @returns {Object} Pokemon data, loading state, and load function
 */
export function usePokemonData() {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadPokemon = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const currentOffset = offset;
            const newPokemon = await getPokemonList(20, currentOffset);
            setPokemonList(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newPokemon.filter(p => !existingIds.has(p.id));
                return [...prev, ...uniqueNew];
            });
            setOffset(currentOffset + 20);
        } catch (error) {
            console.error("Failed to load pokemon", error);
        } finally {
            setLoading(false);
        }
    };

    // Load initial Pokemon on mount
    useEffect(() => {
        loadPokemon();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array - run only once on mount

    return {
        pokemonList,
        loading,
        loadPokemon
    };
}

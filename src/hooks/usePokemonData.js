import { useState, useEffect, useRef } from 'react';
import { getPokemonList } from '../lib/api';

/**
 * Custom hook to manage Pokemon data fetching and pagination
 * @returns {Object} Pokemon data, loading state, and load function
 */
export function usePokemonData() {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(false);
    const offsetRef = useRef(0);

    const loadPokemon = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const newPokemon = await getPokemonList(20, offsetRef.current);
            setPokemonList(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newPokemon.filter(p => !existingIds.has(p.id));
                return [...prev, ...uniqueNew];
            });
            offsetRef.current += 20;
        } catch (error) {
            console.error("Failed to load pokemon", error);
        } finally {
            setLoading(false);
        }
    };

    // Load initial Pokemon on mount
    useEffect(() => {
        loadPokemon();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        pokemonList,
        loading,
        loadPokemon
    };
}

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { getAllPokemonNames, getPokemonDetails } from '../lib/api';

/**
 * Custom hook to manage Pokemon search functionality with Fuse.js
 * @returns {Object} Search state, results, and search function
 */
export function usePokemonSearch() {
    const [allPokemonNames, setAllPokemonNames] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize Fuse for fuzzy searching
    const fuse = useMemo(() => {
        return new Fuse(allPokemonNames, {
            includeScore: true,
            threshold: 0.3
        });
    }, [allPokemonNames]);

    // Load all Pokemon names on mount
    useEffect(() => {
        let ignore = false;
        const loadNames = async () => {
            try {
                const names = await getAllPokemonNames();
                if (!ignore) {
                    setAllPokemonNames(names);
                }
            } catch (error) {
                console.error("Failed to load names", error);
            }
        };
        loadNames();
        return () => { ignore = true; };
    }, []);

    const handleSearch = async (query) => {
        setSearchTerm(query);

        if (!query) {
            setSearchResults(null);
            return;
        }

        setLoading(true);
        try {
            let searchName = query.toLowerCase();

            // Use fuzzy search if exact match not found
            if (!allPokemonNames.includes(searchName)) {
                const results = fuse.search(searchName);
                if (results.length > 0) {
                    searchName = results[0].item;
                }
            }

            const details = await getPokemonDetails(searchName);
            setSearchResults([details]);
        } catch (error) {
            console.error("Failed to search", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults(null);
        setSearchTerm('');
    };

    return {
        allPokemonNames,
        searchResults,
        searchTerm,
        loading,
        handleSearch,
        clearSearch
    };
}

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { getAllPokemonNames, getPokemonDetails } from '../lib/api';

/**
 * Custom hook to manage Pokemon search functionality with Fuse.js
 * @param {string[]} [providedNames] - Optional list of names to skip self-fetching
 * @returns {Object} Search state, results, and search function
 */
export function usePokemonSearch(providedNames) {
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Fuse for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(allPokemonNames, {
      includeScore: true,
      threshold: 0.3,
    });
  }, [allPokemonNames]);

  // Load calls
  useEffect(() => {
    if (providedNames && providedNames.length > 0) {
      setAllPokemonNames(providedNames);
    } else {
      // Only fetch if not provided
      let ignore = false;
      const loadNames = async () => {
        try {
          const names = await getAllPokemonNames();
          if (!ignore) {
            setAllPokemonNames(names);
          }
        } catch (error) {
          console.error('Failed to load names', error);
        }
      };
      // Ideally we check if providedNames is null/undefined before fetching
      // but this is a backward compatible fallback
      if (!providedNames) {
        loadNames();
      }
      return () => {
        ignore = true;
      };
    }
  }, [providedNames]);

  const handleSearch = async query => {
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
      console.error('Failed to search', error);
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
    clearSearch,
  };
}

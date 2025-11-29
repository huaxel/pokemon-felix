import React, { createContext, useContext } from 'react';
import { usePokemonData } from '../hooks/usePokemonData';
import { useCollection } from '../hooks/useCollection';
import { usePokemonSearch } from '../hooks/usePokemonSearch';

const PokemonContext = createContext(null);

/**
 * Provider component that wraps the app and provides Pokemon data
 */
export function PokemonProvider({ children }) {
    const pokemonData = usePokemonData();
    const collection = useCollection();
    const search = usePokemonSearch();

    const value = {
        // Pokemon data
        pokemonList: pokemonData.pokemonList,
        loading: pokemonData.loading || search.loading,
        loadPokemon: pokemonData.loadPokemon,

        // Collection
        ownedIds: collection.ownedIds,
        toggleOwned: collection.toggleOwned,

        // Search
        allPokemonNames: search.allPokemonNames,
        searchResults: search.searchResults,
        searchTerm: search.searchTerm,
        handleSearch: search.handleSearch,
        clearSearch: search.clearSearch
    };

    return (
        <PokemonContext.Provider value={value}>
            {children}
        </PokemonContext.Provider>
    );
}

/**
 * Hook to access Pokemon context
 * @throws {Error} If used outside PokemonProvider
 */
export function usePokemonContext() {
    const context = useContext(PokemonContext);

    if (!context) {
        throw new Error('usePokemonContext must be used within PokemonProvider');
    }

    return context;
}

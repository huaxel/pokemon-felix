import { useContext } from 'react';
import { PokemonContext } from '../contexts/PokemonContext';

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

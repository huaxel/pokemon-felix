import { createContextHook } from '../lib/createContextHook';
import { PokemonContext } from '../contexts/PokemonContext';

/**
 * Hook to access Pokemon context
 * @throws {Error} If used outside PokemonProvider
 */
export const usePokemonContext = createContextHook(PokemonContext, 'usePokemonContext');

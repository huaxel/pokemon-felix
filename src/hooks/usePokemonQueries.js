import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { getPokemonList, getAllPokemonNames } from '../lib/api';

/**
 * Hook to fetch paginated Pokemon list
 */
export function usePokemonListQuery(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['pokemonList', limit],
    queryFn: ({ pageParam = 0 }) => getPokemonList(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // If last page is empty, no more pages
      if (!lastPage || lastPage.length < limit) return undefined;
      // Next offset is current length
      return allPages.length * limit;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60, // 1 hour (Pokemon data changes rarely)
  });
}

/**
 * Hook to fetch all Pokemon names for search (heavy, so cache aggressively)
 */
export function useAllPokemonNamesQuery() {
  return useQuery({
    queryKey: ['allPokemonNames'],
    queryFn: getAllPokemonNames,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
}

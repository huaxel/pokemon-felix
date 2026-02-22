import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { PokemonProvider } from '../PokemonProvider';
import { useEconomy, useData, useDomainCollection } from '../DomainContexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonListQuery: () => ({
    data: { pages: [[{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]] },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
  }),
  useAllPokemonNamesQuery: () => ({
    data: ['bulbasaur', 'ivysaur'],
    isLoading: false,
  }),
}));

vi.mock('../../hooks/usePokemonSearch', () => ({
  usePokemonSearch: () => ({
    searchResults: [],
    searchTerm: '',
    handleSearch: vi.fn(),
    clearSearch: vi.fn(),
    loading: false,
  }),
}));

vi.mock('../../lib/services/collectionService', () => ({
  getCollection: vi.fn(async () => []),
  addToCollection: vi.fn(async () => ({})),
  removeFromCollection: vi.fn(async () => ({})),
}));

vi.mock('../../hooks/useQuests', () => ({
  useQuests: () => ({
    quests: [],
    updateQuestProgress: vi.fn(),
    completeQuest: vi.fn(),
  }),
}));

vi.mock('../../hooks/useDailyRewards', () => ({
  useDailyRewards: () => ({
    canClaim: false,
    claimReward: vi.fn(),
  }),
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const TestConsumer = () => {
  const { coins, addCoins } = useEconomy();
  const { pokemonList } = useData();
  const { ownedIds, toggleOwned } = useDomainCollection();

  return (
    <React.Fragment>
      <div>
        <div data-testid="coins">{coins}</div>
        <div data-testid="pokemon-list-length">{pokemonList?.length}</div>
        <button onClick={() => addCoins(100)}>Add Coins</button>
        <div data-testid="owned-count">{ownedIds?.length || 0}</div>
        <button onClick={() => toggleOwned(1)}>Toggle Owned 1</button>
      </div>
    </React.Fragment>
  );
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function PokemonProviderWrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <PokemonProvider>{children}</PokemonProvider>
      </QueryClientProvider>
    );
  }
  return PokemonProviderWrapper;
};

describe('PokemonProvider Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('provides initial values correctly', () => {
    const Wrapper = createWrapper();
    render(<TestConsumer />, { wrapper: Wrapper });

    const coinsValue = Number(screen.getByTestId('coins').textContent);
    expect(Number.isNaN(coinsValue)).toBe(false);
    expect(screen.getByTestId('pokemon-list-length').textContent).toBe('1');
  });

  it('updates economy state when addCoins is called', async () => {
    const Wrapper = createWrapper();
    render(<TestConsumer />, { wrapper: Wrapper });

    const initialCoins = Number(screen.getByTestId('coins').textContent);
    fireEvent.click(screen.getByText('Add Coins'));
    await waitFor(() => {
      const updatedCoins = Number(screen.getByTestId('coins').textContent);
      expect(updatedCoins).toBe(initialCoins + 100);
    });
  });

  it('updates collection state when toggleOwned is called', async () => {
    const Wrapper = createWrapper();
    render(<TestConsumer />, { wrapper: Wrapper });

    expect(screen.getByTestId('owned-count').textContent).toBe('0');

    fireEvent.click(screen.getByText('Toggle Owned 1'));
    await waitFor(() => {
      expect(screen.getByTestId('owned-count').textContent).toBe('1');
    });
  });
});

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokedexPage } from '../PokedexPage';
import { useData, useDomainCollection } from '../../../contexts/DomainContexts';

// Mock contexts
vi.mock('../../../contexts/DomainContexts', () => ({
  useData: vi.fn(),
  useDomainCollection: vi.fn()
}));

// Mock API
vi.mock('../../../lib/api', () => ({
  getPokemonDetails: vi.fn()
}));

// Mock SearchBar
vi.mock('../../../components/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar" />
}));

// Mock PokemonModal
vi.mock('../../../components/PokemonModal', () => ({
  PokemonModal: () => <div data-testid="pokemon-modal" />
}));

// Mock PokemonCard with render tracking
vi.mock('../../../components/PokemonCard', async () => {
  const React = await import('react');
  const InnerCard = (props) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pokemon-card-render'));
    }
    return (
      <div
        data-testid="pokemon-card"
        onClick={() => props.onClick(props.pokemon)}
      />
    );
  };
  return {
    PokemonCard: React.memo(InnerCard)
  };
});

describe('PokedexPage', () => {
  const mockPokemonList = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `pokemon-${i + 1}`,
    sprites: { front_default: 'url' },
    types: [{ type: { name: 'normal' } }],
    speciesData: { names: [] }
  }));

  let renderCount = 0;
  const countHandler = () => { renderCount++; };

  beforeEach(() => {
    vi.clearAllMocks();
    renderCount = 0;
    window.addEventListener('pokemon-card-render', countHandler);

    useData.mockReturnValue({
      pokemonList: mockPokemonList,
      loading: false,
      loadPokemon: vi.fn(),
      allPokemonNames: [],
      searchResults: null,
      handleSearch: vi.fn(),
      clearSearch: vi.fn()
    });

    useDomainCollection.mockReturnValue({
      ownedIds: [1, 2],
      toggleOwned: vi.fn()
    });
  });

  afterEach(() => {
    window.removeEventListener('pokemon-card-render', countHandler);
  });

  it('does not re-render PokemonCards when opening details modal', async () => {
    render(<PokedexPage />);

    // Initial render
    expect(renderCount).toBe(10);
    renderCount = 0;

    // Click a card
    const cards = screen.getAllByTestId('pokemon-card');
    fireEvent.click(cards[0]);

    // Expect no re-renders of the list
    expect(renderCount).toBe(0);
  });
});

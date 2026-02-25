import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { useData, useDomainCollection } from '../../contexts/DomainContexts';
import { getPokemonDetails } from '../../lib/api';
import { SearchBar } from '../../components/SearchBar';
import { PokemonCard } from '../../components/PokemonCard';
const PokemonModal = lazy(() =>
  import('../../components/PokemonModal').then(mod => ({ default: mod.PokemonModal }))
);
import { grassTile } from '../world/worldAssets';
import './PokedexPage.css';

export function PokedexPage() {
  const {
    pokemonList,
    loading,
    loadPokemon,
    allPokemonNames,
    searchResults,
    handleSearch,
    clearSearch,
  } = useData();
  const { ownedIds, toggleOwned } = useDomainCollection();

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Optimization: Memoize ownedIds into a Set for O(1) lookup
  const ownedIdsSet = useMemo(() => new Set(ownedIds), [ownedIds]);

  // Optimization: Memoize handleCardClick to prevent re-renders of all cards
  const handleCardClick = useCallback(async pokemon => {
    if (pokemon.speciesData) {
      setSelectedPokemon(pokemon);
    } else {
      try {
        const fullDetails = await getPokemonDetails(pokemon.name);
        setSelectedPokemon(fullDetails);
      } catch (error) {
        console.error('Failed to load details', error);
      }
    }
  }, []);

  const displayList = searchResults && searchResults.length > 0 ? searchResults : pokemonList;

  return (
    <div
      className="pokedex-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <SearchBar allPokemon={allPokemonNames} onSearch={handleSearch} />

      {searchResults && (
        <div className="search-status" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button className="clear-search btn-kenney warning" onClick={clearSearch}>
            ZOEKOPDRACHT WISSEN
          </button>
        </div>
      )}

      <div
        className="pokemon-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
          padding: '1rem',
        }}
      >
        {displayList.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            index={index}
            pokemon={pokemon}
            isOwned={ownedIdsSet.has(pokemon.id)}
            onToggleOwned={toggleOwned}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {!searchResults && (
        <div className="load-more-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button className="btn-kenney primary" onClick={loadPokemon} disabled={loading}>
            {loading ? 'Laden...' : 'Meer Pokémon laden'}
          </button>
        </div>
      )}

      {selectedPokemon && (
        <Suspense fallback={null}>
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
            isOwned={ownedIdsSet.has(selectedPokemon.id)}
            onToggleOwned={toggleOwned}
          />
        </Suspense>
      )}
    </div>
  );
}

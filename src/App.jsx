import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { usePokemonContext } from './contexts/PokemonContext';
import { getPokemonDetails, addToCollection, removeFromCollection } from './lib/api';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { Navbar } from './components/Navbar';
import { PokemonCard } from './components/PokemonCard';
import { SearchBar } from './components/SearchBar';
import { PokemonModal } from './components/PokemonModal';
import { CollectionPage } from './components/CollectionPage';
import { BattlePage } from './components/BattlePage';
import { TournamentLayout } from './features/tournament/TournamentLayout';
import { GachaPage } from './features/gacha/GachaPage';
import { StarterPage } from './features/onboarding/StarterPage';
import { SquadPage } from './features/squad/SquadPage';
import './App.css';

function App() {
  const {
    pokemonList,
    loading,
    loadPokemon,
    ownedIds,
    setOwnedIds,
    toggleOwned,
    allPokemonNames,
    searchResults,
    handleSearch,
    clearSearch
  } = usePokemonContext();

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to starter selection if no pokemon owned
  useEffect(() => {
    if (!loading && ownedIds.length === 0 && location.pathname !== '/starter') {
      navigate('/starter');
    }
  }, [loading, ownedIds, location, navigate]);

  const handleExportFavorites = () => {
    exportFavoritesToJson(ownedIds);
  };

  const handleImportFavorites = async () => {
    try {
      const imported = await importFavoritesFromJson();
      // Sync imported favorites with DB
      // First, clear existing collection
      for (const id of ownedIds) {
        await removeFromCollection(id);
      }
      // Then add all imported ones
      for (const id of imported) {
        await addToCollection(id);
      }
      setOwnedIds(imported);
    } catch (error) {
      console.error('Failed to import favorites:', error);
      alert('Error al importar favoritos: ' + error.message);
    }
  };

  const handleCardClick = async (pokemon) => {
    if (pokemon.speciesData) {
      setSelectedPokemon(pokemon);
    } else {
      try {
        const fullDetails = await getPokemonDetails(pokemon.name);
        setSelectedPokemon(fullDetails);
      } catch (error) {
        console.error("Failed to load details", error);
      }
    }
  };

  const displayList = (searchResults && searchResults.length > 0) ? searchResults : pokemonList;

  return (
    <div className="app-container">
      <Navbar
        onExport={handleExportFavorites}
        onImport={handleImportFavorites}
      />
      <Routes>
        <Route path="/" element={
          <>
            <SearchBar allPokemon={allPokemonNames} onSearch={handleSearch} />

            {searchResults && (
              <div className="search-status">
                <button className="clear-search" onClick={clearSearch}>
                  REINICIAR BÚSQUEDA
                </button>
              </div>
            )}

            <div className="pokemon-grid">
              {displayList.map((pokemon, index) => (
                <PokemonCard
                  key={pokemon.id}
                  index={index}
                  pokemon={pokemon}
                  isOwned={ownedIds.includes(pokemon.id)}
                  onToggleOwned={toggleOwned}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {!searchResults && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={loadPokemon} disabled={loading}>
                  {loading ? 'Cargando...' : 'Cargar Más Pokémon'}
                </button>
              </div>
            )}
          </>
        } />
        <Route path="/collection" element={
          <CollectionPage
            ownedIds={ownedIds}
            onToggleOwned={toggleOwned}
          />
        } />
        <Route path="/battle" element={
          <BattlePage allPokemon={pokemonList} onLoadMore={loadPokemon} />
        } />
        <Route path="/starter" element={<StarterPage />} />
        <Route path="/tournament" element={
          <TournamentLayout allPokemon={pokemonList} />
        } />
        <Route path="/gacha" element={<GachaPage />} />
        <Route path="/squad" element={<SquadPage />} />
      </Routes>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isOwned={ownedIds.includes(selectedPokemon.id)}
          onToggleOwned={toggleOwned}
        />
      )}
    </div>
  );
}

export default App;

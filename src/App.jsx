import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { usePokemonContext } from './contexts/PokemonContext';
import { getPokemonDetails, addToCollection, removeFromCollection } from './lib/api';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { Navbar } from './components/Navbar';
import { Navbar } from './components/Navbar';
import { PokemonModal } from './components/PokemonModal';
import { CollectionPage } from './components/CollectionPage';
import { BattlePage } from './components/BattlePage';
import { TournamentLayout } from './features/tournament/TournamentLayout';
import { GachaPage } from './features/gacha/GachaPage';
import { StarterPage } from './features/onboarding/StarterPage';
import { SquadPage } from './features/squad/SquadPage';
import { PokedexPage } from './features/pokedex/PokedexPage';
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

  return (
    <div className="app-container">
      <Navbar
        onExport={handleExportFavorites}
        onImport={handleImportFavorites}
      />
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/pokedex" element={<PokedexPage />} />
        <Route path="/collection" element={
          <CollectionPage
            ownedIds={ownedIds}
            onToggleOwned={toggleOwned}
          />
        } />
        <Route path="/battle" element={
          <BattlePage allPokemon={pokemonList} onLoadMore={loadPokemon} />
        } />
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

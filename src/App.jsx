import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePokemonContext } from './contexts/PokemonContext';
import { addToCollection, removeFromCollection } from './lib/api';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { Navbar } from './components/Navbar';

import { PokemonModal } from './components/PokemonModal';
import { CollectionPage } from './components/CollectionPage';
import { BattlePage } from './components/BattlePage';
import { TournamentLayout } from './features/tournament/TournamentLayout';
import { GachaPage } from './features/gacha/GachaPage';
import { StarterPage } from './features/onboarding/StarterPage';
import { SquadPage } from './features/squad/SquadPage';
import { PokedexPage } from './features/pokedex/PokedexPage';
import { WorldPage } from './features/world/WorldPage';
import { CarePage } from './features/care/CarePage';
import { BattleSelectionPage } from './features/battle/BattleSelectionPage';
import { SingleBattlePage } from './features/battle/SingleBattlePage';
import './App.css';

function App() {
  const {
    pokemonList,
    loadPokemon,
    ownedIds,
    setOwnedIds,
    toggleOwned,
  } = usePokemonContext();

  const [selectedPokemon, setSelectedPokemon] = useState(null);

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
        <Route path="/battle-modes" element={<BattleSelectionPage />} />
        <Route path="/single-battle" element={<SingleBattlePage allPokemon={pokemonList} />} />
        <Route path="/tournament" element={<TournamentLayout allPokemon={pokemonList} />} />
        <Route path="/gacha" element={<GachaPage />} />
        <Route path="/squad" element={<SquadPage />} />
        <Route path="/adventure" element={<WorldPage />} />
        <Route path="/care" element={<CarePage />} />
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

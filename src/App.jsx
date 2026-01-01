import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePokemonContext } from './hooks/usePokemonContext';
import { addToCollection, removeFromCollection } from './lib/api';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { Navbar } from './components/Navbar';
import { GameConsole } from './components/GameConsole';

const PokemonModal = lazy(() => import('./components/PokemonModal').then(mod => ({ default: mod.PokemonModal })));
import { CollectionPage } from './components/CollectionPage';
import { BattlePage } from './components/BattlePage';
import { TournamentLayout } from './features/tournament/TournamentLayout';
import { GachaPage } from './features/gacha/GachaPage';
import { StarterPage } from './features/onboarding/StarterPage';
import { SquadPage } from './features/squad/SquadPage';
import { PokedexPage } from './features/pokedex/PokedexPage';
import { WorldPage } from './features/world/WorldPage';
import { MarketPage } from './features/world/MarketPage';
import { EvolutionPage } from './features/world/EvolutionPage';
import { GymPage } from './features/world/GymPage';
import { BagPage } from './features/world/BagPage';
import { CarePage } from './features/care/CarePage';
import { SchoolPage } from './features/world/SchoolPage';
import { WardrobePage } from './features/world/WardrobePage';
import { BankPage } from './features/world/BankPage';
import { PotionLabPage } from './features/world/PotionLabPage';
import { FountainPage } from './features/world/FountainPage';
import { PalacePage } from './features/world/PalacePage';
import { EvolutionHallPage } from './features/world/EvolutionHallPage';
import { MountainPage } from './features/world/MountainPage';
import { SecretCavePage } from './features/world/SecretCavePage';
import { WaterRoutePage } from './features/world/WaterRoutePage';
import { PorygonLabPage } from './features/porygon/PorygonLabPage';
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
    isConsoleOpen,
    toggleConsole
  } = usePokemonContext();

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Keyboard shortcut for Python Terminal (Ctrl+`)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleConsole();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleConsole]);

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
        <Route path="/market" element={<MarketPage />} />
        <Route path="/evolution" element={<EvolutionPage />} />
        <Route path="/gym" element={<GymPage />} />
        <Route path="/bag" element={<BagPage />} />
        <Route path="/care" element={<CarePage />} />
        <Route path="/school" element={<SchoolPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/bank" element={<BankPage />} />
        <Route path="/potion-lab" element={<PotionLabPage />} />
        <Route path="/fountain" element={<FountainPage />} />
        <Route path="/palace" element={<PalacePage />} />
        <Route path="/evolution-hall" element={<EvolutionHallPage />} />
        <Route path="/mountain" element={<MountainPage />} />
        <Route path="/secret-cave" element={<SecretCavePage />} />
        <Route path="/water-route" element={<WaterRoutePage />} />
        <Route path="/porygon-lab" element={<PorygonLabPage />} />
      </Routes>

      {selectedPokemon && (
        <Suspense fallback={null}>
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
            isOwned={ownedIds.includes(selectedPokemon.id)}
            onToggleOwned={toggleOwned}
          />
        </Suspense>
      )}

      {isConsoleOpen && (
        <GameConsole onClose={() => toggleConsole(false)} />
      )}
    </div>
  );
}

export default App;

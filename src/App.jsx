import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData, useDomainCollection, useUI } from './contexts/DomainContexts';
import { addToCollection, removeFromCollection } from './lib/services/collectionService';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { Navbar } from './components/Navbar';
import { GameConsole } from './components/GameConsole';
import { ToastContainer } from './components/ToastContainer';
import { AppRoutes } from './AppRoutes';

import './App.css';

function App() {
  const { pokemonList, loadPokemon } = useData();
  const { ownedIds, setOwnedIds, toggleOwned } = useDomainCollection();
  const { isConsoleOpen, toggleConsole } = useUI();

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Routes that should NOT scroll (Game Mode - Fixed Viewport)
  const GAME_ROUTES = [
    '/adventure',
    '/battle',
    '/single-battle',
    '/desert',
    '/cave-dungeon',
    '/secret-cave',
    '/water-route',
    '/porygon-lab',
  ];

  // Keyboard shortcut for Python Terminal (Ctrl+`)
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleConsole();
      }
    };

    // Prevent default touch behavior to stop scrolling/rubber-banding
    const preventDefaultTouch = e => {
      // Allow touch on specific scrollable elements if marked with data-scrollable
      if (e.target.closest('[data-scrollable="true"]')) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchmove', preventDefaultTouch);
    };
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
      // Fallback for top-level error
      console.error('Error al importar favoritos: ' + error.message);
    }
  };

  return (
    <div className="app-container">
      <Navbar onExport={handleExportFavorites} onImport={handleImportFavorites} />

      <AppRoutes
        ownedIds={ownedIds}
        toggleOwned={toggleOwned}
        pokemonList={pokemonList}
        loadPokemon={loadPokemon}
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />

      {isConsoleOpen && <GameConsole onClose={() => toggleConsole(false)} />}
      <ToastContainer />
    </div>
  );
}

export default App;

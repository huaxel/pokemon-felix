import { useState, useEffect } from 'react';
import { usePokemonContext } from './hooks/usePokemonContext';
import { addToCollection, removeFromCollection } from './lib/api';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { Navbar } from './components/Navbar';
import { GameConsole } from './components/GameConsole';
import { ToastContainer } from './components/ToastContainer';
import { AppRoutes } from './AppRoutes';

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
      // Fallback for top-level error
      console.error('Error al importar favoritos: ' + error.message);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onExport={handleExportFavorites}
        onImport={handleImportFavorites}
      />

      <AppRoutes
        ownedIds={ownedIds}
        toggleOwned={toggleOwned}
        pokemonList={pokemonList}
        loadPokemon={loadPokemon}
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />

      {isConsoleOpen && (
        <GameConsole onClose={() => toggleConsole(false)} />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;

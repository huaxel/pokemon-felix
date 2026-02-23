import { useState, useEffect } from 'react';
import { useData, useDomainCollection, useUI } from './contexts/DomainContexts';
import { setCollection } from './lib/services/collectionService';
import { exportFavoritesToJson, importFavoritesFromJson } from './lib/favorites';
import { useServices } from './modules/services';
import { errorMessage } from './modules/observability';
import { Navbar } from './components/Navbar';
import { GameConsole } from './components/GameConsole';
import { ToastContainer } from './components/ToastContainer';
import { AppRoutes } from './AppRoutes';

import './App.css';

function App() {
  const { pokemonList, loadPokemon } = useData();
  const { ownedIds, setOwnedIds, toggleOwned } = useDomainCollection();
  const { isConsoleOpen, toggleConsole, showError } = useUI();
  const { logger } = useServices();

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Keyboard shortcut for Python Terminal (Ctrl+`)
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleConsole();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleConsole]);

  const handleExportFavorites = () => {
    exportFavoritesToJson(ownedIds);
  };

  const handleImportFavorites = async () => {
    try {
      const imported = await importFavoritesFromJson();
      const uniqueImported = Array.from(new Set(imported));
      await setCollection(uniqueImported);
      setOwnedIds(uniqueImported);
    } catch (error) {
      logger.error('Failed to import favorites', error);
      showError(`Failed to import favorites: ${errorMessage(error)}`);
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

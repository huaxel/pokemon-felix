import { useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import Fuse from 'fuse.js'
import { getPokemonList, getAllPokemonNames, getPokemonDetails } from './lib/api'
import { PokemonCard } from './components/PokemonCard'
import { SearchBar } from './components/SearchBar'
import { PokemonModal } from './components/PokemonModal'
import { Navbar } from './components/Navbar'
import { CollectionPage } from './components/CollectionPage'
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [ownedIds, setOwnedIds] = useState(() => {
    const saved = localStorage.getItem('felix-pokemon-collection');
    return saved ? JSON.parse(saved) : [];
  });
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Initialize Fuse for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(allPokemonNames, {
      includeScore: true,
      threshold: 0.3 // 0.0 is exact match, 1.0 is match anything
    });
  }, [allPokemonNames]);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      if (ignore) return;
      await loadPokemon();
      await loadAllNames();
    };
    init();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('felix-pokemon-collection', JSON.stringify(ownedIds));
  }, [ownedIds]);

  const loadAllNames = async () => {
    try {
      const names = await getAllPokemonNames();
      setAllPokemonNames(names);
    } catch (error) {
      console.error("Failed to load all pokemon names", error);
    }
  };

  const loadPokemon = async () => {
    if (loading) return; // Prevent concurrent loads
    setLoading(true);
    try {
      const newPokemon = await getPokemonList(20, offset);
      setPokemonList(prev => {
        // Deduplicate just in case
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = newPokemon.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
      setOffset(prev => prev + 20);
    } catch (error) {
      console.error("Failed to load pokemon", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    try {
      // Fuzzy search logic
      let searchName = query.toLowerCase();

      // If not an exact match in our list, try fuzzy search
      if (!allPokemonNames.includes(searchName)) {
        const results = fuse.search(searchName);
        if (results.length > 0) {
          searchName = results[0].item;
          console.log(`Fuzzy match: ${query} -> ${searchName}`);
        }
      }

      const details = await getPokemonDetails(searchName);
      setSearchResults([details]);
    } catch (error) {
      console.error("Failed to search pokemon", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOwned = (id) => {
    setOwnedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCardClick = async (pokemon) => {
    // If we already have species data (from search), use it
    if (pokemon.speciesData) {
      setSelectedPokemon(pokemon);
    } else {
      // Otherwise fetch full details including species data
      setLoading(true);
      try {
        const fullDetails = await getPokemonDetails(pokemon.name);
        setSelectedPokemon(fullDetails);
      } catch (error) {
        console.error("Failed to load pokemon details", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const displayList = (searchResults && searchResults.length > 0) ? searchResults : pokemonList;

  return (
    <div className="app-container">
      <Navbar collectionCount={ownedIds.length} />

      <Routes>
        <Route path="/" element={
          <>
            <div className="header-stats">
              <h1>Pokémon Félix</h1>
            </div>

            <SearchBar allPokemon={allPokemonNames} onSearch={handleSearch} />

            {searchResults && (
              <div className="search-status">
                <button className="clear-search" onClick={() => setSearchResults(null)}>
                  REINICIAR BÚSQUEDA
                </button>
              </div>
            )}

            <div className="pokemon-grid">
              {displayList.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isOwned={ownedIds.includes(pokemon.id)}
                  onToggleOwned={toggleOwned}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {!searchResults && (
              <div className="load-more-container">
                <button
                  className="load-more-btn"
                  onClick={loadPokemon}
                  disabled={loading}
                >
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
  )
}

export default App

import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import Fuse from 'fuse.js'
import { getPokemonList, getAllPokemonNames, getPokemonDetails, getCollection, addToCollection, removeFromCollection } from './lib/api'
import { Navbar } from './components/Navbar'
import { PokemonCard } from './components/PokemonCard'
import { SearchBar } from './components/SearchBar'
import { PokemonModal } from './components/PokemonModal'
import { CollectionPage } from './components/CollectionPage'
import { BattlePage } from './components/BattlePage'
import './App.css'

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [ownedIds, setOwnedIds] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize Fuse
  const fuse = useMemo(() => {
    return new Fuse(allPokemonNames, {
      includeScore: true,
      threshold: 0.3
    });
  }, [allPokemonNames]);

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      if (ignore) return;
      await loadPokemon();
      await loadAllNames();
      await loadCollection();
    };
    init();
    return () => { ignore = true; };
  }, []);

  const loadAllNames = async () => {
    try {
      const names = await getAllPokemonNames();
      setAllPokemonNames(names);
    } catch (error) {
      console.error("Failed to load names", error);
    }
  };

  const loadCollection = async () => {
    try {
      const ids = await getCollection();
      setOwnedIds(ids);
    } catch (error) {
      console.error("Failed to load collection", error);
    }
  };

  const loadPokemon = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newPokemon = await getPokemonList(20, offset);
      setPokemonList(prev => {
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
      let searchName = query.toLowerCase();
      if (!allPokemonNames.includes(searchName)) {
        const results = fuse.search(searchName);
        if (results.length > 0) {
          searchName = results[0].item;
        }
      }
      const details = await getPokemonDetails(searchName);
      setSearchResults([details]);
    } catch (error) {
      console.error("Failed to search", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOwned = async (id) => {
    const isOwned = ownedIds.includes(id);
    setOwnedIds(prev => isOwned ? prev.filter(pId => pId !== id) : [...prev, id]);
    if (isOwned) await removeFromCollection(id);
    else await addToCollection(id);
  };

  const handleCardClick = async (pokemon) => {
    if (pokemon.speciesData) {
      setSelectedPokemon(pokemon);
    } else {
      setLoading(true);
      try {
        const fullDetails = await getPokemonDetails(pokemon.name);
        setSelectedPokemon(fullDetails);
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const displayList = (searchResults && searchResults.length > 0) ? searchResults : pokemonList;

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <SearchBar allPokemon={allPokemonNames} onSearch={handleSearch} />

            {searchResults && (
              <div className="search-status">
                <button className="clear-search" onClick={() => setSearchResults(null)}>
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

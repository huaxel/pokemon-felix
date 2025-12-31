import { useState, lazy, Suspense } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { SearchBar } from '../../components/SearchBar';
import { PokemonCard } from '../../components/PokemonCard';
const PokemonModal = lazy(() => import('../../components/PokemonModal').then(mod => ({ default: mod.PokemonModal })));
import './PokedexPage.css';

export function PokedexPage() {
    const {
        pokemonList,
        loading,
        loadPokemon,
        ownedIds,
        toggleOwned,
        allPokemonNames,
        searchResults,
        handleSearch,
        clearSearch
    } = usePokemonContext();

    const [selectedPokemon, setSelectedPokemon] = useState(null);

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
        <div className="pokedex-page">
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
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonDetails } from '../lib/api';
import { PokemonCard } from './PokemonCard';
import { PokemonModal } from './PokemonModal';
import './CollectionPage.css';

export function CollectionPage({ ownedIds, onToggleOwned }) {
    const [collectedPokemon, setCollectedPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        const fetchCollection = async () => {
            setLoading(true);
            try {
                // We only have IDs, so we need to fetch details for each
                // In a real app with a backend, we'd have an endpoint for this
                // For now, we'll fetch them individually (parallelized)
                // Optimization: We could cache these or store minimal data in localStorage
                const promises = ownedIds.map(id => getPokemonDetails(id));
                const results = await Promise.all(promises);
                setCollectedPokemon(results);
            } catch (error) {
                console.error("Failed to load collection", error);
            } finally {
                setLoading(false);
            }
        };

        if (ownedIds.length > 0) {
            fetchCollection();
        } else {
            setCollectedPokemon([]);
            setLoading(false);
        }
    }, [ownedIds]);

    const handleCardClick = async (pokemon) => {
        // If we already have species data (from fetch), use it
        if (pokemon.speciesData) {
            setSelectedPokemon(pokemon);
        } else {
            // Otherwise fetch full details
            try {
                const fullDetails = await getPokemonDetails(pokemon.name);
                setSelectedPokemon(fullDetails);
            } catch (error) {
                console.error("Failed to load pokemon details", error);
            }
        }
    };

    if (loading) {
        return <div className="collection-loading">Loading your collection...</div>;
    }

    if (ownedIds.length === 0) {
        return (
            <div className="empty-collection">
                <h2>Your collection is empty!</h2>
                <p>Go back to the home page to catch some Pokemon.</p>
                <Link to="/" className="go-home-btn">Find Pokemon</Link>
            </div>
        );
    }

    return (
        <div className="collection-page">
            <div className="collection-header">
                <h2>My Collection</h2>
                <div className="collection-stats">
                    <span>Total: {collectedPokemon.length}</span>
                </div>
            </div>

            <div className="pokemon-grid">
                {collectedPokemon.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        isOwned={true}
                        onToggleOwned={onToggleOwned}
                        onClick={handleCardClick}
                    />
                ))}
            </div>

            {selectedPokemon && (
                <PokemonModal
                    pokemon={selectedPokemon}
                    onClose={() => setSelectedPokemon(null)}
                    isOwned={ownedIds.includes(selectedPokemon.id)}
                    onToggleOwned={onToggleOwned}
                />
            )}
        </div>
    );
}

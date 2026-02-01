import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonDetails } from '../../lib/api';
import { PokemonCard } from '../../components/PokemonCard';
import { grassTile } from '../world/worldAssets';
const PokemonModal = lazy(() => import('../../components/PokemonModal').then(mod => ({ default: mod.PokemonModal })));
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
        return <div className="collection-loading">Je collectie laden...</div>;
    }

    if (ownedIds.length === 0) {
        return (
            <div className="collection-page" style={{ 
                backgroundColor: '#2d1810',
                backgroundImage: `url(${grassTile})`,
                backgroundSize: '64px',
                backgroundRepeat: 'repeat',
                imageRendering: 'pixelated'
            }}>
                <div className="empty-collection game-panel-dark">
                    <h2 style={{ fontFamily: '"Press Start 2P", cursive' }}>Je collectie is leeg!</h2>
                    <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', lineHeight: '1.5' }}>Ga terug naar het begin om Pokémon te vangen.</p>
                    <Link to="/" className="btn-kenney primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>Pokémon zoeken</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="collection-page" style={{ 
            backgroundColor: '#2d1810',
            backgroundImage: `url(${grassTile})`,
            backgroundSize: '64px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated'
        }}>
            <div className="collection-header game-panel-dark" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: '"Press Start 2P", cursive', margin: 0, fontSize: '1.5rem', textShadow: '2px 2px 0 #000' }}>Mijn Collectie</h2>
                <div className="collection-stats" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fbbf24' }}>
                    <span>Totaal: {collectedPokemon.length}</span>
                </div>
            </div>

            <div className="pokemon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
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
                <Suspense fallback={null}>
                    <PokemonModal
                        pokemon={selectedPokemon}
                        onClose={() => setSelectedPokemon(null)}
                        isOwned={ownedIds.includes(selectedPokemon.id)}
                        onToggleOwned={onToggleOwned}
                    />
                </Suspense>
            )}
        </div>
    );
}

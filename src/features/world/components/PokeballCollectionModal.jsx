import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useCareContext } from '../../../hooks/useCareContext';
import { PokemonCard } from '../../../components/PokemonCard';
import { X } from 'lucide-react';
import './PokeballCollectionModal.css';

export function PokeballCollectionModal({ isOpen, onClose }) {
    const { pokemonList, ownedIds } = usePokemonContext();
    const { careStats } = useCareContext();

    if (!isOpen) return null;

    const capturedPokemon = pokemonList.filter(p => ownedIds.includes(p.id));

    return (
        <div className="pokeball-modal-overlay">
            <div className="pokeball-modal-content">
                <div className="pokeball-modal-header">
                    <h2><span className="pokeball-icon">🔘</span> Je Pokémon Collectie</h2>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="pokeball-collection-grid">
                    {capturedPokemon.length === 0 ? (
                        <div className="empty-collection">
                            <p>Je hebt nog geen Pokémon gevangen!</p>
                        </div>
                    ) : (
                        capturedPokemon.map(pokemon => {
                            const stats = careStats[pokemon.id] || { hp: 100 };
                            const hpColor = stats.hp > 50 ? '#22c55e' : stats.hp > 20 ? '#eab308' : '#ef4444';

                            return (
                                <div key={pokemon.id} className="captured-pokemon-card">
                                    <div className="pokemon-card-wrapper">
                                        <PokemonCard pokemon={pokemon} isOwned={true} hideStats />
                                    </div>
                                    <div className="pokemon-energy-section">
                                        <div className="energy-label">
                                            <span>Energie</span>
                                            <span>{Math.round(stats.hp)}%</span>
                                        </div>
                                        <div className="energy-bar-bg">
                                            <div
                                                className="energy-bar-fill"
                                                style={{
                                                    width: `${stats.hp}%`,
                                                    backgroundColor: hpColor
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <div className="pokeball-modal-footer">
                    <button className="footer-close-btn" onClick={onClose}>Sluiten</button>
                </div>
            </div>
        </div>
    );
}

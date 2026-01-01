import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Sparkles, Zap, Download, Upload } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import './EvolutionHallPage.css';

// Evolution chains (simplified)
const EVOLUTION_CHAINS = [
    { id: 1, name: 'Bulbasaur', evo: 'Ivysaur', level: 16, type: 'Grass' },
    { id: 4, name: 'Charmander', evo: 'Charmeleon', level: 16, type: 'Fire' },
    { id: 7, name: 'Squirtle', evo: 'Wartortle', level: 16, type: 'Water' },
    { id: 25, name: 'Pikachu', evo: 'Raichu', level: 'Thunder Stone', type: 'Electric' },
    { id: 39, name: 'Jigglypuff', evo: 'Wigglytuff', level: 'Moon Stone', type: 'Normal' },
];

export function EvolutionHallPage() {
    const { pokemonList, ownedIds, addCoins, addItem } = usePokemonContext();
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [message, setMessage] = useState(null);
    const [evolving, setEvolving] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const showMessage = (text, type = 'info', duration = 3000) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), duration);
    };

    const getEvolutionInfo = (pokemonId) => {
        const evolution = EVOLUTION_CHAINS.find(e => e.id === pokemonId);
        return evolution;
    };

    const handleEvolve = async (pokemon) => {
        const evoInfo = getEvolutionInfo(pokemon.id);
        
        if (!evoInfo) {
            showMessage('Este Pokémon no puede evolucionar...', 'error');
            return;
        }

        setEvolving(true);
        
        // Simulate evolution animation
        await new Promise(r => setTimeout(r, 2000));

        // Give rewards
        addCoins(100);
        addItem('rare_candy');

        showMessage(`¡${pokemon.name} evolucionó a ${evoInfo.evo}! 🎉`, 'success', 4000);
        setEvolving(false);
        setSelectedPokemon(null);
    };

    const ownedPokemonWithEvolutions = pokemonList.filter(p => 
        ownedIds.includes(p.id) && getEvolutionInfo(p.id)
    );

    return (
        <div className="evolution-hall-page">
            <header className="evolution-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Back" />
                </Link>
                <h1>
                    <Sparkles size={32} />
                    Salón de Evolución
                </h1>
            </header>

            {message && (
                <div className={`evolution-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Evolution Chamber Visual */}
            <div className="evolution-chamber">
                <div className="chamber-glow"></div>
                <div className="chamber-text">⚡ Cámara de Energía Evolutiva ⚡</div>
            </div>

            {!selectedPokemon ? (
                <>
                    <div className="evolution-intro">
                        <h2>Bienvenido al Salón de Evolución</h2>
                        <p>Aquí tus Pokémon pueden alcanzar su verdadera potencia</p>
                    </div>

                    <button 
                        className="guide-btn"
                        onClick={() => setShowGuide(!showGuide)}
                    >
                        {showGuide ? '📖 Ocultar Guía' : '📖 Ver Guía'}
                    </button>

                    {showGuide && (
                        <div className="evolution-guide">
                            <h3>¿Cómo funciona la Evolución?</h3>
                            <ul>
                                <li>🎯 Cada Pokémon puede evolucionar a un nivel específico o con un ítem</li>
                                <li>💪 Los Pokémon evolucionados son más fuertes en batalla</li>
                                <li>📈 Ganarás Caramelos Raros y monedas cuando evolucionan</li>
                                <li>🔄 Algunos Pokémon necesitan objetos especiales (Piedras, etc.)</li>
                                <li>⚡ Las evoluciones desbloquean nuevos movimientos y habilidades</li>
                            </ul>
                        </div>
                    )}

                    <div className="pokemon-grid">
                        {ownedPokemonWithEvolutions.length === 0 ? (
                            <div className="no-pokemon">
                                <p>No tienes Pokémon listos para evolucionar aún.</p>
                                <p>Captura más Pokémon para desbloquear evoluciones!</p>
                            </div>
                        ) : (
                            ownedPokemonWithEvolutions.map(pokemon => {
                                const evoInfo = getEvolutionInfo(pokemon.id);
                                return (
                                    <div 
                                        key={pokemon.id}
                                        className="evo-pokemon-card"
                                        onClick={() => setSelectedPokemon(pokemon)}
                                    >
                                        <img 
                                            src={pokemon.sprites?.front_default} 
                                            alt={pokemon.name}
                                            className="pokemon-sprite"
                                        />
                                        <h3>{pokemon.name}</h3>
                                        <div className="evo-arrow">⬇️</div>
                                        <div className="evo-result">{evoInfo.evo}</div>
                                        <div className="evo-requirement">
                                            {isNaN(evoInfo.level) ? (
                                                <>🔹 {evoInfo.level}</>
                                            ) : (
                                                <>Nivel {evoInfo.level}</>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            ) : (
                <div className="evolution-detail">
                    <button 
                        className="back-detail-btn"
                        onClick={() => setSelectedPokemon(null)}
                    >
                        ← Atrás
                    </button>

                    <div className="evo-display">
                        <div className="pokemon-before">
                            <img 
                                src={selectedPokemon.sprites?.front_default}
                                alt={selectedPokemon.name}
                            />
                            <h2>{selectedPokemon.name}</h2>
                            <div className="stats">
                                {selectedPokemon.stats?.slice(0, 3).map((s, idx) => (
                                    <div key={idx} className="stat">
                                        <span>{s.stat.name}</span>
                                        <span className="stat-value">{s.base_stat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="evolution-arrow-big">
                            <Zap size={48} />
                        </div>

                        {getEvolutionInfo(selectedPokemon.id) && (
                            <div className="pokemon-after">
                                <h2>{getEvolutionInfo(selectedPokemon.id).evo}</h2>
                                <p className="evo-bonus">
                                    ⬆️ +15% a todas las estadísticas
                                </p>
                                <div className="rewards">
                                    <span className="reward-item">
                                        💰 100 monedas
                                    </span>
                                    <span className="reward-item">
                                        🍬 Caramelo Raro
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        className="evolve-btn"
                        onClick={() => handleEvolve(selectedPokemon)}
                        disabled={evolving}
                    >
                        {evolving ? (
                            <>
                                <Sparkles size={24} className="spinning" />
                                ¡Evolucionando!
                            </>
                        ) : (
                            <>
                                <Zap size={24} />
                                ¡Evolucionar Ahora!
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="hall-stats">
                <div className="stat-box">
                    <Upload size={24} />
                    <span className="stat-value">{ownedPokemonWithEvolutions.length}</span>
                    <span className="stat-label">Listos para Evolucionar</span>
                </div>
                <div className="stat-box">
                    <Download size={24} />
                    <span className="stat-value">{ownedIds.length}</span>
                    <span className="stat-label">Pokémon Capturados</span>
                </div>
            </div>
        </div>
    );
}

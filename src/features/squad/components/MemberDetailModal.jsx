import { useState } from 'react';
import { Heart, Utensils, X } from 'lucide-react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import './MemberDetailModal.css';

export function MemberDetailModal({ pokemon, onClose }) {
    const { careStats, feedPokemon, healPokemon, coins, spendCoins, xpStats, inventory, removeItem } = usePokemonContext();
    const stats = careStats ? (careStats[pokemon.id] || { hp: 100, hunger: 0, happiness: 70 }) : { hp: 100, hunger: 0, happiness: 70 };
    const xp = xpStats ? (xpStats[pokemon.id] || { level: 5, xp: 0, toNextLevel: 500 }) : { level: 5, xp: 0, toNextLevel: 500 };

    const [message, setMessage] = useState('');

    const handleFeed = () => {
        if (coins >= 20) {
            if (spendCoins(20)) {
                feedPokemon(pokemon.id);
                setMessage('¡Ñam! ¡Qué rico!');
                setTimeout(() => setMessage(''), 2000);
            }
        } else {
            setMessage('¡No tienes suficientes monedas!');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleHeal = () => {
        if (stats.hp >= 100) {
            setMessage('¡Ya está completamente sano!');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        if (coins >= 50) {
            if (spendCoins(50)) {
                healPokemon(pokemon.id);
                setMessage('¡Salud restaurada!');
                setTimeout(() => setMessage(''), 2000);
            }
        } else {
            setMessage('¡No tienes suficientes monedas!');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleUseBerry = (type) => {
        const count = inventory[type] || 0;
        if (count > 0 && removeItem(type, 1)) {
            if (type === 'berry') {
                healPokemon(pokemon.id); // Simple heal for now, ideally partial
                setMessage('¡Baya Oran! +30 HP (Full)');
            } else if (type === 'sitrus-berry') {
                healPokemon(pokemon.id);
                setMessage('¡Baya Zidra! +60 HP (Full)');
            } else if (type === 'razz-berry') {
                feedPokemon(pokemon.id); // Reusing feed logic which does hunger/happiness
                setMessage('¡Baya Frambu! ¡Qué rica!');
            }
            setTimeout(() => setMessage(''), 2000);
        }
    };

    return (
        <div className="member-modal-overlay">
            <div className="member-modal-content">
                <button className="close-btn" onClick={onClose}><X /></button>

                <div className="member-header">
                    <h2>{pokemon.name} <span style={{ fontSize: '1rem', color: '#fbbf24' }}>Lvl. {xp.level}</span></h2>
                    <span className="id-badge">#{String(pokemon.id).padStart(3, '0')}</span>
                </div>

                <div className="member-body">
                    <div className="member-image">
                        <img
                            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="bounce-in"
                        />
                    </div>

                    <div className="member-stats-panel">
                        {message && <div className="action-feedback">{message}</div>}

                        <div className="stat-row">
                            <label>Experiencia</label>
                            <div className="stat-bar-container">
                                <div
                                    className="stat-bar-fill xp"
                                    style={{ width: `${(xp.xp / xp.toNextLevel) * 100}%`, background: '#8b5cf6' }}
                                ></div>
                                <span className="stat-value">{xp.xp} / {xp.toNextLevel} XP</span>
                            </div>
                        </div>

                        <div className="stat-row">
                            <label>Salud</label>
                            <div className="stat-bar-container">
                                <div
                                    className="stat-bar-fill hp"
                                    style={{ width: `${stats.hp}%`, backgroundColor: stats.hp > 50 ? '#22c55e' : '#ef4444' }}
                                ></div>
                                <span className="stat-value">{Math.round(stats.hp)}%</span>
                            </div>
                        </div>

                        <div className="stat-row">
                            <label>Hambre</label>
                            <div className="stat-bar-container">
                                <div
                                    className="stat-bar-fill hunger"
                                    style={{ width: `${stats.hunger}%` }}
                                ></div>
                                <span className="stat-value">{Math.round(stats.hunger)}%</span>
                            </div>
                        </div>

                        <div className="stat-row">
                            <label>Felicidad</label>
                            <div className="stat-bar-container">
                                <div
                                    className="stat-bar-fill happiness"
                                    style={{ width: `${stats.happiness}%` }}
                                ></div>
                                <span className="stat-value">{Math.round(stats.happiness)}%</span>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="action-btn heal" onClick={handleHeal}>
                                <Heart size={20} />
                                <div>
                                    <span>Curar</span>
                                    <span className="cost">50 💰</span>
                                </div>
                            </button>
                            <button className="action-btn feed" onClick={handleFeed}>
                                <Utensils size={20} />
                                <div>
                                    <span>Alimentar</span>
                                    <span className="cost">20 💰</span>
                                </div>
                            </button>
                        </div>

                        <div className="berry-section" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Bayas</h4>
                            <div className="action-buttons" style={{ marginTop: '0.5rem' }}>
                                {(inventory?.berry || 0) > 0 && (
                                    <button className="action-btn berry-btn oran" onClick={() => handleUseBerry('berry')}>
                                        <span style={{ fontSize: '1.2rem' }}>🫐</span>
                                        <div><span>Oran</span><span className="cost">x{inventory.berry}</span></div>
                                    </button>
                                )}
                                {(inventory?.['sitrus-berry'] || 0) > 0 && (
                                    <button className="action-btn berry-btn sitrus" onClick={() => handleUseBerry('sitrus-berry')}>
                                        <span style={{ fontSize: '1.2rem' }}>🍋</span>
                                        <div><span>Zidra</span><span className="cost">x{inventory['sitrus-berry']}</span></div>
                                    </button>
                                )}
                                {(inventory?.['razz-berry'] || 0) > 0 && (
                                    <button className="action-btn berry-btn razz" onClick={() => handleUseBerry('razz-berry')}>
                                        <span style={{ fontSize: '1.2rem' }}>🍓</span>
                                        <div><span>Frambu</span><span className="cost">x{inventory['razz-berry']}</span></div>
                                    </button>
                                )}
                                {(!inventory?.berry && !inventory?.['sitrus-berry'] && !inventory?.['razz-berry']) && (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>No tienes bayas</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

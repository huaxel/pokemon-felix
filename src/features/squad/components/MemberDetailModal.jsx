import { useState } from 'react';
import { Heart, Utensils, X } from 'lucide-react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import './MemberDetailModal.css';

const DEFAULT_CARE_STATS = { hp: 100, hunger: 0, happiness: 70 };
const DEFAULT_XP_STATS = { level: 5, xp: 0, toNextLevel: 500 };
const BERRY_TYPES = [
    { key: 'berry', label: 'Oran', icon: '🫐', className: 'oran' },
    { key: 'sitrus-berry', label: 'Zidra', icon: '🍋', className: 'sitrus' },
    { key: 'razz-berry', label: 'Frambu', icon: '🍓', className: 'razz' }
];

function MemberHeader({ pokemon, level }) {
    return (
        <div className="member-header">
            <h2>
                {pokemon.name}{' '}
                <span style={{ fontSize: '1rem', color: '#fbbf24' }}>Lvl. {level}</span>
            </h2>
            <span className="id-badge">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>
    );
}

function MemberImage({ pokemon }) {
    return (
        <div className="member-image">
            <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="bounce-in"
            />
        </div>
    );
}

function StatRow({ label, width, valueText, barClass, barStyle }) {
    return (
        <div className="stat-row">
            <label>{label}</label>
            <div className="stat-bar-container">
                <div className={`stat-bar-fill ${barClass}`} style={{ width: `${width}%`, ...barStyle }}></div>
                <span className="stat-value">{valueText}</span>
            </div>
        </div>
    );
}

function ActionButtons({ onHeal, onFeed }) {
    return (
        <div className="action-buttons">
            <button className="action-btn heal" onClick={onHeal}>
                <Heart size={20} />
                <div>
                    <span>Curar</span>
                    <span className="cost">50 💰</span>
                </div>
            </button>
            <button className="action-btn feed" onClick={onFeed}>
                <Utensils size={20} />
                <div>
                    <span>Alimentar</span>
                    <span className="cost">20 💰</span>
                </div>
            </button>
        </div>
    );
}

function BerrySection({ inventory, onUseBerry }) {
    const hasAny = BERRY_TYPES.some(type => (inventory?.[type.key] || 0) > 0);

    return (
        <div className="berry-section" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Bayas</h4>
            <div className="action-buttons" style={{ marginTop: '0.5rem' }}>
                {BERRY_TYPES.map(type => {
                    const count = inventory?.[type.key] || 0;
                    if (count === 0) return null;
                    return (
                        <button key={type.key} className={`action-btn berry-btn ${type.className}`} onClick={() => onUseBerry(type.key)}>
                            <span style={{ fontSize: '1.2rem' }}>{type.icon}</span>
                            <div><span>{type.label}</span><span className="cost">x{count}</span></div>
                        </button>
                    );
                })}
                {!hasAny && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                        No tienes bayas
                    </div>
                )}
            </div>
        </div>
    );
}

export function MemberDetailModal({ pokemon, onClose }) {
    const { careStats, feedPokemon, healPokemon, coins, spendCoins, xpStats, inventory, removeItem } = usePokemonContext();
    const stats = careStats ? (careStats[pokemon.id] || DEFAULT_CARE_STATS) : DEFAULT_CARE_STATS;
    const xp = xpStats ? (xpStats[pokemon.id] || DEFAULT_XP_STATS) : DEFAULT_XP_STATS;
    const [message, setMessage] = useState('');

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 2000);
    };

    const handleFeed = () => {
        if (coins < 20) {
            showMessage('¡No tienes suficientes monedas!');
            return;
        }
        if (spendCoins(20)) {
            feedPokemon(pokemon.id);
            showMessage('¡Ñam! ¡Qué rico!');
        }
    };

    const handleHeal = () => {
        if (stats.hp >= 100) {
            showMessage('¡Ya está completamente sano!');
            return;
        }
        if (coins < 50) {
            showMessage('¡No tienes suficientes monedas!');
            return;
        }
        if (spendCoins(50)) {
            healPokemon(pokemon.id);
            showMessage('¡Salud restaurada!');
        }
    };

    const handleUseBerry = (type) => {
        const count = inventory[type] || 0;
        if (count === 0) return;
        if (!removeItem(type, 1)) return;
        if (type === 'berry') {
            healPokemon(pokemon.id);
            showMessage('¡Baya Oran! +30 HP (Full)');
            return;
        }
        if (type === 'sitrus-berry') {
            healPokemon(pokemon.id);
            showMessage('¡Baya Zidra! +60 HP (Full)');
            return;
        }
        if (type === 'razz-berry') {
            feedPokemon(pokemon.id);
            showMessage('¡Baya Frambu! ¡Qué rica!');
        }
    };

    return (
        <div className="member-modal-overlay">
            <div className="member-modal-content">
                <button className="close-btn" onClick={onClose}><X /></button>
                <MemberHeader pokemon={pokemon} level={xp.level} />
                <div className="member-body">
                    <MemberImage pokemon={pokemon} />
                    <div className="member-stats-panel">
                        {message && <div className="action-feedback">{message}</div>}
                        <StatRow
                            label="Experiencia"
                            width={(xp.xp / xp.toNextLevel) * 100}
                            valueText={`${xp.xp} / ${xp.toNextLevel} XP`}
                            barClass="xp"
                            barStyle={{ background: '#8b5cf6' }}
                        />
                        <StatRow
                            label="Salud"
                            width={stats.hp}
                            valueText={`${Math.round(stats.hp)}%`}
                            barClass="hp"
                            barStyle={{ backgroundColor: stats.hp > 50 ? '#22c55e' : '#ef4444' }}
                        />
                        <StatRow
                            label="Hambre"
                            width={stats.hunger}
                            valueText={`${Math.round(stats.hunger)}%`}
                            barClass="hunger"
                        />
                        <StatRow
                            label="Felicidad"
                            width={stats.happiness}
                            valueText={`${Math.round(stats.happiness)}%`}
                            barClass="happiness"
                        />
                        <ActionButtons onHeal={handleHeal} onFeed={handleFeed} />
                        <BerrySection inventory={inventory} onUseBerry={handleUseBerry} />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import bagIcon from '../../assets/items/bag_icon.png';
import './DesertPage.css';

const DESERT_SIZE = 10;
const DESERT_POKEMON = [27, 28, 50, 51, 74, 75, 95, 104, 105, 111]; // Sandshrew, Diglett, Geodude, Cubone, Rhyhorn
const OASIS_POKEMON = [60, 61, 116, 117, 129]; // Poliwag, Horsea, Magikarp (water types in oasis)

const GEOGRAPHY_FACTS = [
    "🏜️ Los desiertos cubren aproximadamente 1/3 de la superficie terrestre.",
    "💧 Los oasis son vitales para la vida en el desierto - ¡son fuentes de agua!",
    "🌡️ Los desiertos pueden ser muy calientes de día y fríos de noche.",
    "🌵 Los cactus almacenan agua en sus tallos para sobrevivir.",
    "🐪 Los animales del desierto están adaptados para necesitar poca agua.",
];

export function DesertPage() {
    const navigate = useNavigate();
    const { coins, addCoins, toggleOwned } = usePokemonContext();
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const [encounter, setEncounter] = useState(null);
    const [message, setMessage] = useState(null);
    const [sandstorm, setSandstorm] = useState(false);
    const [discoveredOases, setDiscoveredOases] = useState([]);
    const [showFact, setShowFact] = useState(true);

    // Generate oasis positions (3 random positions)
    const [oases] = useState(() => {
        const positions = [];
        for (let i = 0; i < 3; i++) {
            positions.push({
                x: Math.floor(Math.random() * DESERT_SIZE),
                y: Math.floor(Math.random() * DESERT_SIZE)
            });
        }
        return positions;
    });

    // Sandstorm effect (periodic)
    useEffect(() => {
        const interval = setInterval(() => {
            setSandstorm(prev => !prev);
        }, 15000); // Toggle every 15 seconds
        return () => clearInterval(interval);
    }, []);

    const isOasis = (x, y) => {
        return oases.some(oasis => oasis.x === x && oasis.y === y);
    };

    const handleMove = (dx, dy) => {
        const newX = Math.max(0, Math.min(DESERT_SIZE - 1, playerPos.x + dx));
        const newY = Math.max(0, Math.min(DESERT_SIZE - 1, playerPos.y + dy));

        setPlayerPos({ x: newX, y: newY });

        // Check for oasis discovery
        if (isOasis(newX, newY) && !discoveredOases.some(o => o.x === newX && o.y === newY)) {
            setDiscoveredOases(prev => [...prev, { x: newX, y: newY }]);
            showMessage('💧 ¡Encontraste un oasis! Puedes descansar aquí.', '#10b981');
            addCoins(100);
            return;
        }

        // Random encounter (30% chance, lower during sandstorm)
        const encounterChance = sandstorm ? 0.15 : 0.3;
        if (Math.random() < encounterChance) {
            triggerEncounter(newX, newY);
        }
    };

    const triggerEncounter = async (x, y) => {
        const pokemonPool = isOasis(x, y) ? OASIS_POKEMON : DESERT_POKEMON;
        const randomId = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
        const details = await getPokemonDetails(randomId);
        setEncounter(details);
    };

    const handleCatch = () => {
        if (encounter) {
            const success = Math.random() > 0.4;
            if (success) {
                toggleOwned(encounter.id);
                showMessage(`✅ ¡Capturaste a ${encounter.name}!`, '#10b981');
                addCoins(50);
                setEncounter(null);
            } else {
                showMessage(`❌ ${encounter.name} escapó...`, '#ef4444');
                setEncounter(null);
            }
        }
    };

    const showMessage = (text, color) => {
        setMessage({ text, color });
        setTimeout(() => setMessage(null), 3000);
    };

    const getTileEmoji = (x, y) => {
        if (x === playerPos.x && y === playerPos.y) return '🧍';
        if (isOasis(x, y)) {
            return discoveredOases.some(o => o.x === x && o.y === y) ? '💧' : '🏜️';
        }
        if (Math.random() > 0.7) return '🌵';
        return '🏜️';
    };

    return (
        <div className={`desert-page ${sandstorm ? 'sandstorm' : ''}`}>
            <header className="desert-header">
                <button className="back-btn" onClick={() => navigate('/adventure')}>← Volver</button>
                <h1>🏜️ Desierto Misterioso</h1>
                <div className="coin-display"><img src={bagIcon} alt="coins" /> {coins}</div>
            </header>

            {sandstorm && (
                <div className="sandstorm-warning">
                    ⚠️ ¡Tormenta de arena! La visibilidad es limitada.
                </div>
            )}

            {message && (
                <div className="desert-message" style={{ background: message.color }}>
                    {message.text}
                </div>
            )}

            {showFact && (
                <div className="geography-fact">
                    {GEOGRAPHY_FACTS[Math.floor(Math.random() * GEOGRAPHY_FACTS.length)]}
                    <button className="fact-close" onClick={() => setShowFact(false)}>✕</button>
                </div>
            )}

            <div className="desert-stats">
                <span>Posición: ({playerPos.x}, {playerPos.y})</span>
                <span>Oasis descubiertos: {discoveredOases.length}/3</span>
            </div>

            <div className="desert-grid">
                {Array.from({ length: DESERT_SIZE }).map((_, y) => (
                    <div key={y} className="desert-row">
                        {Array.from({ length: DESERT_SIZE }).map((_, x) => (
                            <div
                                key={`${x}-${y}`}
                                className={`desert-tile ${x === playerPos.x && y === playerPos.y ? 'player' : ''} ${isOasis(x, y) ? 'oasis' : ''}`}
                            >
                                {getTileEmoji(x, y)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="desert-controls">
                <button onClick={() => handleMove(0, -1)}>⬆️</button>
                <div className="control-row">
                    <button onClick={() => handleMove(-1, 0)}>⬅️</button>
                    <button onClick={() => handleMove(1, 0)}>➡️</button>
                </div>
                <button onClick={() => handleMove(0, 1)}>⬇️</button>
            </div>

            {encounter && (
                <div className="encounter-modal">
                    <div className="encounter-content">
                        <h2>¡Pokémon salvaje!</h2>
                        <img src={encounter.sprites.front_default} alt={encounter.name} />
                        <h3>{encounter.name}</h3>
                        <div className="encounter-actions">
                            <button className="catch-btn" onClick={handleCatch}>
                                ⚾ Capturar
                            </button>
                            <button className="flee-btn" onClick={() => setEncounter(null)}>
                                🏃 Huir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import bagIcon from '../../assets/items/bag_icon.png';
import './CaveDungeonPage.css';

const CAVE_POKEMON = [41, 42, 74, 75, 95, 35, 36]; // Zubat, Golbat, Geodude, Graveler, Onix, Clefairy
const BOSS_POKEMON = [150, 144, 145, 146]; // Mewtwo, Articuno, Zapdos, Moltres

const GEOLOGY_FACTS = [
    "🪨 Las cuevas se forman cuando el agua disuelve la roca durante miles de años.",
    "💎 ¡Algunas cuevas contienen cristales gigantes!",
    "🦇 Muchos murciélagos viven en cuevas porque son oscuras y seguras.",
    "🌡️ La temperatura en las cuevas suele ser constante todo el año.",
];

const PUZZLES = {
    1: { type: 'push', description: 'Empuja el bloque a la marca X', solution: [0, 1, 0, 1] },
    2: { type: 'switch', description: 'Activa todos los interruptores', switches: 3 },
    3: { type: 'dark', description: 'Navega en la oscuridad', moves: 5 },
    4: { type: 'ice', description: 'Deslízate por el hielo hasta la salida', slides: 4 },
};

export function CaveDungeonPage() {
    const navigate = useNavigate();
    const { coins, addCoins, toggleOwned, addItem } = usePokemonContext();
    const [floor, setFloor] = useState(1);
    const [puzzleState, setPuzzleState] = useState({ completed: false, progress: 0 });
    const [encounter, setEncounter] = useState(null);
    const [message, setMessage] = useState(null);

    const handlePuzzleAction = () => {
        const puzzle = PUZZLES[floor];

        if (puzzle.type === 'push') {
            const newProgress = puzzleState.progress + 1;
            if (newProgress >= puzzle.solution.length) {
                completePuzzle();
            } else {
                setPuzzleState({ ...puzzleState, progress: newProgress });
            }
        } else if (puzzle.type === 'switch') {
            const newProgress = puzzleState.progress + 1;
            if (newProgress >= puzzle.switches) {
                completePuzzle();
            } else {
                setPuzzleState({ ...puzzleState, progress: newProgress });
            }
        } else if (puzzle.type === 'dark' || puzzle.type === 'ice') {
            const newProgress = puzzleState.progress + 1;
            if (newProgress >= puzzle.moves) {
                completePuzzle();
            } else {
                setPuzzleState({ ...puzzleState, progress: newProgress });
            }
        }
    };

    const completePuzzle = () => {
        setPuzzleState({ completed: true, progress: 0 });
        showMessage('✅ ¡Puzzle completado!', '#10b981');

        // Random reward
        const reward = Math.floor(Math.random() * 200) + 100;
        addCoins(reward);

        // Chance for encounter
        if (Math.random() > 0.5) {
            triggerEncounter();
        }
    };

    const triggerEncounter = async () => {
        const pokemonPool = floor === 5 ? BOSS_POKEMON : CAVE_POKEMON;
        const randomId = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
        const details = await getPokemonDetails(randomId);
        setEncounter(details);
    };

    const handleCatch = () => {
        if (encounter) {
            const success = Math.random() > 0.3;
            if (success) {
                toggleOwned(encounter.id);
                showMessage(`✅ ¡Capturaste a ${encounter.name}!`, '#10b981');
                if (floor === 5) {
                    addCoins(500);
                    addItem('rare-candy', 3);
                }
                setEncounter(null);
            } else {
                showMessage(`❌ ${encounter.name} escapó...`, '#ef4444');
                setEncounter(null);
            }
        }
    };

    const nextFloor = () => {
        if (floor < 5) {
            setFloor(floor + 1);
            setPuzzleState({ completed: false, progress: 0 });
            showMessage(`Avanzaste al piso ${floor + 1}`, '#3b82f6');
        } else {
            showMessage('🏆 ¡Completaste la mazmorra!', '#fbbf24');
            setTimeout(() => navigate('/adventure'), 3000);
        }
    };

    const showMessage = (text, color) => {
        setMessage({ text, color });
        setTimeout(() => setMessage(null), 3000);
    };

    const currentPuzzle = PUZZLES[floor];

    return (
        <div className="cave-page">
            <header className="cave-header">
                <button className="back-btn" onClick={() => navigate('/adventure')}>← Salir</button>
                <h1>🕳️ Mazmorra Oscura</h1>
                <div className="coin-display"><img src={bagIcon} alt="coins" /> {coins}</div>
            </header>

            {message && (
                <div className="cave-message" style={{ background: message.color }}>
                    {message.text}
                </div>
            )}

            <div className="cave-info">
                <div className="floor-indicator">Piso {floor}/5</div>
                <div className="geology-fact">
                    {GEOLOGY_FACTS[floor - 1] || GEOLOGY_FACTS[0]}
                </div>
            </div>

            <div className="puzzle-container">
                <h2>{currentPuzzle.description}</h2>

                {currentPuzzle.type === 'push' && (
                    <div className="push-puzzle">
                        <div className="puzzle-grid">
                            <div className="block">📦</div>
                            <div className="target">❌</div>
                        </div>
                        <div className="puzzle-progress">
                            Movimientos: {puzzleState.progress}/{currentPuzzle.solution.length}
                        </div>
                        <button className="puzzle-btn" onClick={handlePuzzleAction}>
                            Empujar Bloque
                        </button>
                    </div>
                )}

                {currentPuzzle.type === 'switch' && (
                    <div className="switch-puzzle">
                        <div className="switches">
                            {Array.from({ length: currentPuzzle.switches }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`switch ${i < puzzleState.progress ? 'active' : ''}`}
                                >
                                    {i < puzzleState.progress ? '🟢' : '🔴'}
                                </div>
                            ))}
                        </div>
                        <button className="puzzle-btn" onClick={handlePuzzleAction}>
                            Activar Interruptor
                        </button>
                    </div>
                )}

                {currentPuzzle.type === 'dark' && (
                    <div className="dark-puzzle">
                        <div className="dark-room">🌑</div>
                        <div className="puzzle-progress">
                            Pasos: {puzzleState.progress}/{currentPuzzle.moves}
                        </div>
                        <button className="puzzle-btn" onClick={handlePuzzleAction}>
                            Avanzar en la Oscuridad
                        </button>
                    </div>
                )}

                {currentPuzzle.type === 'ice' && (
                    <div className="ice-puzzle">
                        <div className="ice-floor">🧊</div>
                        <div className="puzzle-progress">
                            Deslizamientos: {puzzleState.progress}/{currentPuzzle.slides}
                        </div>
                        <button className="puzzle-btn" onClick={handlePuzzleAction}>
                            Deslizarse
                        </button>
                    </div>
                )}

                {puzzleState.completed && (
                    <button className="next-floor-btn" onClick={nextFloor}>
                        {floor < 5 ? '⬇️ Siguiente Piso' : '🏆 Completar Mazmorra'}
                    </button>
                )}
            </div>

            {encounter && (
                <div className="encounter-modal">
                    <div className="encounter-content">
                        <h2>{floor === 5 ? '👑 ¡Jefe Final!' : '¡Pokémon salvaje!'}</h2>
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

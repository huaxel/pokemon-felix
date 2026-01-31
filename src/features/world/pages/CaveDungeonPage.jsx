import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { getPokemonDetails } from '../../../lib/api';
import { BattleArena } from '../../battle/components/BattleArena';
import { BattleRewardModal } from '../components/BattleRewardModal';
import { WorldPageHeader } from '../components/WorldPageHeader';
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
    const { showSuccess, showError, showInfo, showWarning } = useToast();
    const navigate = useNavigate();
    const { addCoins, toggleOwned, addItem, squadIds, pokemonList } = usePokemonContext();
    const [floor, setFloor] = useState(1);
    const [puzzleState, setPuzzleState] = useState({ completed: false, progress: 0 });
    const [encounter, setEncounter] = useState(null);
    const [battleMode, setBattleMode] = useState(false);
    const [showReward, setShowReward] = useState(false);

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
        showSuccess('✅ ¡Puzzle completado!');

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
                showSuccess(`✅ ¡Capturaste a ${encounter.name}!`);
                if (floor === 5) {
                    addCoins(500);
                    addItem('rare-candy', 3);
                }
                setEncounter(null);
            } else {
                showError(`❌ ${encounter.name} escapó...`);
                setEncounter(null);
            }
        }
    };

    const handleBattleEnd = useCallback((winner) => {
        if (winner && winner.name !== encounter?.name) {
            setShowReward(true);
        } else {
            setBattleMode(false);
            setEncounter(null);
        }
    }, [encounter]);

    const handleRewardChoice = (choice) => {
        if (choice === 'pokemon') {
            toggleOwned(encounter.id);
            showSuccess(`✅ ¡${encounter.name} se unió a tu equipo!`);
        } else {
            addCoins(500);
            showWarning(`✅ ¡Ganaste 500 monedas!`);
        }

        setShowReward(false);
        setBattleMode(false);
        setEncounter(null);
    };

    const nextFloor = () => {
        if (floor < 5) {
            setFloor(floor + 1);
            setPuzzleState({ completed: false, progress: 0 });
            showInfo(`Avanzaste al piso ${floor + 1}`);
        } else {
            showWarning('🏆 ¡Completaste la mazmorra!');
            setTimeout(() => navigate('/adventure'), 3000);
        }
    };

    const currentPuzzle = PUZZLES[floor];

    return (
        <div className="cave-page">
            <WorldPageHeader title="Mazmorra Oscura" icon="🕳️" />


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
                        {showReward ? (
                            <BattleRewardModal
                                pokemon={encounter}
                                onChoice={handleRewardChoice}
                            />
                        ) : battleMode ? (
                            <BattleArena
                                initialFighter1={pokemonList.find(p => p.id === squadIds[0])}
                                initialFighter2={encounter}
                                onBattleEnd={handleBattleEnd}
                            />
                        ) : (
                            <>
                                <h2>{floor === 5 ? '👑 ¡Jefe Final!' : '¡Pokémon salvaje!'}</h2>
                                <img src={encounter.sprites.front_default} alt={encounter.name} />
                                <h3>{encounter.name}</h3>
                                <div className="encounter-actions">
                                    <button className="catch-btn" onClick={handleCatch}>
                                        ⚾ Capturar
                                    </button>
                                    <button className="fight-btn" onClick={() => setBattleMode(true)}>
                                        ⚔️ Luchar
                                    </button>
                                    <button className="flee-btn" onClick={() => setEncounter(null)}>
                                        🏃 Huir
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

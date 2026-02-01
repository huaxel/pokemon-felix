import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { getPokemonDetails } from '../../../lib/api';
import { BattleArena } from '../../battle/components/BattleArena';
import { BattleRewardModal } from '../components/BattleRewardModal';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { caveEntranceTile } from '../worldAssets';
import './CaveDungeonPage.css';

const CAVE_POKEMON = [41, 42, 74, 75, 95, 35, 36];
const BOSS_POKEMON = [150, 144, 145, 146];

const GEOLOGY_FACTS = [
    "🪨 Grotten ontstaan wanneer water rotsen oplost gedurende duizenden jaren.",
    "💎 Sommige grotten bevatten gigantische kristallen!",
    "🦇 Veel vleermuizen leven in grotten omdat ze donker en veilig zijn.",
    "🌡️ De temperatuur in grotten is meestal het hele jaar constant.",
];

const PUZZLES = {
    1: { type: 'push', description: 'Duw het blok naar de X', solution: [0, 1, 0, 1], target: 4 },
    2: { type: 'switch', description: 'Activeer alle schakelaars', switches: 3, target: 3 },
    3: { type: 'dark', description: 'Navigeer in het donker', moves: 5, target: 5 },
    4: { type: 'ice', description: 'Glijd over het ijs naar de uitgang', slides: 4, target: 4 }
};

function PuzzleView({ puzzle, puzzleState, onAction, onNext, floor }) {
    return (
        <div className="puzzle-container game-panel-dark" style={{ border: '4px solid #4b5563', backgroundColor: '#1f2937', padding: '1rem', color: '#fff' }}>
            <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem', marginBottom: '1rem', color: '#fbbf24' }}>{puzzle.description}</h2>

            {puzzle.type === 'push' && (
                <div className="push-puzzle">
                    <div className="puzzle-grid" style={{ marginBottom: '1rem' }}>
                        <div className="block" style={{ fontSize: '2rem' }}>📦</div>
                        <div className="target" style={{ fontSize: '2rem' }}>❌</div>
                    </div>
                    <div className="puzzle-progress" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        Zetten: {puzzleState.progress}/{puzzle.solution.length}
                    </div>
                    <button className="btn-kenney primary" onClick={onAction}>
                        Blok Duwen
                    </button>
                </div>
            )}

            {puzzle.type === 'switch' && (
                <div className="switch-puzzle">
                    <div className="switches" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                        {Array.from({ length: puzzle.switches }).map((_, i) => (
                            <div
                                key={i}
                                className={`switch ${i < puzzleState.progress ? 'active' : ''}`}
                                style={{ fontSize: '2rem' }}
                            >
                                {i < puzzleState.progress ? '🟢' : '🔴'}
                            </div>
                        ))}
                    </div>
                    <button className="btn-kenney primary" onClick={onAction}>
                        Schakelaar Activeren
                    </button>
                </div>
            )}

            {puzzle.type === 'dark' && (
                <div className="dark-puzzle">
                    <div className="dark-room" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌑</div>
                    <div className="puzzle-progress" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        Stappen: {puzzleState.progress}/{puzzle.moves}
                    </div>
                    <button className="btn-kenney primary" onClick={onAction}>
                        Vooruit in het donker
                    </button>
                </div>
            )}

            {puzzle.type === 'ice' && (
                <div className="ice-puzzle">
                    <div className="ice-floor" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧊</div>
                    <div className="puzzle-progress" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        Glijbewegingen: {puzzleState.progress}/{puzzle.slides}
                    </div>
                    <button className="btn-kenney primary" onClick={onAction}>
                        Glijden
                    </button>
                </div>
            )}

            {puzzleState.completed && (
                <button className="btn-kenney success" onClick={onNext} style={{ marginTop: '1.5rem', width: '100%' }}>
                    {floor < 5 ? '⬇️ Volgende Verdieping' : '🏆 Kerker Voltooien'}
                </button>
            )}
        </div>
    );
}

function EncounterModal({
    encounter,
    showReward,
    battleMode,
    onRewardChoice,
    onBattleEnd,
    onCatch,
    onFight,
    onFlee,
    floor,
    pokemonList,
    squadIds
}) {
    return (
        <div className="encounter-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <div className="encounter-content game-panel" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '4px solid #4b5563', maxWidth: '90%' }}>
                {showReward ? (
                    <BattleRewardModal
                        pokemon={encounter}
                        onChoice={onRewardChoice}
                    />
                ) : battleMode ? (
                    <BattleArena
                        initialFighter1={pokemonList.find(p => p.id === squadIds[0])}
                        initialFighter2={encounter}
                        onBattleEnd={onBattleEnd}
                    />
                ) : (
                    <>
                        <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem', textAlign: 'center', marginBottom: '1rem' }}>{floor === 5 ? '👑 Eindbaas!' : 'Wilde Pokémon!'}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <img src={encounter.sprites.front_default} alt={encounter.name} style={{ imageRendering: 'pixelated', width: '128px', height: '128px' }} />
                        </div>
                        <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', textAlign: 'center', marginBottom: '2rem' }}>{encounter.name}</h3>
                        <div className="encounter-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button className="btn-kenney success" onClick={onCatch}>
                                ⚾ Vangen
                            </button>
                            <button className="btn-kenney danger" onClick={onFight}>
                                ⚔️ Vechten
                            </button>
                            <button className="btn-kenney neutral" onClick={onFlee}>
                                🏃 Vluchten
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

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
        const newProgress = puzzleState.progress + 1;
        if (newProgress >= puzzle.target) {
            completePuzzle();
        } else {
            setPuzzleState({ ...puzzleState, progress: newProgress });
        }
    };

    const completePuzzle = () => {
        setPuzzleState({ completed: true, progress: 0 });
        showSuccess('✅ Puzzel voltooid!');

        const reward = Math.floor(Math.random() * 200) + 100;
        addCoins(reward);
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
                showSuccess(`✅ Je hebt ${encounter.name} gevangen!`);
                if (floor === 5) {
                    addCoins(500);
                    addItem('rare-candy', 3);
                }
                setEncounter(null);
            } else {
                showError(`❌ ${encounter.name} is ontsnapt...`);
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
            showSuccess(`✅ ${encounter.name} voegde zich bij je team!`);
        } else {
            addCoins(500);
            showWarning(`✅ Je hebt 500 munten gewonnen!`);
        }

        setShowReward(false);
        setBattleMode(false);
        setEncounter(null);
    };

    const nextFloor = () => {
        if (floor < 5) {
            setFloor(floor + 1);
            setPuzzleState({ completed: false, progress: 0 });
            showInfo(`Je bent naar verdieping ${floor + 1} gegaan`);
        } else {
            showWarning('🏆 Je hebt de kerker voltooid!');
            setTimeout(() => navigate('/adventure'), 3000);
        }
    };

    const currentPuzzle = PUZZLES[floor];

    return (
        <div className="cave-page" style={{ 
            backgroundColor: '#111827',
            backgroundImage: `url(${caveEntranceTile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
        }}>
            <WorldPageHeader title="Donkere Kerker" icon="🕳️" />


            <div className="cave-info game-panel" style={{ border: '4px solid #4b5563', backgroundColor: '#374151', padding: '1rem', color: '#fff', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="floor-indicator" style={{ fontFamily: '"Press Start 2P", cursive', color: '#fbbf24' }}>Verdieping {floor}/5</div>
                <div className="geology-fact" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                    {GEOLOGY_FACTS[floor - 1] || GEOLOGY_FACTS[0]}
                </div>
            </div>

            <PuzzleView
                puzzle={currentPuzzle}
                puzzleState={puzzleState}
                onAction={handlePuzzleAction}
                onNext={nextFloor}
                floor={floor}
            />

            {encounter && (
                <EncounterModal
                    encounter={encounter}
                    showReward={showReward}
                    battleMode={battleMode}
                    onRewardChoice={handleRewardChoice}
                    onBattleEnd={handleBattleEnd}
                    onCatch={handleCatch}
                    onFight={() => setBattleMode(true)}
                    onFlee={() => setEncounter(null)}
                    floor={floor}
                    pokemonList={pokemonList}
                    squadIds={squadIds}
                />
            )}
        </div>
    );
}

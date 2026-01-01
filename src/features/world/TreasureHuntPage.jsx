import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import './TreasureHuntPage.css';

export function TreasureHuntPage() {
    const navigate = useNavigate();
    const { addCoins, getPokemonDetails } = usePokemonContext();

    // Game state
    const [stage, setStage] = useState('tutorial'); // tutorial, hunting, success, failed
    const [currentHunt, setCurrentHunt] = useState(null);
    const [huntsCompleted, setHuntsCompleted] = useState(0);
    const [playerGuess, setPlayerGuess] = useState({ x: '', y: '' });
    const [attempts, setAttempts] = useState(0);
    const [distance, setDistance] = useState(null);
    const [message, setMessage] = useState('');
    const [rewardPokemon, setRewardPokemon] = useState(null);

    // Treasure hunt templates
    const TREASURE_HUNTS = [
        {
            id: 1,
            difficulty: 'Easy',
            target: { x: 5, y: 5 },
            clue: "The treasure is at the center of the town, where Professor Oak often stands!",
            reward: 300,
            pokemonReward: 'pikachu'
        },
        {
            id: 2,
            difficulty: 'Easy',
            target: { x: 8, y: 8 },
            clue: "Look in the southeast corner, near the Gacha machine!",
            reward: 350,
            pokemonReward: 'eevee'
        },
        {
            id: 3,
            difficulty: 'Medium',
            target: { x: 3, y: 7 },
            clue: "The treasure is west of the path, near the Gym building!",
            reward: 500,
            pokemonReward: 'bulbasaur'
        },
        {
            id: 4,
            difficulty: 'Medium',
            target: { x: 9, y: 4 },
            clue: "Search the eastern water area, by the Fountain Plaza!",
            reward: 550,
            pokemonReward: 'squirtle'
        },
        {
            id: 5,
            difficulty: 'Hard',
            target: { x: 1, y: 1 },
            clue: "In the northwest corner of the world, where few travelers go...",
            reward: 800,
            pokemonReward: 'charmander'
        },
        {
            id: 6,
            difficulty: 'Hard',
            target: { x: 6, y: 9 },
            clue: "At the southern boundary, near the Evolution Hall!",
            reward: 850,
            pokemonReward: 'dratini'
        },
        {
            id: 7,
            difficulty: 'Expert',
            target: { x: 9, y: 7 },
            clue: "High in the mountains, where the air is thin...",
            reward: 1200,
            pokemonReward: 'larvitar'
        },
        {
            id: 8,
            difficulty: 'Expert',
            target: { x: 0, y: 0 },
            clue: "The most northwestern point of the entire world!",
            reward: 1500,
            pokemonReward: 'beldum'
        }
    ];

    useEffect(() => {
        // Load completed hunts from localStorage
        const saved = localStorage.getItem('treasure_hunts_completed');
        if (saved) {
            setHuntsCompleted(parseInt(saved));
        }
    }, []);

    // Calculate distance between two coordinates
    const calculateDistance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // Get direction hint
    const getDirectionHint = (guessX, guessY, targetX, targetY) => {
        const dx = targetX - guessX;
        const dy = targetY - guessY;

        let direction = '';

        if (Math.abs(dy) > 0.5) {
            direction += dy < 0 ? 'North' : 'South';
        }
        if (Math.abs(dx) > 0.5) {
            direction += dx < 0 ? 'West' : 'East';
        }

        return direction || 'Very close!';
    };

    const startNewHunt = () => {
        // Pick next available hunt
        const availableHunts = TREASURE_HUNTS.filter(h => h.id > huntsCompleted);
        if (availableHunts.length === 0) {
            setMessage("🎉 You've completed all treasure hunts! Amazing!");
            return;
        }

        const nextHunt = availableHunts[0];
        setCurrentHunt(nextHunt);
        setStage('hunting');
        setAttempts(0);
        setDistance(null);
        setPlayerGuess({ x: '', y: '' });
        setMessage('');
    };

    const handleGuess = async () => {
        const guessX = parseInt(playerGuess.x);
        const guessY = parseInt(playerGuess.y);

        // Validate input
        if (isNaN(guessX) || isNaN(guessY)) {
            setMessage('❌ Please enter valid numbers for X and Y coordinates!');
            return;
        }

        if (guessX < 0 || guessX > 9 || guessY < 0 || guessY > 9) {
            setMessage('❌ Coordinates must be between 0 and 9!');
            return;
        }

        setAttempts(prev => prev + 1);

        // Check if correct
        if (guessX === currentHunt.target.x && guessY === currentHunt.target.y) {
            // Success!
            const pokemon = await getPokemonDetails(currentHunt.pokemonReward);
            setRewardPokemon(pokemon);
            setStage('success');
            addCoins(currentHunt.reward);

            const newCompleted = huntsCompleted + 1;
            setHuntsCompleted(newCompleted);
            localStorage.setItem('treasure_hunts_completed', newCompleted.toString());

            setMessage(`🎉 Treasure found in ${attempts + 1} attempts!`);
        } else {
            // Calculate distance and give hint
            const dist = calculateDistance(guessX, guessY, currentHunt.target.x, currentHunt.target.y);
            setDistance(dist);

            const direction = getDirectionHint(guessX, guessY, currentHunt.target.x, currentHunt.target.y);

            if (dist < 2) {
                setMessage(`🔥 Very close! Try going ${direction}!`);
            } else if (dist < 4) {
                setMessage(`⚠️ Getting warmer! Head ${direction}!`);
            } else {
                setMessage(`❄️ Still far away. Go ${direction}!`);
            }

            // Fail after 10 attempts
            if (attempts >= 9) {
                setStage('failed');
                setMessage(`😔 Out of attempts! The treasure was at (${currentHunt.target.x}, ${currentHunt.target.y})`);
            }
        }
    };

    const handleRestart = () => {
        setStage('hunting');
        setAttempts(0);
        setDistance(null);
        setPlayerGuess({ x: '', y: '' });
        setMessage('');
    };

    if (stage === 'tutorial') {
        return (
            <div className="treasure-hunt-page tutorial">
                <div className="tutorial-content">
                    <h1>🗺️ GPS Treasure Hunt</h1>

                    <div className="tutorial-info">
                        <div className="coordinates-lesson">
                            <h2>📍 Understanding Coordinates</h2>
                            <div className="grid-example">
                                <div className="axis-label y-axis">Y ↑</div>
                                <div className="mini-grid">
                                    {[...Array(5)].map((_, y) => (
                                        <div key={y} className="mini-row">
                                            {[...Array(5)].map((_, x) => (
                                                <div key={x} className="mini-cell">
                                                    {x === 2 && y === 2 ? '🎁' : ''}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="axis-label x-axis">X →</div>
                            </div>
                            <p className="example-text">
                                The treasure 🎁 above is at coordinates <strong>(X: 2, Y: 2)</strong>
                            </p>
                        </div>

                        <div className="rules">
                            <h3>📜 How to Play:</h3>
                            <ul>
                                <li>🧭 Read the clue about where treasure is hidden</li>
                                <li>📐 Enter X and Y coordinates (0-9 for each)</li>
                                <li>🎯 You have 10 attempts to find it</li>
                                <li>🔥 Distance hints will guide you (Hot/Cold)</li>
                                <li>💰 Find treasure to earn coins + Pokemon!</li>
                            </ul>
                        </div>

                        <div className="rewards-preview">
                            <h3>🏆 Rewards:</h3>
                            <p>Complete treasure hunts to earn:</p>
                            <ul>
                                <li>💰 300-1500 coins per hunt</li>
                                <li>✨ Special Pokemon rewards</li>
                                <li>🎓 Map reading skills</li>
                            </ul>
                        </div>

                        <div className="progress-info">
                            <p>Hunts Completed: <strong>{huntsCompleted} / {TREASURE_HUNTS.length}</strong></p>
                        </div>
                    </div>

                    <div className="tutorial-actions">
                        <button className="start-hunt-btn" onClick={startNewHunt}>
                            🗺️ Start Treasure Hunt
                        </button>
                        <button className="back-btn" onClick={() => navigate('/adventure')}>
                            ← Back to World
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'hunting') {
        return (
            <div className="treasure-hunt-page hunting">
                <div className="hunt-header">
                    <button className="exit-btn" onClick={() => navigate('/adventure')}>
                        ← Exit
                    </button>
                    <h2>Treasure Hunt #{currentHunt.id}</h2>
                    <div className="difficulty-badge" data-difficulty={currentHunt.difficulty}>
                        {currentHunt.difficulty}
                    </div>
                </div>

                <div className="hunt-content">
                    <div className="clue-card">
                        <h3>🗺️ Clue:</h3>
                        <p className="clue-text">{currentHunt.clue}</p>
                    </div>

                    <div className="progress-stats">
                        <div className="stat">
                            <span className="stat-label">Attempts:</span>
                            <span className="stat-value">{attempts} / 10</span>
                        </div>
                        {distance !== null && (
                            <div className="stat">
                                <span className="stat-label">Distance:</span>
                                <span className="stat-value">{distance.toFixed(2)} units</span>
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`hunt-message ${message.includes('close') ? 'hot' :
                            message.includes('warmer') ? 'warm' : 'cold'
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="coordinate-input">
                        <h3>📍 Enter Coordinates:</h3>
                        <div className="input-row">
                            <div className="input-group">
                                <label>X:</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={playerGuess.x}
                                    onChange={(e) => setPlayerGuess(prev => ({ ...prev, x: e.target.value }))}
                                    placeholder="0-9"
                                />
                            </div>
                            <div className="input-group">
                                <label>Y:</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={playerGuess.y}
                                    onChange={(e) => setPlayerGuess(prev => ({ ...prev, y: e.target.value }))}
                                    placeholder="0-9"
                                />
                            </div>
                        </div>
                        <button className="guess-btn" onClick={handleGuess}>
                            🔍 Check Location
                        </button>
                    </div>

                    <div className="hunt-guide">
                        <h4>📚 Coordinate Guide:</h4>
                        <ul>
                            <li><strong>X = 0</strong>: Far West (left side)</li>
                            <li><strong>X = 9</strong>: Far East (right side)</li>
                            <li><strong>Y = 0</strong>: Far North (top)</li>
                            <li><strong>Y = 9</strong>: Far South (bottom)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'success') {
        return (
            <div className="treasure-hunt-page success">
                <div className="success-content">
                    <h1>🎉 Treasure Found!</h1>

                    <div className="treasure-chest">
                        <div className="chest-animation">🎁</div>
                    </div>

                    <div className="success-message">
                        <p>You found the treasure at coordinates:</p>
                        <h2>({currentHunt.target.x}, {currentHunt.target.y})</h2>
                        <p className="attempts-text">In {attempts} attempts!</p>
                    </div>

                    <div className="rewards-earned">
                        <h3>🏆 Rewards:</h3>
                        <div className="reward-coins">
                            💰 +{currentHunt.reward} coins
                        </div>
                        {rewardPokemon && (
                            <div className="reward-pokemon">
                                <img
                                    src={rewardPokemon.sprites.front_default}
                                    alt={rewardPokemon.name}
                                    className="reward-pokemon-img"
                                />
                                <p className="pokemon-name">{rewardPokemon.name}</p>
                                <p className="pokemon-added">✨ Added to collection!</p>
                            </div>
                        )}
                    </div>

                    <div className="success-actions">
                        {huntsCompleted < TREASURE_HUNTS.length ? (
                            <button className="next-hunt-btn" onClick={startNewHunt}>
                                🗺️ Next Treasure Hunt
                            </button>
                        ) : (
                            <p className="all-complete">🎊 All treasure hunts complete!</p>
                        )}
                        <button className="back-btn" onClick={() => navigate('/adventure')}>
                            ← Back to World
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'failed') {
        return (
            <div className="treasure-hunt-page failed">
                <div className="failed-content">
                    <h1>😔 Out of Attempts!</h1>

                    <div className="failed-message">
                        <p>The treasure was at:</p>
                        <h2>({currentHunt.target.x}, {currentHunt.target.y})</h2>
                        <p className="encouragement">Don&apos;t give up! Try again and use the distance hints!</p>
                    </div>

                    <div className="learning-tip">
                        <h3>💡 Tips for Next Time:</h3>
                        <ul>
                            <li>🔥 &quot;Very close&quot; = less than 2 units away</li>
                            <li>⚠️ &quot;Getting warmer&quot; = 2-4 units away</li>
                            <li>❄️ &quot;Far away&quot; = more than 4 units</li>
                            <li>🧭 Use compass directions (North/South/East/West)</li>
                        </ul>
                    </div>

                    <div className="failed-actions">
                        <button className="retry-btn" onClick={handleRestart}>
                            🔄 Try Again
                        </button>
                        <button className="back-btn" onClick={() => navigate('/adventure')}>
                            ← Back to World
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

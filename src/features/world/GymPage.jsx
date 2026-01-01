import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import bagIcon from '../../assets/items/bag_icon.png';
import { BattleArena } from '../../components/BattleArena';
import { getPokemonDetails } from '../../lib/api';
import { GymCard } from './components/GymCard';
import { GymBadgeDisplay } from './components/GymBadgeDisplay';
import './GymPage.css';

/**
 * GymPage - 8 Gym Leaders with Badge System
 * Multi-stage progression with type-themed challenges
 */
export function GymPage() {
    const navigate = useNavigate();
    const { pokemonList, squadIds, addCoins } = usePokemonContext();
    const [selectedGym, setSelectedGym] = useState(null);
    const [battleState, setBattleState] = useState('selection'); // selection, battle, victory, defeat
    const [currentStage, setCurrentStage] = useState(0);
    const [winner, setWinner] = useState(null);
    const [opponentPokemon, setOpponentPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Badge State
    const [badges, setBadges] = useState(() => {
        const saved = localStorage.getItem('gym_badges') || '{}';
        return JSON.parse(saved);
    });

    // Save badges whenever they change
    useEffect(() => {
        localStorage.setItem('gym_badges', JSON.stringify(badges));
    }, [badges]);

    // 8 Gym Leaders Configuration
    const GYM_LEADERS = [
        {
            id: 0,
            name: 'Brock',
            type: '🪨 Rock',
            pokemon: ['geodude', 'onix'],
            color: '#a0826d',
            reward: 500,
            description: 'The Boulder Badge awaits!'
        },
        {
            id: 1,
            name: 'Misty',
            type: '💧 Water',
            pokemon: ['staryu', 'starmie'],
            color: '#4a90e2',
            reward: 600,
            description: 'The Cascade Badge is yours to earn!'
        },
        {
            id: 2,
            name: 'Lt. Surge',
            type: '⚡ Electric',
            pokemon: ['pikachu', 'raichu'],
            color: '#ffd700',
            reward: 700,
            description: 'The Thunder Badge - electrifying!'
        },
        {
            id: 3,
            name: 'Erika',
            type: '🌿 Grass',
            pokemon: ['oddish', 'vileplume'],
            color: '#66bb6a',
            reward: 800,
            description: 'The Rainbow Badge blooms here!'
        },
        {
            id: 4,
            name: 'Koga',
            type: '☠️ Poison',
            pokemon: ['koffing', 'weezing'],
            color: '#9c27b0',
            reward: 900,
            description: 'The Soul Badge - toxic power!'
        },
        {
            id: 5,
            name: 'Sabrina',
            type: '🧠 Psychic',
            pokemon: ['kadabra', 'alakazam'],
            color: '#e91e63',
            reward: 1000,
            description: 'The Marsh Badge - mind over matter!'
        },
        {
            id: 6,
            name: 'Blaine',
            type: '🔥 Fire',
            pokemon: ['ponyta', 'arcanine'],
            color: '#ff5722',
            reward: 1200,
            description: 'The Volcano Badge burns bright!'
        },
        {
            id: 7,
            name: 'Giovanni',
            type: '⚔️ Boss',
            pokemon: ['rhydon', 'nidoking'],
            color: '#673ab7',
            reward: 2000,
            description: 'The Earth Badge - the ultimate test!'
        }
    ];

    // Fetch Opponent Logic
    useEffect(() => {
        if (selectedGym && battleState === 'battle') {
            const fetchOpponent = async () => {
                setIsLoading(true);
                try {
                    const opponentName = selectedGym.pokemon[currentStage];
                    const details = await getPokemonDetails(opponentName);
                    if (details) {
                        setOpponentPokemon(details);
                    } else {
                        console.error("Failed to load Gym Pokemon:", opponentName);
                    }
                } catch (err) {
                    console.error("Error fetching Gym Pokemon:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOpponent();
        }
    }, [selectedGym, currentStage, battleState]);

    const handleSelectGym = (gym) => {
        if (badges[gym.id]) return; // Already beaten
        setSelectedGym(gym);
        setCurrentStage(0);
        setBattleState('battle');
    };

    const handleBattleEnd = (winnerPokemon) => {
        setWinner(winnerPokemon);

        // Determine if player won (winner ID matches one of player's squad IDs)
        if (squadIds.includes(winnerPokemon.id)) {
            // Player won this stage
            if (currentStage < selectedGym.pokemon.length - 1) {
                // Move to next Pokemon
                setTimeout(() => {
                    setCurrentStage(prev => prev + 1);
                    setWinner(null);
                    // BattleArena key change will trigger re-mount
                }, 1500);
            } else {
                // Won the entire gym!
                setTimeout(() => {
                    setBadges(prev => ({ ...prev, [selectedGym.id]: true }));
                    addCoins(selectedGym.reward);
                    setBattleState('victory');
                }, 1500);
            }
        } else {
            // Player lost
            setTimeout(() => {
                setBattleState('defeat');
            }, 1500);
        }
    };

    const handleBackToSelection = () => {
        setBattleState('selection');
        setSelectedGym(null);
        setCurrentStage(0);
        setWinner(null);
    };

    const getPlayerPokemon = () => {
        return pokemonList.find(p => p.id === squadIds[0]) || pokemonList[0];
    };

    const badgeCount = Object.values(badges).filter(Boolean).length;

    // Gym Selection Screen
    if (battleState === 'selection') {
        return (
            <div className="gym-page">
                <header className="gym-header">
                    <Link to="/adventure" className="back-btn">← Back to World</Link>
                    <h1>🏟️ Pokemon Gyms</h1>
                </header>

                <GymBadgeDisplay badges={badges} gymLeaders={GYM_LEADERS} />

                <div className="gyms-grid">
                    {GYM_LEADERS.map(gym => (
                        <GymCard
                            key={gym.id}
                            gym={gym}
                            isBeaten={badges[gym.id]}
                            onChallenge={handleSelectGym}
                        />
                    ))}
                </div>

                {badgeCount === 8 && (
                    <div className="champion-message">
                        <h2>🎉 Congratulations, Champion!</h2>
                        <p>You've collected all 8 gym badges! You are a Pokemon Master!</p>
                    </div>
                )}
            </div>
        );
    }

    // Battle Screen
    if (battleState === 'battle' && selectedGym) {
        const player = getPlayerPokemon();

        return (
            <div className="gym-page battle-mode">
                <div className="battle-info">
                    <h2>{selectedGym.name}'s Gym - {selectedGym.type}</h2>
                    <div className="stage-indicator">
                        Stage {currentStage + 1} of {selectedGym.pokemon.length}
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading">Loading {selectedGym.pokemon[currentStage]}...</div>
                ) : opponentPokemon && player ? (
                    <BattleArena
                        key={`${selectedGym.id}-${currentStage}`} // Force reset on stage change
                        initialFighter1={player}
                        initialFighter2={opponentPokemon}
                        onBattleEnd={handleBattleEnd}
                    />
                ) : (
                    <div className="loading">Preparing Battle...</div>
                )}
            </div>
        );
    }

    // Victory Screen
    if (battleState === 'victory' && selectedGym) {
        return (
            <div className="gym-page result-mode">
                <div className="victory-scene">
                    <h1>🎉 Gym Victory!</h1>
                    <div className="earned-badge" style={{ backgroundColor: selectedGym.color }}>
                        ⭐
                    </div>
                    <h2>You earned the {selectedGym.name} Badge!</h2>
                    <p className="reward-text">
                        <img src={bagIcon} alt="coins" className="coin-icon-inline" /> +{selectedGym.reward} coins
                    </p>
                    <p className="badge-count">Badges: {badgeCount}/8</p>
                    <button className="continue-btn" onClick={handleBackToSelection}>
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    // Defeat Screen
    if (battleState === 'defeat' && selectedGym) {
        return (
            <div className="gym-page result-mode">
                <div className="defeat-scene">
                    <h1>💔 Defeat</h1>
                    <p>Your Pokemon need more training...</p>
                    <button className="retry-btn" onClick={() => {
                        setCurrentStage(0);
                        setBattleState('battle');
                    }}>
                        ⚔️ Try Again
                    </button>
                    <button className="back-btn-defeat" onClick={handleBackToSelection}>
                        Back to Gyms
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

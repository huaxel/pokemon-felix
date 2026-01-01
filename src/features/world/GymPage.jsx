import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import bagIcon from '../../assets/items/bag_icon.png';
import { CardBattle } from '../battle/CardBattle';
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
    const [badges, setBadges] = useState(() => {
        const saved = localStorage.getItem('gym_badges') || '{}';
        return JSON.parse(saved);
    });

    // Save badges whenever they change
    useEffect(() => {
        localStorage.setItem('gym_badges', JSON.stringify(badges));
    }, [badges]);

    // 8 Gym Leaders
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

    const handleSelectGym = (gym) => {
        if (badges[gym.id]) {
            return; // Already beaten
        }
        setSelectedGym(gym);
        setCurrentStage(0);
        setBattleState('battle');
    };

    const handleBattleEnd = (winnerPokemon) => {
        setWinner(winnerPokemon);
        
        if (squadIds.includes(winnerPokemon.id)) {
            // Player won this stage
            if (currentStage < 1) {
                // Move to next Pokemon
                setCurrentStage(1);
                setBattleState('battle');
                setWinner(null);
            } else {
                // Won the gym!
                setBadges(prev => ({ ...prev, [selectedGym.id]: true }));
                addCoins(selectedGym.reward);
                setBattleState('victory');
            }
        } else {
            // Player lost
            setBattleState('defeat');
        }
    };

    const handleBackToSelection = () => {
        setBattleState('selection');
        setSelectedGym(null);
        setCurrentStage(0);
        setWinner(null);
    };

    // Get opponent Pokemon
    const getOpponent = () => {
        if (!selectedGym) return null;
        const opponentName = selectedGym.pokemon[currentStage];
        return pokemonList.find(p => p.name === opponentName) || pokemonList[0];
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

                <div className="badge-display">
                    <h2>Your Badges: {badgeCount}/8</h2>
                    <div className="badge-showcase">
                        {GYM_LEADERS.map(gym => (
                            <div
                                key={gym.id}
                                className={`badge-icon ${badges[gym.id] ? 'earned' : 'locked'}`}
                                style={badges[gym.id] ? { backgroundColor: gym.color } : {}}
                                title={gym.name}
                            >
                                {badges[gym.id] ? '⭐' : '🔒'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="gyms-grid">
                    {GYM_LEADERS.map(gym => (
                        <div
                            key={gym.id}
                            className={`gym-card ${badges[gym.id] ? 'beaten' : ''}`}
                            style={{ borderColor: gym.color }}
                        >
                            <div className="gym-type" style={{ color: gym.color }}>
                                {gym.type}
                            </div>
                            <h3>{gym.name}</h3>
                            <p className="gym-desc">{gym.description}</p>
                            
                            <div className="gym-rewards">
                                <span>Reward: <img src={bagIcon} alt="coins" className="coin-icon-inline" /> {gym.reward}</span>
                            </div>

                            {badges[gym.id] ? (
                                <button className="gym-btn beaten" disabled>
                                    ✅ Badge Earned!
                                </button>
                            ) : (
                                <button
                                    className="gym-btn challenge"
                                    style={{ backgroundColor: gym.color }}
                                    onClick={() => handleSelectGym(gym)}
                                >
                                    ⚔️ Challenge
                                </button>
                            )}
                        </div>
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
        const opponent = getOpponent();
        const player = getPlayerPokemon();

        return (
            <div className="gym-page battle-mode">
                <div className="battle-info">
                    <h2>{selectedGym.name}'s Gym - {selectedGym.type}</h2>
                    <div className="stage-indicator">
                        Stage {currentStage + 1} of 2
                    </div>
                </div>

                {opponent && player ? (
                    <CardBattle
                        fighter1={player}
                        fighter2={opponent}
                        onBattleEnd={handleBattleEnd}
                    />
                ) : (
                    <div className="loading">Loading battle...</div>
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
                    <button className="retry-btn" onClick={() => setBattleState('battle')}>
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

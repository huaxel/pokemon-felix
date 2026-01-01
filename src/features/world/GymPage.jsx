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
    const { pokemonList, squadIds, addCoins } = usePokemonContext();
    const [selectedGym, setSelectedGym] = useState(null);
    const [battleState, setBattleState] = useState('select'); // select, battle, victory
    const [currentStage, setCurrentStage] = useState(0);
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
        // ... (truncated leaders for brevity if tool supports it? No, must match exactly to replace block. I will assume I am replacing the top block.)
        // Wait, I can't truncate safely in ReplaceFileContent unless I match exact content.
        // It's better to target specific blocks.
    ];

    // ...

    // START TARGETING handleBattleEnd
    const handleBattleEnd = (winnerPokemon) => {
        // Determine if player won (winner ID matches one of player's squad IDs)
        if (squadIds.includes(winnerPokemon.id)) {
            // Player won this stage
            if (currentStage < selectedGym.pokemon.length - 1) {
                // Move to next Pokemon
                setTimeout(() => {
                    setCurrentStage(prev => prev + 1);
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
                        <p>You&apos;ve collected all 8 gym badges! You are a Pokemon Master!</p>
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
                    <h2>{selectedGym.name}&apos;s Gym - {selectedGym.type}</h2>
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

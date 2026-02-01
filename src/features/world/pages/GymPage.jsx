import { useState, useEffect } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { BattleArena } from '../../battle/components/BattleArena';
import { getPokemonDetails } from '../../../lib/api';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { GymCard } from '../components/GymCard';
import { GymBadgeDisplay } from '../components/GymBadgeDisplay';
import { GYM_LEADERS } from '../gymConfig';
import { grassTile, bagIcon } from '../worldAssets';
import './GymPage.css';

export function GymPage() {
    const { squadIds, addCoins } = usePokemonContext();
    const [selectedGym, setSelectedGym] = useState(null);
    const [battleState, setBattleState] = useState('select');
    const [currentStage, setCurrentStage] = useState(0);
    const [opponentPokemon, setOpponentPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('gym_badges') || '{}'));

    useEffect(() => { localStorage.setItem('gym_badges', JSON.stringify(badges)); }, [badges]);

    useEffect(() => {
        if (selectedGym && battleState === 'battle') {
            (async () => {
                setIsLoading(true);
                const details = await getPokemonDetails(selectedGym.pokemon[currentStage]);
                if (details) setOpponentPokemon(details);
                setIsLoading(false);
            })();
        }
    }, [selectedGym, currentStage, battleState]);

    const handleBattleEnd = (winnerPokemon) => {
        if (squadIds.includes(winnerPokemon.id)) {
            if (currentStage < selectedGym.pokemon.length - 1) setTimeout(() => setCurrentStage(prev => prev + 1), 1500);
            else {
                setTimeout(() => {
                    addCoins(selectedGym.reward);
                    setBadges(prev => ({ ...prev, [selectedGym.id]: true }));
                    setBattleState('victory');
                }, 1500);
            }
        } else {
            setBattleState('select'); setSelectedGym(null);
        }
    };

    const handleSelectGym = (gym) => {
        setSelectedGym(gym);
        setCurrentStage(0);
        setBattleState('battle');
    };

    if (battleState === 'battle' && selectedGym) {
        return (
            <div className="gym-page battle-view" style={{ 
                backgroundColor: '#2d1810',
                backgroundImage: `url(${grassTile})`,
                backgroundSize: '64px',
                backgroundRepeat: 'repeat',
                imageRendering: 'pixelated',
                minHeight: '100vh'
            }}>
                <div className="gym-battle-header game-panel" style={{  
                    borderColor: selectedGym.color,
                    borderWidth: '4px',
                    borderStyle: 'solid',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
                        Vechten tegen {selectedGym.name} - Fase {currentStage + 1}
                    </h2>
                </div>
                {isLoading || !opponentPokemon ? (
                    <div className="loading-gym game-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ fontFamily: '"Press Start 2P", cursive' }}>Gevecht voorbereiden...</p>
                    </div>
                ) : (
                    <BattleArena key={`${selectedGym.id}-${currentStage}`} initialFighter2={opponentPokemon} onBattleEnd={handleBattleEnd} />
                )}
            </div>
        );
    }

    if (battleState === 'victory' && selectedGym) {
        return (
            <div className="gym-victory-view" style={{ 
                backgroundColor: '#2d1810',
                backgroundImage: `url(${grassTile})`,
                backgroundSize: '64px',
                backgroundRepeat: 'repeat',
                imageRendering: 'pixelated',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="victory-card game-panel" style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px' }}>
                    <h1 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Gym van {selectedGym.name} Verslagen!
                    </h1>
                    <div className="reward-info" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Beloning: <img src={bagIcon} alt="coins" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} /> {selectedGym.reward}
                        </h2>
                    </div>
                    <button 
                        className="btn-kenney primary" 
                        onClick={() => { setBattleState('select'); setSelectedGym(null); }}
                        style={{ padding: '1rem 2rem' }}
                    >
                        Terug naar Kaart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="gym-page" style={{ 
            backgroundColor: '#2d1810',
            backgroundImage: `url(${grassTile})`,
            backgroundSize: '64px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
            minHeight: '100vh'
        }}>
            <WorldPageHeader title="Pokémon Gyms" icon="🏟️" />
            <div className="gym-content" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <GymBadgeDisplay badges={badges} gymLeaders={GYM_LEADERS} />
                <div className="gym-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {GYM_LEADERS.map(gym => <GymCard key={gym.id} gym={gym} isBeaten={badges[gym.id]} onSelect={handleSelectGym} />)}
                </div>
            </div>
        </div>
    );
}

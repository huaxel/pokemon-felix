import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { BattleArena } from '../../components/BattleArena';
import { getPokemonDetails } from '../../lib/api';
import { GymCard } from './components/GymCard';
import { GymBadgeDisplay } from './components/GymBadgeDisplay';
import { GYM_LEADERS } from './gymConfig';
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

    if (battleState === 'battle' && selectedGym) {
        return (
            <div className="gym-page battle-view">
                <div className="gym-battle-header" style={{ borderColor: selectedGym.color }}>
                    <h2>Combatting {selectedGym.name} - Etapa {currentStage + 1}</h2>
                </div>
                {isLoading || !opponentPokemon ? <div className="loading-gym">Preparando batalla...</div> : <BattleArena key={`${selectedGym.id}-${currentStage}`} initialFighter2={opponentPokemon} onBattleEnd={handleBattleEnd} />}
            </div>
        );
    }

    if (battleState === 'victory' && selectedGym) {
        return (
            <div className="gym-victory-view">
                <div className="victory-card">
                    <h1>¡Gimnasio de {selectedGym.name} Superado!</h1>
                    <div className="reward-info"><h2>Recompensa: 💰 {selectedGym.reward}</h2></div>
                    <button onClick={() => { setBattleState('select'); setSelectedGym(null); }}>Volver al Mapa</button>
                </div>
            </div>
        );
    }

    return (
        <div className="gym-page">
            <header className="gym-header"><Link to="/world" className="back-btn">← Terug</Link><h1>🏟️ Gimnasios Pokémon</h1></header>
            <GymBadgeDisplay badges={badges} gymLeaders={GYM_LEADERS} />
            <div className="gym-grid">
                {GYM_LEADERS.map(gym => <GymCard key={gym.id} gym={gym} isBeaten={badges[gym.id]} onSelect={handleSelectGym} />)}
            </div>
        </div>
    );
}

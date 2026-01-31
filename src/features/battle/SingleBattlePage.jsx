import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { BattleArena } from './components/BattleArena';
import { BattleRewardModal } from '../world/components/BattleRewardModal';
import './SingleBattlePage.css';

import { useToast } from '../../hooks/useToast'; // Correct import

export function SingleBattlePage({ allPokemon }) {
    const { squadIds, addCoins, toggleOwned, gainExperience } = usePokemonContext();
    const { addToast } = useToast();
    const location = useLocation();
    const isWild = location.state?.isWild || false;

    const [opponent, setOpponent] = useState(null);
    const [playerPokemon, setPlayerPokemon] = useState(null);
    const [battleState, setBattleState] = useState('loading'); // loading, battle, victory, defeat
    const [showReward, setShowReward] = useState(false);

    const isLegendary = location.state?.isLegendary || false;

    const startBattle = useCallback(() => {
        // Get user's first squad member (or random from squad)
        const userSquad = allPokemon.filter(p => squadIds.includes(p.id));
        const player = userSquad[0]; // Simple: use first pokemon

        // Get random opponent (excluding squad)
        // Get random opponent
        let potentialOpponents;
        if (isLegendary) {
            const LEGENDARY_IDS = [144, 145, 146, 150, 151];
            potentialOpponents = allPokemon.filter(p => LEGENDARY_IDS.includes(p.id));
        } else {
            potentialOpponents = allPokemon.filter(p => !squadIds.includes(p.id));
        }

        // Fallback if no legendaries found (shouldn't happen if data loaded)
        if (potentialOpponents.length === 0) {
            potentialOpponents = allPokemon.filter(p => !squadIds.includes(p.id));
        }

        const randomOpponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];

        if (!player || !randomOpponent) return;

        setPlayerPokemon(player);
        setOpponent(randomOpponent);
        setBattleState('battle');
    }, [allPokemon, squadIds, isLegendary]);

    useEffect(() => {
        if (allPokemon && allPokemon.length > 0 && squadIds.length > 0) {
            startBattle();
        }
    }, [allPokemon, squadIds, startBattle]);

    const handleBattleEnd = (winner) => {
        if (winner.id === playerPokemon.id) {
            if (isWild) {
                setShowReward(true);
            } else {

                setBattleState('victory');
                addCoins(50);
                const { leveledUp, newLevel } = gainExperience(playerPokemon.id, 50);
                if (leveledUp) addToast(`¡${playerPokemon.name} subió al nivel ${newLevel}!`, 'success');
            }
        } else {
            setBattleState('defeat');
        }
    };

    const handleRewardChoice = (choice) => {
        if (choice === 'pokemon') {
            toggleOwned(opponent.id);
        } else {
            addCoins(500);
        }
        setShowReward(false);
        const { leveledUp, newLevel } = gainExperience(playerPokemon.id, 50);
        if (leveledUp) addToast(`¡${playerPokemon.name} subió al nivel ${newLevel}!`, 'success');
        setBattleState('victory'); // Now show victory screen
    };
    // ... (rest of render logic is fine until return)

    if (battleState === 'loading' || !playerPokemon || !opponent) {
        return <div className="single-battle-page loading">Preparando batalla...</div>;
    }

    if (battleState === 'victory') {
        return (
            <div className="single-battle-page result victory">
                <h1>¡Victoria!</h1>
                <div className="result-card">
                    <img src={playerPokemon.sprites.other['official-artwork'].front_default} alt={playerPokemon.name} />
                    <p>¡{playerPokemon.name} ha ganado!</p>
                    <div className="reward-badge">+50 Monedas</div>
                    <div className="reward-badge exp">+50 EXP</div>
                </div>
                <div className="actions">
                    <button className="replay-btn" onClick={startBattle}>Otra Batalla</button>
                    <Link to="/adventure" className="back-btn">Volver al Mapa</Link>
                </div>
            </div>
        );
    }

    if (battleState === 'defeat') {
        return (
            <div className="single-battle-page result defeat">
                <h1>Derrota</h1>
                <div className="result-card">
                    <img src={opponent.sprites.other['official-artwork'].front_default} alt={opponent.name} />
                    <p>{opponent.name} te ha vencido.</p>
                </div>
                <div className="actions">
                    <button className="replay-btn" onClick={startBattle}>Intentar de Nuevo</button>
                    <Link to="/adventure" className="back-btn">Volver al Mapa</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="single-battle-page">
            <div className="battle-header-simple">
                <Link to="/adventure" className="close-btn">✕</Link>
            </div>
            {showReward ? (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
                    <BattleRewardModal
                        pokemon={opponent}
                        onChoice={handleRewardChoice}
                    />
                </div>
            ) : (
                <BattleArena
                    key={`${playerPokemon.id}-${opponent.id}`} // Force reset
                    initialFighter1={playerPokemon}
                    initialFighter2={opponent}
                    onBattleEnd={handleBattleEnd}
                />
            )}
        </div>
    );
}

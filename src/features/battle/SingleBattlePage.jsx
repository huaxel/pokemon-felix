import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { CardBattle } from './CardBattle';
import './SingleBattlePage.css';

export function SingleBattlePage({ allPokemon }) {
    const { squadIds, addCoins } = usePokemonContext();
    const [opponent, setOpponent] = useState(null);
    const [playerPokemon, setPlayerPokemon] = useState(null);
    const [battleState, setBattleState] = useState('loading'); // loading, battle, victory, defeat

    const startBattle = useCallback(() => {
        // Get user's first squad member (or random from squad)
        const userSquad = allPokemon.filter(p => squadIds.includes(p.id));
        const player = userSquad[0]; // Simple: use first pokemon

        // Get random opponent (excluding squad)
        const potentialOpponents = allPokemon.filter(p => !squadIds.includes(p.id));
        const randomOpponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];

        if (!player || !randomOpponent) return;

        setPlayerPokemon(player);
        setOpponent(randomOpponent);
        setBattleState('battle');
    }, [allPokemon, squadIds]);

    useEffect(() => {
        if (allPokemon && allPokemon.length > 0 && squadIds.length > 0) {
            startBattle();
        }
    }, [allPokemon, squadIds, startBattle]);

    const handleBattleEnd = (winner) => {
        if (winner.id === playerPokemon.id) {
            setBattleState('victory');
            addCoins(50);
        } else {
            setBattleState('defeat');
        }
    };

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
            <CardBattle
                fighter1={playerPokemon}
                fighter2={opponent}
                onBattleEnd={handleBattleEnd}
            />
        </div>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { TournamentBattle } from '../tournament/components/TournamentBattle';
import './GymPage.css';

export function GymPage() {
    const { pokemonList, squadIds, addCoins } = usePokemonContext();
    const [battleState, setBattleState] = useState('intro'); // intro, battle, result
    const [winner, setWinner] = useState(null);

    // Gym Leader Team (Simplified)
    // Felix selects 1 strong opponent based on average level or just a fixed legendary/strong pokemon
    const leaderTeam = [
        pokemonList.find(p => p.name === 'charizard') || pokemonList[5], // Charizard as boss
    ];

    const startBattle = () => {
        if (squadIds.length === 0) {
            alert("Je hebt Pokémon in je team nodig om de Gym te betreden!");
            return;
        }
        setBattleState('battle');
    };

    const handleBattleEnd = (winnerPokemon) => {
        setWinner(winnerPokemon);
        setBattleState('result');
        if (squadIds.includes(winnerPokemon.id)) {
            // Player won
            addCoins(1000);
        }
    };

    return (
        <div className="gym-page">
            <header className="gym-header">
                <Link to="/adventure" className="back-btn">⬅️ Terug naar Wereld</Link>
                <h1>🏆 Felix Gym</h1>
            </header>

            {battleState === 'intro' && (
                <div className="gym-intro">
                    <div className="leader-avatar">👨‍🎤</div>
                    <h2>Gym Leader: &quot;Super Felix&quot;</h2>
                    <p>Durf jij de uitdaging aan? Versla mijn sterkste Pokémon en win de gouden medaille!</p>
                    <button className="start-gym-btn" onClick={startBattle}>
                        Ik ga de uitdaging aan! ⚔️
                    </button>
                    <p className="hint">Beloning: 1000 🪙!</p>
                </div>
            )}

            {battleState === 'battle' && (
                <div className="gym-battle-container">
                    <TournamentBattle
                        fighter1={pokemonList.find(p => p.id === squadIds[0])}
                        fighter2={leaderTeam[0]}
                        onBattleEnd={handleBattleEnd}
                    />
                </div>
            )}

            {battleState === 'result' && (
                <div className="gym-result">
                    {winner && squadIds.includes(winner.id) ? (
                        <div className="win-content">
                            <span className="medal">🥇</span>
                            <h2>GEWONNEN!</h2>
                            <p>Je hebt de Gym Leader verslagen. Ik ben echt trots op je!</p>
                            <p>Hier zijn je 1000 munten. Je bent een echte kampioen!</p>
                            <Link to="/adventure" className="finish-btn">Terug als winnaar 🌍</Link>
                        </div>
                    ) : (
                        <div className="lose-content">
                            <span className="medal">😢</span>
                            <h2>Verloren...</h2>
                            <p>Niet opgeven! Train je Pokémon en probeer het nog eens.</p>
                            <Link to="/adventure" className="finish-btn">Terug naar de kaart 🌍</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

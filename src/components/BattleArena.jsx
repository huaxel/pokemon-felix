import React, { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import './BattleArena.css';

export function BattleArena({ allPokemon }) {
    const [fighter1, setFighter1] = useState(null);
    const [fighter2, setFighter2] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isBattling, setIsBattling] = useState(false);

    // Filter out incomplete pokemon data if necessary
    const validPokemon = allPokemon.filter(p => p.stats && p.types);

    const handleSelect = (pokemon) => {
        if (!fighter1) {
            setFighter1(pokemon);
        } else if (!fighter2 && pokemon.id !== fighter1.id) {
            setFighter2(pokemon);
        }
    };

    const resetBattle = () => {
        setFighter1(null);
        setFighter2(null);
        setBattleLog([]);
        setWinner(null);
        setIsBattling(false);
    };

    const startBattle = async () => {
        if (!fighter1 || !fighter2) return;
        setIsBattling(true);
        setBattleLog([]);
        setWinner(null);

        // Simple battle logic based on stats
        const p1Stats = fighter1.stats.reduce((acc, stat) => acc + stat.base_stat, 0);
        const p2Stats = fighter2.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

        // Type advantage multiplier (simplified)
        let p1Multiplier = 1;
        let p2Multiplier = 1;

        // Add log entry helper
        const addLog = (msg) => setBattleLog(prev => [...prev, msg]);

        addLog(`${fighter1.name} vs ${fighter2.name}!`);
        await new Promise(r => setTimeout(r, 1000));

        addLog("¡Comienza la batalla!");
        await new Promise(r => setTimeout(r, 1000));

        if (p1Stats > p2Stats) {
            setWinner(fighter1);
            addLog(`¡${fighter1.name} gana!`);
        } else if (p2Stats > p1Stats) {
            setWinner(fighter2);
            addLog(`¡${fighter2.name} gana!`);
        } else {
            addLog("¡Es un empate!");
        }
        setIsBattling(false);
    };

    return (
        <div className="battle-arena">
            <div className="fighters-stage">
                <div className={`fighter-slot ${winner === fighter1 ? 'winner' : ''}`}>
                    {fighter1 ? (
                        <PokemonCard pokemon={fighter1} isOwned={false} onToggleOwned={() => { }} onClick={() => setFighter1(null)} />
                    ) : (
                        <div className="empty-slot">Elige Luchador 1</div>
                    )}
                </div>
                <div className="vs-badge">VS</div>
                <div className={`fighter-slot ${winner === fighter2 ? 'winner' : ''}`}>
                    {fighter2 ? (
                        <PokemonCard pokemon={fighter2} isOwned={false} onToggleOwned={() => { }} onClick={() => setFighter2(null)} />
                    ) : (
                        <div className="empty-slot">Elige Luchador 2</div>
                    )}
                </div>
            </div>

            <div className="battle-controls">
                {!isBattling && !winner && fighter1 && fighter2 && (
                    <button className="fight-btn" onClick={startBattle}>¡PELEAR!</button>
                )}
                {(winner || (!fighter1 && !fighter2)) && (
                    <button className="reset-btn" onClick={resetBattle}>Reiniciar Arena</button>
                )}
            </div>

            {battleLog.length > 0 && (
                <div className="battle-log">
                    <h3>Registro de Batalla</h3>
                    <ul>
                        {battleLog.map((log, i) => <li key={i}>{log}</li>)}
                    </ul>
                </div>
            )}

            <div className="selection-area">
                <h3>Elige un Pokémon</h3>
                <div className="pokemon-grid-mini">
                    {validPokemon.slice(0, 10).map(p => (
                        <div key={p.id} onClick={() => handleSelect(p)} className="mini-card">
                            <img src={p.sprites.front_default} alt={p.name} />
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

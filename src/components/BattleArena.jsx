import React, { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import { getStat, calculateMaxHP, calculateDamage } from '../lib/battle-logic';
import './BattleArena.css';

export function BattleArena({ allPokemon, onLoadMore }) {
    const [fighter1, setFighter1] = useState(null);
    const [fighter2, setFighter2] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isBattling, setIsBattling] = useState(false);

    // Battle State
    const [f1HP, setF1HP] = useState(0);
    const [f2HP, setF2HP] = useState(0);
    const [f1MaxHP, setF1MaxHP] = useState(0);
    const [f2MaxHP, setF2MaxHP] = useState(0);

    // Filter out incomplete pokemon data if necessary
    const validPokemon = allPokemon.filter(p => p.stats && p.types);

    const handleSelect = (pokemon) => {
        if (!fighter1) {
            setFighter1(pokemon);
            const hp = calculateMaxHP(pokemon);
            setF1HP(hp);
            setF1MaxHP(hp);
        } else if (!fighter2 && pokemon.id !== fighter1.id) {
            setFighter2(pokemon);
            const hp = calculateMaxHP(pokemon);
            setF2HP(hp);
            setF2MaxHP(hp);
        }
    };

    const resetBattle = () => {
        setFighter1(null);
        setFighter2(null);
        setBattleLog([]);
        setWinner(null);
        setIsBattling(false);
        setF1HP(0);
        setF2HP(0);
    };

    const startBattle = async () => {
        if (!fighter1 || !fighter2) return;
        setIsBattling(true);
        setBattleLog([]);
        setWinner(null);

        const addLog = (msg) => setBattleLog(prev => [...prev, msg]);
        addLog("¡Comienza la batalla!");

        let currentF1HP = f1HP;
        let currentF2HP = f2HP;
        let turnCount = 0;
        const MAX_TURNS = 100;

        // Battle Loop
        while (currentF1HP > 0 && currentF2HP > 0 && turnCount < MAX_TURNS) {
            turnCount++;
            await new Promise(r => setTimeout(r, 1000));

            // Fighter 1 Attacks
            const damage1 = calculateDamage(fighter1, fighter2);
            currentF2HP = Math.max(0, currentF2HP - damage1);
            setF2HP(currentF2HP);
            addLog(`${fighter1.name} ataca e inflige ${damage1} de daño!`);

            if (currentF2HP <= 0) {
                setWinner(fighter1);
                addLog(`¡${fighter1.name} gana!`);
                break;
            }

            await new Promise(r => setTimeout(r, 1000));

            // Fighter 2 Attacks
            const damage2 = calculateDamage(fighter2, fighter1);
            currentF1HP = Math.max(0, currentF1HP - damage2);
            setF1HP(currentF1HP);
            addLog(`${fighter2.name} ataca e inflige ${damage2} de daño!`);

            if (currentF1HP <= 0) {
                setWinner(fighter2);
                addLog(`¡${fighter2.name} gana!`);
                break;
            }
        }

        // If max turns reached, determine winner by remaining HP percentage
        if (turnCount >= MAX_TURNS) {
            const f1Percentage = (currentF1HP / f1MaxHP) * 100;
            const f2Percentage = (currentF2HP / f2MaxHP) * 100;

            if (f1Percentage > f2Percentage) {
                setWinner(fighter1);
                addLog(`¡Batalla terminada después de ${MAX_TURNS} turnos! ${fighter1.name} gana por mayor HP restante.`);
            } else if (f2Percentage > f1Percentage) {
                setWinner(fighter2);
                addLog(`¡Batalla terminada después de ${MAX_TURNS} turnos! ${fighter2.name} gana por mayor HP restante.`);
            } else {
                addLog(`¡Batalla terminada después de ${MAX_TURNS} turnos! Es un empate.`);
            }
        }

        setIsBattling(false);
    };

    return (
        <div className="battle-arena">
            <div className="fighters-stage">
                {/* Fighter 1 */}
                <div className={`fighter-container ${winner === fighter1 ? 'winner' : ''}`}>
                    {fighter1 && (
                        <div className="health-bar-container">
                            <div className="health-bar-label">
                                <span>HP</span>
                                <span>{f1HP}/{f1MaxHP}</span>
                            </div>
                            <div className="health-bar-bg">
                                <div
                                    className="health-bar-fill"
                                    style={{
                                        width: `${(f1HP / f1MaxHP) * 100}%`,
                                        backgroundColor: f1HP < f1MaxHP * 0.2
                                            ? 'var(--health-critical)'
                                            : f1HP < f1MaxHP * 0.5
                                                ? 'var(--health-warning)'
                                                : 'var(--health-good)'
                                    }}
                                ></div>
                            </div>
                            <div className="stat-badge">ATK: {getStat(fighter1, 'attack')}</div>
                        </div>
                    )}
                    <div className="fighter-slot">
                        {fighter1 ? (
                            <PokemonCard pokemon={fighter1} isOwned={false} onToggleOwned={() => { }} onClick={() => !isBattling && setFighter1(null)} />
                        ) : (
                            <div className="empty-slot">Elige Luchador 1</div>
                        )}
                    </div>
                </div>

                <div className="vs-badge">VS</div>

                {/* Fighter 2 */}
                <div className={`fighter-container ${winner === fighter2 ? 'winner' : ''}`}>
                    {fighter2 && (
                        <div className="health-bar-container">
                            <div className="health-bar-label">
                                <span>HP</span>
                                <span>{f2HP}/{f2MaxHP}</span>
                            </div>
                            <div className="health-bar-bg">
                                <div
                                    className="health-bar-fill"
                                    style={{
                                        width: `${(f2HP / f2MaxHP) * 100}%`,
                                        backgroundColor: f2HP < f2MaxHP * 0.2
                                            ? 'var(--health-critical)'
                                            : f2HP < f2MaxHP * 0.5
                                                ? 'var(--health-warning)'
                                                : 'var(--health-good)'
                                    }}
                                ></div>
                            </div>
                            <div className="stat-badge">ATK: {getStat(fighter2, 'attack')}</div>
                        </div>
                    )}
                    <div className="fighter-slot">
                        {fighter2 ? (
                            <PokemonCard pokemon={fighter2} isOwned={false} onToggleOwned={() => { }} onClick={() => !isBattling && setFighter2(null)} />
                        ) : (
                            <div className="empty-slot">Elige Luchador 2</div>
                        )}
                    </div>
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
                    {validPokemon.map(p => (
                        <div key={p.id} onClick={() => !isBattling && handleSelect(p)} className="mini-card">
                            <img src={p.sprites.front_default} alt={p.name} />
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
                {onLoadMore && (
                    <div className="load-more-mini-container">
                        <button className="load-more-mini-btn" onClick={onLoadMore}>
                            Cargar Más
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

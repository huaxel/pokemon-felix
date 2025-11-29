import React, { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import './BattleArena.css';

export function BattleArena({ allPokemon }) {
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

    const getStat = (pokemon, statName) => {
        const stat = pokemon.stats.find(s => s.stat.name === statName);
        return stat ? stat.base_stat : 10; // Default fallback
    };

    const handleSelect = (pokemon) => {
        if (!fighter1) {
            setFighter1(pokemon);
            const hp = getStat(pokemon, 'hp') * 3; // Boost HP for longer battles
            setF1HP(hp);
            setF1MaxHP(hp);
        } else if (!fighter2 && pokemon.id !== fighter1.id) {
            setFighter2(pokemon);
            const hp = getStat(pokemon, 'hp') * 3;
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

    const attack = async (attacker, defender, setDefenderHP, defenderMaxHP, defenderName) => {
        const att = getStat(attacker, 'attack');
        const def = getStat(defender, 'defense');

        // Damage formula (simplified)
        const damage = Math.max(5, Math.floor((att * 1.5) - (def * 0.5) + (Math.random() * 10)));

        setDefenderHP(prev => Math.max(0, prev - damage));
        return damage;
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

        // Battle Loop
        while (currentF1HP > 0 && currentF2HP > 0) {
            await new Promise(r => setTimeout(r, 1000));

            // Fighter 1 Attacks
            const damage1 = await attack(fighter1, fighter2, setF2HP, f2MaxHP, fighter2.name);
            currentF2HP -= damage1;
            addLog(`${fighter1.name} ataca e inflige ${damage1} de daño!`);

            if (currentF2HP <= 0) {
                setWinner(fighter1);
                addLog(`¡${fighter1.name} gana!`);
                break;
            }

            await new Promise(r => setTimeout(r, 1000));

            // Fighter 2 Attacks
            const damage2 = await attack(fighter2, fighter1, setF1HP, f1MaxHP, fighter1.name);
            currentF1HP -= damage2;
            addLog(`${fighter2.name} ataca e inflige ${damage2} de daño!`);

            if (currentF1HP <= 0) {
                setWinner(fighter2);
                addLog(`¡${fighter2.name} gana!`);
                break;
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
                                    style={{ width: `${(f1HP / f1MaxHP) * 100}%`, backgroundColor: f1HP < f1MaxHP * 0.2 ? '#ff0000' : '#00ff00' }}
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
                                    style={{ width: `${(f2HP / f2MaxHP) * 100}%`, backgroundColor: f2HP < f2MaxHP * 0.2 ? '#ff0000' : '#00ff00' }}
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
                    {validPokemon.slice(0, 10).map(p => (
                        <div key={p.id} onClick={() => !isBattling && handleSelect(p)} className="mini-card">
                            <img src={p.sprites.front_default} alt={p.name} />
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

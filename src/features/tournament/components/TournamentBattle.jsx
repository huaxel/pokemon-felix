import React, { useState, useEffect } from 'react';
import { PokemonCard } from '../../../components/PokemonCard';
import { getStat, calculateMaxHP, calculateDamage } from '../../../lib/battle-logic';
import './TournamentBattle.css';

export function TournamentBattle({ fighter1, fighter2, onBattleEnd }) {
    const [battleLog, setBattleLog] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isBattling, setIsBattling] = useState(false);

    // Animation States
    const [attackingFighter, setAttackingFighter] = useState(null); // fighter1 or fighter2
    const [damagedFighter, setDamagedFighter] = useState(null); // fighter1 or fighter2
    const [effectivenessMsg, setEffectivenessMsg] = useState(null); // { fighter: fighter1/2, msg: "Super Effective!", type: "super-effective" }

    // Battle State
    const [f1HP, setF1HP] = useState(calculateMaxHP(fighter1));
    const [f2HP, setF2HP] = useState(calculateMaxHP(fighter2));
    const [f1MaxHP] = useState(calculateMaxHP(fighter1));
    const [f2MaxHP] = useState(calculateMaxHP(fighter2));

    const quickSim = () => {
        setIsBattling(true);
        setBattleLog([]);

        // Instant calculation
        let currentF1HP = f1HP;
        let currentF2HP = f2HP;
        const log = ["¡Simulación Rápida!"];

        while (currentF1HP > 0 && currentF2HP > 0) {
            // F1 Attack
            const res1 = calculateDamage(fighter1, fighter2);
            currentF2HP = Math.max(0, currentF2HP - res1.damage);
            log.push(`${fighter1.name} inflige ${res1.damage}`);

            if (currentF2HP <= 0) {
                setF2HP(0);
                setWinner(fighter1);
                log.push(`¡${fighter1.name} gana!`);
                setBattleLog(log);
                onBattleEnd(fighter1);
                break;
            }

            // F2 Attack
            const res2 = calculateDamage(fighter2, fighter1);
            currentF1HP = Math.max(0, currentF1HP - res2.damage);
            log.push(`${fighter2.name} inflige ${res2.damage}`);

            if (currentF1HP <= 0) {
                setF1HP(0);
                setWinner(fighter2);
                log.push(`¡${fighter2.name} gana!`);
                setBattleLog(log);
                onBattleEnd(fighter2);
                break;
            }
        }
        setIsBattling(false);
    };

    const triggerAttackAnimation = async (attacker, defender, result) => {
        // 1. Attack Animation
        setAttackingFighter(attacker);
        await new Promise(r => setTimeout(r, 300)); // Wait for lunge
        setAttackingFighter(null);

        // 2. Damage Animation & Effectiveness
        setDamagedFighter(defender);

        if (result.effectiveness > 1) {
            setEffectivenessMsg({ fighter: defender, msg: "¡Super Efectivo!", type: "super-effective" });
        } else if (result.effectiveness < 1 && result.effectiveness > 0) {
            setEffectivenessMsg({ fighter: defender, msg: "No es muy efectivo...", type: "not-very-effective" });
        }

        await new Promise(r => setTimeout(r, 400)); // Wait for shake
        setDamagedFighter(null);
        setEffectivenessMsg(null);
    };

    const startBattle = async () => {
        setIsBattling(true);
        setBattleLog([]);

        const addLog = (msg) => setBattleLog(prev => [...prev, msg]);
        addLog("¡Comienza la batalla!");

        let currentF1HP = f1HP;
        let currentF2HP = f2HP;

        // Battle Loop
        while (currentF1HP > 0 && currentF2HP > 0) {
            await new Promise(r => setTimeout(r, 1000));

            // Fighter 1 Attacks
            const res1 = calculateDamage(fighter1, fighter2);
            await triggerAttackAnimation(fighter1, fighter2, res1);

            currentF2HP = Math.max(0, currentF2HP - res1.damage);
            setF2HP(currentF2HP);
            addLog(`${fighter1.name} ataca e inflige ${res1.damage} de daño!`);

            if (currentF2HP <= 0) {
                setWinner(fighter1);
                addLog(`¡${fighter1.name} gana!`);
                setTimeout(() => onBattleEnd(fighter1), 2000);
                break;
            }

            await new Promise(r => setTimeout(r, 1000));

            // Fighter 2 Attacks
            const res2 = calculateDamage(fighter2, fighter1);
            await triggerAttackAnimation(fighter2, fighter1, res2);

            currentF1HP = Math.max(0, currentF1HP - res2.damage);
            setF1HP(currentF1HP);
            addLog(`${fighter2.name} ataca e inflige ${res2.damage} de daño!`);

            if (currentF1HP <= 0) {
                setWinner(fighter2);
                addLog(`¡${fighter2.name} gana!`);
                setTimeout(() => onBattleEnd(fighter2), 2000);
                break;
            }
        }
        setIsBattling(false);
    };

    return (
        <div className="tournament-battle">
            <div className="fighters-stage">
                {/* Fighter 1 */}
                <div className={`fighter-container ${winner === fighter1 ? 'winner' : ''} ${attackingFighter === fighter1 ? 'attacking-right' : ''} ${damagedFighter === fighter1 ? 'damaged' : ''}`}>
                    {effectivenessMsg && effectivenessMsg.fighter === fighter1 && (
                        <div className={`effectiveness-popup ${effectivenessMsg.type}`}>{effectivenessMsg.msg}</div>
                    )}
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
                    </div>
                    <div className="fighter-slot">
                        <PokemonCard pokemon={fighter1} isOwned={false} onToggleOwned={() => { }} />
                    </div>
                </div>

                <div className="vs-badge">VS</div>

                {/* Fighter 2 */}
                <div className={`fighter-container ${winner === fighter2 ? 'winner' : ''} ${attackingFighter === fighter2 ? 'attacking-left' : ''} ${damagedFighter === fighter2 ? 'damaged' : ''}`}>
                    {effectivenessMsg && effectivenessMsg.fighter === fighter2 && (
                        <div className={`effectiveness-popup ${effectivenessMsg.type}`}>{effectivenessMsg.msg}</div>
                    )}
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
                    </div>
                    <div className="fighter-slot">
                        <PokemonCard pokemon={fighter2} isOwned={false} onToggleOwned={() => { }} />
                    </div>
                </div>
            </div>

            <div className="battle-controls">
                {!isBattling && !winner && (
                    <>
                        <button className="fight-btn" onClick={startBattle}>¡PELEAR!</button>
                        <button className="quick-sim-btn" onClick={quickSim}>Simular Rápido</button>
                    </>
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
        </div>
    );
}

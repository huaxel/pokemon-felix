import React, { useState, useEffect } from 'react';
import { PokemonCard } from '../../../components/PokemonCard';
import { getStat, calculateMaxHP, calculateDamage } from '../../../lib/battle-logic';
import { getMoveDetails } from '../../../lib/api';
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

    // Moves State
    const [f1Moves, setF1Moves] = useState([]);
    const [f2Moves, setF2Moves] = useState([]);
    const [loadingMoves, setLoadingMoves] = useState(true);
    const [turn, setTurn] = useState('player'); // 'player' | 'opponent'

    // Fetch Moves on Mount
    useEffect(() => {
        const fetchMoves = async () => {
            setLoadingMoves(true);
            try {
                // Helper to get 4 random moves
                const getRandomMoves = async (pokemon) => {
                    const allMoves = pokemon.moves;
                    const selected = allMoves.sort(() => 0.5 - Math.random()).slice(0, 4);
                    const moveDetails = await Promise.all(selected.map(m => getMoveDetails(m.move.url)));
                    return moveDetails.filter(m => m !== null);
                };

                const [m1, m2] = await Promise.all([
                    getRandomMoves(fighter1),
                    getRandomMoves(fighter2)
                ]);

                setF1Moves(m1);
                setF2Moves(m2);
            } catch (error) {
                console.error("Error fetching moves", error);
            } finally {
                setLoadingMoves(false);
            }
        };
        fetchMoves();
    }, [fighter1, fighter2]);

    // Opponent Turn Logic
    useEffect(() => {
        if (turn === 'opponent' && !winner && f2Moves.length > 0) {
            const timer = setTimeout(async () => {
                // Pick random move
                const move = f2Moves[Math.floor(Math.random() * f2Moves.length)];
                await executeTurn(fighter2, fighter1, move, setF1HP, setTurn);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [turn, winner, f2Moves]);

    const executeTurn = async (attacker, defender, move, setDefenderHP, setNextTurn) => {
        const res = calculateDamage(attacker, defender, move);

        // Log
        setBattleLog(prev => [...prev, `${attacker.name} usa ${move.name}!`]);

        // Animate
        await triggerAttackAnimation(attacker, defender, res);

        // Apply Damage
        setDefenderHP(prev => {
            const newHP = Math.max(0, prev - res.damage);
            if (newHP <= 0) {
                setWinner(attacker);
                setBattleLog(prev => [...prev, `¡${attacker.name} gana!`]);
                setTimeout(() => onBattleEnd(attacker), 2000);
            }
            return newHP;
        });

        // Switch Turn (if no winner)
        if (defender === fighter1 ? (f1HP - res.damage > 0) : (f2HP - res.damage > 0)) {
            setNextTurn(attacker === fighter1 ? 'opponent' : 'player');
        }
    };

    const handleMoveClick = async (move) => {
        if (turn !== 'player' || winner) return;
        await executeTurn(fighter1, fighter2, move, setF2HP, setTurn);
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
                {loadingMoves ? (
                    <div className="loading-moves">Cargando movimientos...</div>
                ) : (
                    <div className="moves-grid">
                        {f1Moves.map((move, i) => (
                            <button
                                key={i}
                                className={`move-btn type-${move.type}`}
                                onClick={() => handleMoveClick(move)}
                                disabled={turn !== 'player' || !!winner}
                            >
                                <span className="move-name">{move.name}</span>
                                <span className="move-details">{move.type} | Pwr: {move.power}</span>
                            </button>
                        ))}
                    </div>
                )}
                {turn === 'opponent' && !winner && <div className="turn-indicator">Turno del Oponente...</div>}
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

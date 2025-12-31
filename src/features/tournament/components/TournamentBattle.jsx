import { useState, useEffect, useCallback } from 'react';
import { calculateMaxHP, calculateDamage, calculateEnergyCost } from '../../../lib/battle-logic';
import { getMoveDetails } from '../../../lib/api';
import './TournamentBattle.css';
import energyIcon from '../../../assets/icons/energy.svg';

export function TournamentBattle({ fighter1, fighter2, onBattleEnd }) {
    const [battleLog, setBattleLog] = useState([]);
    const [winner, setWinner] = useState(null);


    // Animation States
    const [attackingFighter, setAttackingFighter] = useState(null); // fighter1 or fighter2
    const [damagedFighter, setDamagedFighter] = useState(null); // fighter1 or fighter2
    const [effectivenessMsg, setEffectivenessMsg] = useState(null); // { fighter: fighter1/2, msg: "Super Effective!", type: "super-effective" }

    // Battle State
    const [f1HP, setF1HP] = useState(calculateMaxHP(fighter1));
    const [f2HP, setF2HP] = useState(calculateMaxHP(fighter2));
    const [f1MaxHP] = useState(calculateMaxHP(fighter1));
    const [f2MaxHP] = useState(calculateMaxHP(fighter2));

    // Energy State (TCG Style)
    const [f1Energy, setF1Energy] = useState(2); // Start with 2 Energy
    const [f2Energy, setF2Energy] = useState(2);
    const MAX_ENERGY = 5;

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
                    return moveDetails.filter(m => m !== null).map(m => {
                        // Calculate base damage and cost for UI
                        const { baseDamage } = calculateDamage(pokemon, pokemon, m); // Mock call for base stats
                        const cost = calculateEnergyCost(baseDamage);
                        return { ...m, baseDamage, cost };
                    });
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
                // AI Logic: Filter moves we can afford
                const affordableMoves = f2Moves.filter(m => m.cost <= f2Energy);

                if (affordableMoves.length > 0 && Math.random() > 0.2) {
                    // 80% chance to attack if possible
                    const move = affordableMoves[Math.floor(Math.random() * affordableMoves.length)];
                    await executeTurn(fighter2, fighter1, move, setF1HP, setTurn, setF2Energy, f2Energy);
                } else {
                    // Reload if no energy or random chance
                    await handleReload(fighter2, setF2Energy, setTurn);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [turn, winner, f2Moves, f2Energy, executeTurn, fighter1, fighter2, handleReload]);

    const triggerAttackAnimation = useCallback(async (attacker, defender, result) => {
        // 1. Attack Animation
        setAttackingFighter(attacker);
        await new Promise(r => setTimeout(r, 300)); // Wait for lunge
        setAttackingFighter(null);

        // 2. Damage Animation & Effectiveness
        setDamagedFighter(defender);

        if (result.effectiveness > 1) {
            setEffectivenessMsg({ fighter: defender, msg: "¡Super Efectivo! +1 Dmg", type: "super-effective" });
        } else if (result.effectiveness < 1 && result.effectiveness > 0) {
            setEffectivenessMsg({ fighter: defender, msg: "No es muy efectivo... -1 Dmg", type: "not-very-effective" });
        }

        await new Promise(r => setTimeout(r, 400)); // Wait for shake
        setDamagedFighter(null);
        setEffectivenessMsg(null);
    }, []);

    const executeTurn = useCallback(async (attacker, defender, move, setDefenderHP, setNextTurn, setAttackerEnergy) => {
        // Deduct Energy
        setAttackerEnergy(prev => Math.max(0, prev - move.cost));

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
    }, [f1HP, f2HP, fighter1, onBattleEnd, triggerAttackAnimation]);

    const handleReload = useCallback(async (fighter, setEnergy, setNextTurn) => {
        setBattleLog(prev => [...prev, `${fighter.name} recarga energía!`]);

        // Animation placeholder (could be a glow effect)
        await new Promise(r => setTimeout(r, 800));

        setEnergy(prev => Math.min(MAX_ENERGY, prev + 2));
        setNextTurn(fighter === fighter1 ? 'opponent' : 'player');
    }, [fighter1]);

    const handleMoveClick = async (move) => {
        if (turn !== 'player' || winner) return;
        if (f1Energy < move.cost) return; // Should be disabled in UI, but safety check
        await executeTurn(fighter1, fighter2, move, setF2HP, setTurn, setF1Energy, f1Energy);
    };

    const handlePlayerReload = async () => {
        if (turn !== 'player' || winner) return;
        await handleReload(fighter1, setF1Energy, setTurn);
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
                            <span>{fighter1.name}</span>
                            <span>{f1HP}/{f1MaxHP} HP</span>
                        </div>
                        <div className="health-bar-bg">
                            <div
                                className="health-bar-fill"
                                style={{ width: `${(f1HP / f1MaxHP) * 100}%`, backgroundColor: f1HP < f1MaxHP * 0.2 ? '#ff0000' : '#00ff00' }}
                            ></div>
                        </div>
                        <div className="energy-bar">
                            {[...Array(MAX_ENERGY)].map((_, i) => (
                                <img key={i} src={energyIcon} alt="energy" className={`energy-pip ${i < f1Energy ? 'filled' : ''}`} />
                            ))}
                        </div>
                    </div>
                    <div className="fighter-slot">
                        <img src={fighter1.sprites.front_default} alt={fighter1.name} className="fighter-sprite" />
                    </div>
                </div>

                {/* VS Badge */}
                {!winner && <div className="vs-badge">VS</div>}

                {/* Fighter 2 */}
                <div className={`fighter-container ${winner === fighter2 ? 'winner' : ''} ${attackingFighter === fighter2 ? 'attacking-left' : ''} ${damagedFighter === fighter2 ? 'damaged' : ''}`}>
                    {effectivenessMsg && effectivenessMsg.fighter === fighter2 && (
                        <div className={`effectiveness-popup ${effectivenessMsg.type}`}>{effectivenessMsg.msg}</div>
                    )}
                    <div className="health-bar-container">
                        <div className="health-bar-label">
                            <span>{fighter2.name}</span>
                            <span>{f2HP}/{f2MaxHP} HP</span>
                        </div>
                        <div className="health-bar-bg">
                            <div
                                className="health-bar-fill"
                                style={{ width: `${(f2HP / f2MaxHP) * 100}%`, backgroundColor: f2HP < f2MaxHP * 0.2 ? '#ff0000' : '#00ff00' }}
                            ></div>
                        </div>
                        <div className="energy-bar">
                            {[...Array(MAX_ENERGY)].map((_, i) => (
                                <img key={i} src={energyIcon} alt="energy" className={`energy-pip ${i < f2Energy ? 'filled' : ''}`} />
                            ))}
                        </div>
                    </div>
                    <div className="fighter-slot">
                        <img src={fighter2.sprites.front_default} alt={fighter2.name} className="fighter-sprite" />
                    </div>
                </div>
            </div>

            <div className="battle-controls">
                {loadingMoves ? (
                    <div className="loading-moves">Cargando movimientos...</div>
                ) : (
                    <>
                        {turn === 'player' && !winner && (
                            <div className="your-turn-banner">¡TU TURNO!</div>
                        )}
                        <div className={`moves-grid ${turn === 'player' ? 'active-turn' : ''}`}>
                            {f1Moves.map((move, i) => (
                                <button
                                    key={i}
                                    className={`move-btn type-${move.type}`}
                                    onClick={() => handleMoveClick(move)}
                                    disabled={turn !== 'player' || !!winner || f1Energy < move.cost}
                                >
                                    <span className="move-name">{move.name}</span>
                                    <div className="move-stats">
                                        <div className="move-stat dmg">
                                            <strong>DMG</strong> {move.baseDamage}
                                        </div>
                                        <div className="move-stat cost">
                                            <strong>ENG</strong> {move.cost}
                                        </div>
                                    </div>
                                    <span className="move-type-badge">{move.type}</span>
                                </button>
                            ))}
                            <button
                                className="reload-btn"
                                onClick={handlePlayerReload}
                                disabled={turn !== 'player' || !!winner || f1Energy >= MAX_ENERGY}
                            >
                                <span className="reload-icon"><img src={energyIcon} alt="reload" className="reload-energy-icon" /></span>
                                <span className="reload-text">RECARGAR (+2)</span>
                            </button>
                        </div>
                    </>
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

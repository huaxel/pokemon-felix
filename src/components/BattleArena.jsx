import { useState, useEffect } from 'react';
import { usePokemonContext } from '../hooks/usePokemonContext';
import { PokemonCard } from './PokemonCard';
import { getStat, calculateMaxHP, calculateSmartDamage, getMoves, getTypeColor } from '../lib/battle-logic';
import './BattleArena.css';

export function BattleArena({ allPokemon, onLoadMore, initialFighter1, initialFighter2, onBattleEnd }) {
    const { addCoins, squadIds } = usePokemonContext();
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
    const [turn, setTurn] = useState('player'); // 'player' or 'enemy'
    const [f1Moves, setF1Moves] = useState([]);

    // Animations
    const [shake, setShake] = useState(null); // 'f1' or 'f2'
    const [flash, setFlash] = useState(null); // 'f1' or 'f2'

    // Filter out incomplete pokemon data if necessary
    // AND filter by Squad IDs if allPokemon is provided
    const validPokemon = allPokemon ? allPokemon.filter(p => p.stats && p.types && squadIds.includes(p.id)) : [];

    // Initialize fighters from props
    useEffect(() => {
        if (initialFighter1 && !fighter1) {
            initializeFighter(initialFighter1, 1);
        }
        if (initialFighter2 && !fighter2) {
            initializeFighter(initialFighter2, 2);
        }
        // If both are present, auto-start? Maybe wait for user.
        // If it's a gym battle, we probably want to start immediately or show VS screen.
    }, [initialFighter1, initialFighter2]);

    const initializeFighter = (pokemon, slot) => {
        const hp = calculateMaxHP(pokemon);
        if (slot === 1) {
            setFighter1(pokemon);
            setF1HP(hp);
            setF1MaxHP(hp);
            setF1Moves(getMoves(pokemon));
        } else {
            setFighter2(pokemon);
            setF2HP(hp);
            setF2MaxHP(hp);
        }
    };

    const handleSelect = (pokemon) => {
        if (!fighter1) {
            initializeFighter(pokemon, 1);
        } else if (!fighter2 && pokemon.id !== fighter1.id) {
            initializeFighter(pokemon, 2);
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
        setTurn('player');
    };

    const addLog = (msg) => setBattleLog(prev => [msg, ...prev]);

    const startBattle = () => {
        if (!fighter1 || !fighter2) return;
        setIsBattling(true);
        setBattleLog([]);
        setWinner(null);
        setTurn('player'); // Player always starts? Or speed based? Let's say Player for now.
        addLog("¡La batalla ha comenzado! Tu turno.");
    };

    const handlePlayerAttack = async (move) => {
        if (turn !== 'player' || !isBattling) return;

        // Player attacks Fighter 2
        setShake('f2');
        setFlash('f2');
        setTimeout(() => { setShake(null); setFlash(null); }, 500);

        const { damage, effectiveness, message, isCrit } = calculateSmartDamage(fighter1, fighter2, move, null, 0);

        // Log Logic
        let logMsg = `${fighter1.name} usó ${move.name}!`;
        if (effectiveness > 1) logMsg += " ¡Es muy eficaz!";
        if (effectiveness < 1 && effectiveness > 0) logMsg += " No es muy eficaz...";
        if (isCrit) logMsg += " ¡GOLPE CRÍTICO!";
        addLog(logMsg);

        if (message) addLog(message);

        // Apply Damage
        const newHP = Math.max(0, f2HP - damage);
        setF2HP(newHP);

        // Check Win
        if (newHP <= 0) {
            setWinner(fighter1);
            addCoins(50);
            addLog(`¡${fighter1.name} ganó! (+50 monedas)`);
            setIsBattling(false);
            return;
        }

        // Switch to Enemy Turn
        setTurn('enemy');
    };

    // Enemy Turn Logic
    useEffect(() => {
        if (isBattling && turn === 'enemy' && !winner) {
            const enemyTurn = async () => {
                await new Promise(r => setTimeout(r, 1500)); // Wait 1.5s for realism

                if (!fighter2 || !fighter1) return;

                // Pick random move
                const moves = getMoves(fighter2);
                const move = moves[Math.floor(Math.random() * moves.length)];

                // Animation on Player
                setShake('f1');
                setFlash('f1');
                setTimeout(() => { setShake(null); setFlash(null); }, 500);

                const { damage, effectiveness, isCrit } = calculateSmartDamage(fighter2, fighter1, move, null, 0);

                let logMsg = `Enemigo ${fighter2.name} usó ${move.name}!`;
                if (effectiveness > 1) logMsg += " ¡Es muy eficaz!";
                if (isCrit) logMsg += " ¡GOLPE CRÍTICO!";
                addLog(logMsg);

                const newHP = Math.max(0, f1HP - damage);
                setF1HP(newHP);

                if (newHP <= 0) {
                    setWinner(fighter2);
                    addLog(`¡${fighter2.name} ganó!`);
                    setIsBattling(false);
                } else {
                    setTurn('player');
                    addLog(`¡Tu turno! ¿Qué hará ${fighter1.name}?`);
                }
            };
            enemyTurn();
        }
    }, [turn, isBattling, winner, fighter2, fighter1, f1HP]);

    return (
        <div className="battle-arena" style={{ backgroundImage: 'url(/src/assets/buildings/gym_building.png)' }}>
            <div className="fighters-stage">
                {/* Fighter 1 (PLAYER) */}
                <div className={`fighter-container ${winner === fighter1 ? 'winner' : ''} ${shake === 'f1' ? 'shake' : ''}`}>
                    {fighter1 && (
                        <div className="health-bar-container">
                            <div className="health-bar-label">
                                <span>{fighter1.name}</span>
                                <span>{f1HP}/{f1MaxHP}</span>
                            </div>
                            <div className="health-bar-bg">
                                <div
                                    className="health-bar-fill"
                                    style={{
                                        width: `${(f1HP / f1MaxHP) * 100}%`,
                                        backgroundColor: f1HP < f1MaxHP * 0.2 ? 'var(--health-critical)' : 'var(--health-good)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}
                    <div className="fighter-slot">
                        {fighter1 ? (
                            <div className={`fighter-sprite-container ${flash === 'f1' ? 'flash-red' : ''}`}>
                                <img src={fighter1.sprites.back_default || fighter1.sprites.front_default} alt={fighter1.name} className="fighter-sprite-lg" />
                            </div>
                        ) : (
                            <div className="empty-slot">Tu Luchador</div>
                        )}
                    </div>
                </div>

                {/* VS / ACTIONS */}
                <div className="center-stage">
                    {isBattling ? (
                        <div className="turn-indicator">
                            {turn === 'player' ? '👉 Tu Turno' : '⏳ Enemigo pensando...'}
                        </div>
                    ) : (
                        <div className="vs-badge">VS</div>
                    )}
                </div>

                {/* Fighter 2 (ENEMY) */}
                <div className={`fighter-container ${winner === fighter2 ? 'winner' : ''} ${shake === 'f2' ? 'shake' : ''}`}>
                    {fighter2 && (
                        <div className="health-bar-container">
                            <div className="health-bar-label">
                                <span>{fighter2.name}</span>
                                <span>{f2HP}/{f2MaxHP}</span>
                            </div>
                            <div className="health-bar-bg">
                                <div
                                    className="health-bar-fill"
                                    style={{
                                        width: `${(f2HP / f2MaxHP) * 100}%`,
                                        backgroundColor: f2HP < f2MaxHP * 0.2 ? 'var(--health-critical)' : 'var(--health-good)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}
                    <div className="fighter-slot">
                        {fighter2 ? (
                            <div className={`fighter-sprite-container ${flash === 'f2' ? 'flash-red' : ''}`}>
                                <img src={fighter2.sprites.front_default} alt={fighter2.name} className="fighter-sprite-lg" />
                            </div>
                        ) : (
                            <div className="empty-slot">Rival</div>
                        )}
                    </div>
                </div>
            </div>

            {/* BATTLE CONTROLS */}
            <div className="battle-controls-area">
                {!isBattling && !winner && fighter1 && fighter2 && (
                    <button className="fight-btn-lg" onClick={startBattle}>¡COMENZAR!</button>
                )}

                {(winner || (!fighter1 && !fighter2)) && (
                    <button className="reset-btn" onClick={resetBattle}>Nueva Batalla</button>
                )}

                {/* Attack Menu */}
                {isBattling && !winner && (
                    <div className={`attack-menu ${turn !== 'player' ? 'disabled' : ''}`}>
                        <h3>Elige un Ataque:</h3>
                        <div className="moves-grid">
                            {f1Moves.map((move, i) => (
                                <button
                                    key={i}
                                    className="move-btn"
                                    onClick={() => handlePlayerAttack(move)}
                                    disabled={turn !== 'player'}
                                    style={{ borderColor: getTypeColor(move.type) }}
                                >
                                    <span className="move-name">{move.name}</span>
                                    <span className="move-type" style={{ backgroundColor: getTypeColor(move.type) }}>{move.type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* LOG */}
            <div className="battle-log">
                {battleLog.slice(0, 3).map((log, i) => <div key={i} className="log-entry">{log}</div>)}
            </div>

            {/* SELECTION (Only when not battling) */}
            {!isBattling && (
                <div className="selection-area">
                    <h3>Elige tu Pokémon</h3>
                    <div className="pokemon-grid-mini">
                        {validPokemon.length === 0 && (
                            <p>¡Tu equipo está vacío!</p>
                        )}
                        {validPokemon.map(p => (
                            <div key={p.id} onClick={() => handleSelect(p)} className="mini-card">
                                <img src={p.sprites.front_default} alt={p.name} />
                                <span>{p.name}</span>
                            </div>
                        ))}
                    </div>
                    {onLoadMore && <button className="load-more" onClick={onLoadMore}>Más</button>}
                </div>
            )}
        </div>
    );
}

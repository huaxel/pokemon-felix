import { useState, useEffect, useCallback, useReducer } from 'react';
import { calculateMaxHP, calculateEnergyCost, calculateSmartDamage, getTypeColor } from '../../lib/battle-logic';
import { getMoveDetails, getPokemonDetails } from '../../lib/api';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { useCareContext } from '../../hooks/useCareContext';
import { STORAGE_KEYS } from '../../lib/constants';
import { battleReducer, createInitialBattleState, BATTLE_ACTIONS } from '../../lib/battleReducer';
import { HPBar } from '../../components/HPBar';
import './CardBattle.css';

/**
 * CardBattle - TCG-style Pokémon battle with energy system, card hand, and AI opponent
 * Uses useReducer for proper state management and to prevent race conditions
 */
export function CardBattle({ fighter1, fighter2, onBattleEnd }) {
    const { inventory, removeItem, toggleOwned, addCoins } = usePokemonContext();
    const { careStats, addFatigue } = useCareContext();

    // Outfit bonus
    const outfitId = localStorage.getItem(STORAGE_KEYS.CURRENT_OUTFIT) || 'default';

    // Initialize battle state with reducer
    const [battleState, dispatch] = useReducer(
        battleReducer,
        { fighter1, fighter2 },
        (init) => createInitialBattleState(init.fighter1, init.fighter2, outfitId)
    );

    // UI state (not part of battle logic)
    const [showItems, setShowItems] = useState(false);
    const [hand, setHand] = useState([]);
    const [deck, setDeck] = useState([]);
    const [f2Moves, setF2Moves] = useState([]);
    const [loadingMoves, setLoadingMoves] = useState(true);

    // Derived values from battle state
    const f1HP = battleState.fighters.player.hp;
    const f2HP = battleState.fighters.opponent.hp;
    const f1MaxHP = battleState.fighters.player.maxHP;
    const f2MaxHP = battleState.fighters.opponent.maxHP;
    const f1Energy = battleState.fighters.player.energy;
    const f2Energy = battleState.fighters.opponent.energy;
    const turn = battleState.turn;
    const winner = battleState.winner;
    const battleLog = battleState.battleLog;

    // Initialize moves once
    useEffect(() => {
        const initBattle = async () => {
            setLoadingMoves(true);
            try {
                // Fetch full pokemon details
                const ensureDetails = async (pokemon) => {
                    if (pokemon.moves && pokemon.stats) return pokemon;
                    return await getPokemonDetails(pokemon.name);
                };

                const [p1Full, p2Full] = await Promise.all([
                    ensureDetails(fighter1),
                    ensureDetails(fighter2)
                ]);

                // Fetch moves
                const fetchMoves = async (pokemon) => {
                    if (!pokemon.moves) return [];
                    const limitedMoves = pokemon.moves.slice(0, 10);
                    const details = await Promise.all(limitedMoves.map(m => getMoveDetails(m.move.url)));
                    return details.filter(m => m !== null).map(m => ({
                        ...m,
                        baseDamage: m.power ? Math.floor(m.power / 20) + 1 : 1,
                        cost: calculateEnergyCost(m.power ? Math.floor(m.power / 20) + 1 : 1),
                        id: `${m.id}_${Math.random()}` // Unique ID for this battle
                    }));
                };

                const [p1Moves, p2Moves] = await Promise.all([
                    fetchMoves(p1Full),
                    fetchMoves(p2Full)
                ]);

                setDeck(p1Moves);
                setF2Moves(p2Moves);

                // Draw initial hand
                const initialHand = [];
                for (let i = 0; i < 4 && i < p1Moves.length; i++) {
                    initialHand.push(p1Moves[i]);
                }
                setHand(initialHand);

                // Record initial state
                dispatch({
                    type: BATTLE_ACTIONS.ADD_TO_LOG,
                    message: `⚔️ ${fighter1.name} vs ${fighter2.name} - Battle Start!`
                });

                setLoadingMoves(false);
            } catch (error) {
                console.error('Battle init error:', error);
                setLoadingMoves(false);
            }
        };

        initBattle();
    }, [fighter1, fighter2]);

    // Passive energy regen when it's the player's turn (prevents being stuck at 0)
    useEffect(() => {
        if (turn === 'player' && !winner) {
            dispatch({ type: BATTLE_ACTIONS.ADD_ENERGY, fighter: 'player', amount: 1 });
        }
    }, [turn, winner]);

    /**
     * Execute a player attack
     */
    const executeTurn = useCallback(async (selectedMove) => {
        if (turn !== 'player' || winner) return;

        // Validation
        if (f1Energy < selectedMove.cost) {
            dispatch({
                type: BATTLE_ACTIONS.ADD_TO_LOG,
                message: '⚡ Not enough energy!'
            });
            return;
        }

        // Spend energy
        dispatch({
            type: BATTLE_ACTIONS.SPEND_ENERGY,
            fighter: 'player',
            amount: selectedMove.cost
        });

        // Calculate damage (structured result)
        const dmgResult = calculateSmartDamage(fighter1, fighter2, selectedMove, battleState.lastMoveName);
        const damage = dmgResult.damage;

        // Animate attack
        dispatch({
            type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER,
            fighter: fighter1
        });

        await new Promise(r => setTimeout(r, 300));

        dispatch({
            type: BATTLE_ACTIONS.SET_DAMAGED_FIGHTER,
            fighter: fighter2
        });

        // Apply damage
        const newF2HP = Math.max(0, f2HP - damage);
        dispatch({
            type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
            fighter: 'opponent',
            hp: newF2HP
        });

        // Check win condition
        if (newF2HP === 0) {
            dispatch({
                type: BATTLE_ACTIONS.SET_WINNER,
                winner: fighter1
            });
            dispatch({
                type: BATTLE_ACTIONS.ADD_TO_LOG,
                message: `🎉 ${fighter1.name} wins! +100 coins`
            });
            addCoins(100);
            setTimeout(() => onBattleEnd(fighter1), 2000);
            return;
        }

        dispatch({
            type: BATTLE_ACTIONS.ADD_TO_LOG,
            message: `${fighter1.name} used ${selectedMove.name} - ${damage} dmg${dmgResult.message ? ` (${dmgResult.message})` : ''}`
        });

        dispatch({
            type: BATTLE_ACTIONS.SET_LAST_MOVE,
            moveName: selectedMove.name
        });

        // Clear animation
        await new Promise(r => setTimeout(r, 400));
        dispatch({ type: BATTLE_ACTIONS.CLEAR_ANIMATIONS });

        // Switch turn to opponent
        dispatch({
            type: BATTLE_ACTIONS.SET_TURN,
            turn: 'opponent'
        });

    }, [turn, winner, f1Energy, f2HP, fighter1, fighter2, addCoins, onBattleEnd, battleState.lastMoveName]);

    /**
     * Handle item usage
     */
    const handleUseItem = useCallback(async (itemId) => {
        if (turn !== 'player' || winner) return;

        if (itemId === 'potion') {
            if (removeItem('potion')) {
                const healed = Math.min(5, f1MaxHP - f1HP);
                dispatch({
                    type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP,
                    fighter: 'player',
                    hp: f1HP + healed
                });
                dispatch({
                    type: BATTLE_ACTIONS.ADD_TO_LOG,
                    message: `🧪 Used Potion! +${healed} HP`
                });
                setShowItems(false);
                dispatch({
                    type: BATTLE_ACTIONS.SET_TURN,
                    turn: 'opponent'
                });
            }
        } else if (itemId.includes('ball')) {
            if (removeItem(itemId)) {
                dispatch({
                    type: BATTLE_ACTIONS.ADD_TO_LOG,
                    message: `🚀 Threw a ${itemId}!`
                });
                setShowItems(false);

                const catchRate = itemId === 'masterball' ? 1.0
                    : itemId === 'ultraball' ? 0.6
                        : itemId === 'greatball' ? 0.4
                            : 0.2;

                const success = Math.random() < catchRate;

                if (success) {
                    dispatch({
                        type: BATTLE_ACTIONS.ADD_TO_LOG,
                        message: "✨ GOTCHA! Pokémon was caught!"
                    });
                    toggleOwned(fighter2.id);
                    setTimeout(() => onBattleEnd(fighter1), 2000);
                } else {
                    dispatch({
                        type: BATTLE_ACTIONS.ADD_TO_LOG,
                        message: "💨 Oh no! It broke free!"
                    });
                    dispatch({
                        type: BATTLE_ACTIONS.SET_TURN,
                        turn: 'opponent'
                    });
                }
            }
        }
    }, [turn, winner, f1HP, f1MaxHP, fighter2, removeItem, toggleOwned, onBattleEnd]);

    /**
     * AI opponent turn
     */
    useEffect(() => {
        if (turn !== 'opponent' || winner) return;

        const takeOpponentTurn = async () => {
            // If moves are missing, just pass and recharge so the fight continues
            if (loadingMoves || f2Moves.length === 0) {
                dispatch({ type: BATTLE_ACTIONS.ADD_ENERGY, fighter: 'opponent', amount: 1 });
                dispatch({ type: BATTLE_ACTIONS.ADD_TO_LOG, message: `${fighter2?.name || 'Opponent'} is waiting...` });
            } else {
                // Regenerate energy
                dispatch({ type: BATTLE_ACTIONS.ADD_ENERGY, fighter: 'opponent', amount: 1 });

                // Choose best affordable move
                const affordable = f2Moves.filter(m => m.cost <= f2Energy + 1);

                if (affordable.length > 0) {
                    const move = affordable[Math.floor(Math.random() * affordable.length)];

                    // Spend and attack
                    dispatch({ type: BATTLE_ACTIONS.SPEND_ENERGY, fighter: 'opponent', amount: move.cost });

                    const dmgResult = calculateSmartDamage(fighter2, fighter1, move, battleState.lastMoveName);
                    const damage = dmgResult.damage;

                    dispatch({ type: BATTLE_ACTIONS.SET_ATTACKING_FIGHTER, fighter: fighter2 });
                    await new Promise(r => setTimeout(r, 300));
                    dispatch({ type: BATTLE_ACTIONS.SET_DAMAGED_FIGHTER, fighter: fighter1 });

                    const newF1HP = Math.max(0, f1HP - damage);
                    dispatch({ type: BATTLE_ACTIONS.UPDATE_FIGHTER_HP, fighter: 'player', hp: newF1HP });

                    if (newF1HP === 0) {
                        dispatch({ type: BATTLE_ACTIONS.SET_WINNER, winner: fighter2 });
                        dispatch({ type: BATTLE_ACTIONS.ADD_TO_LOG, message: `💔 ${fighter2.name} wins!` });
                        setTimeout(() => onBattleEnd(fighter2), 2000);
                        return;
                    }

                    dispatch({
                        type: BATTLE_ACTIONS.ADD_TO_LOG,
                        message: `${fighter2.name} used ${move.name} - ${damage} dmg${dmgResult.message ? ` (${dmgResult.message})` : ''}`
                    });

                    dispatch({ type: BATTLE_ACTIONS.SET_LAST_MOVE, moveName: move.name });

                    await new Promise(r => setTimeout(r, 400));
                    dispatch({ type: BATTLE_ACTIONS.CLEAR_ANIMATIONS });
                } else {
                    // Recharge and pass
                    dispatch({ type: BATTLE_ACTIONS.ADD_ENERGY, fighter: 'opponent', amount: 1 });
                    dispatch({ type: BATTLE_ACTIONS.ADD_TO_LOG, message: `${fighter2.name} is recharging...` });
                }
            }

            // Regenerate player energy every time opponent turn ends
            dispatch({ type: BATTLE_ACTIONS.ADD_ENERGY, fighter: 'player', amount: 2 });

            // Draw card if hand is small
            if (hand.length < 4 && deck.length > 0) {
                const newCard = deck[Math.floor(Math.random() * deck.length)];
                setHand(prev => [...prev, newCard]);
            }

            dispatch({ type: BATTLE_ACTIONS.SET_TURN, turn: 'player' });
        };

        const aiTimer = setTimeout(takeOpponentTurn, 800);
        return () => clearTimeout(aiTimer);
    }, [turn, winner, f2Moves, f2Energy, f1HP, fighter1, fighter2, hand.length, deck.length, loadingMoves, battleState.lastMoveName]);

    if (loadingMoves) {
        return <div className="card-battle-arena"><p>Loading battle...</p></div>;
    }

    return (
        <div className="card-battle-arena">
            {/* Battle Log */}
            <div className="battle-log-overlay">
                <div className="log-entries">
                    {battleLog.slice(0, 3).map((msg, i) => (
                        <div key={i} className="log-entry">{msg}</div>
                    ))}
                </div>
            </div>

            <div className="battle-stage">
                {/* Opponent */}
                <div className="battle-field opponent-side">
                    <div className="fighter-card">
                        {fighter2 && (
                            <>
                                <img className="battle-sprite" src={fighter2.sprites?.front_default} alt={fighter2.name} />
                                <h3 className="fighter-name">{fighter2.name}</h3>
                                <HPBar current={f2HP} max={f2MaxHP} />
                            </>
                        )}
                    </div>
                </div>

                {/* Player */}
                <div className="battle-field player-side">
                    <div className="fighter-card">
                        {fighter1 && (
                            <>
                                <img className="battle-sprite" src={fighter1.sprites?.front_default} alt={fighter1.name} />
                                <h3 className="fighter-name">{fighter1.name}</h3>
                                <HPBar current={f1HP} max={f1MaxHP} />
                                <div className="energy-display">
                                    <span>⚡ {f1Energy}/{5}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Hand */}
            <div className="card-hand">
                {hand.map((card, idx) => (
                    <button
                        key={card.id}
                        className={`card ${f1Energy < card.cost ? 'disabled' : ''}`}
                        onClick={() => executeTurn(card)}
                        disabled={turn !== 'player' || f1Energy < card.cost || winner}
                    >
                        <div className="card-name">{card.name}</div>
                        <div className="card-damage">{card.baseDamage} dmg</div>
                        <div className="card-cost">⚡ {card.cost}</div>
                    </button>
                ))}
            </div>

            {/* Action Buttons */}
            {turn === 'player' && !winner && (
                <button
                    className="items-btn"
                    onClick={() => setShowItems(!showItems)}
                >
                    Items {Object.keys(inventory).length > 0 ? '✓' : ''}
                </button>
            )}

            {showItems && (
                <div className="items-menu">
                    {inventory.potion > 0 && (
                        <button onClick={() => handleUseItem('potion')}>
                            🧪 Potion x{inventory.potion}
                        </button>
                    )}
                    {inventory.pokeball > 0 && (
                        <button onClick={() => handleUseItem('pokeball')}>
                            🔴 Pokéball x{inventory.pokeball}
                        </button>
                    )}
                    {inventory.greatball > 0 && (
                        <button onClick={() => handleUseItem('greatball')}>
                            🔵 Great Ball x{inventory.greatball}
                        </button>
                    )}
                    {inventory.ultraball > 0 && (
                        <button onClick={() => handleUseItem('ultraball')}>
                            ⚪ Ultra Ball x{inventory.ultraball}
                        </button>
                    )}
                </div>
            )}

            {winner && (
                <div className="battle-end">
                    <h2>{winner === fighter1 ? '🎉 You Won!' : '💔 You Lost'}</h2>
                    <button onClick={() => onBattleEnd(winner)}>Continue</button>
                </div>
            )}
        </div>
    );
}

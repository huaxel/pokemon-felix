import { useState, useEffect, useCallback } from 'react';
import { calculateMaxHP, calculateEnergyCost, calculateSmartDamage, combineMoves, getTypeColor } from '../../lib/battle-logic';
import { getMoveDetails, getPokemonDetails } from '../../lib/api';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { useCareContext } from '../../hooks/useCareContext';
import { STORAGE_KEYS } from '../../lib/constants';
import './CardBattle.css';
// energy icon was unused; remove import to satisfy linter

export function CardBattle({ fighter1, fighter2, onBattleEnd }) {
    const { inventory, removeItem, toggleOwned, addCoins } = usePokemonContext();
    const { careStats, addFatigue } = useCareContext();
    const [battleLog, setBattleLog] = useState([]);
    const [winner, setWinner] = useState(null);

    // Animation States
    const [attackingFighter, setAttackingFighter] = useState(null);
    const [damagedFighter, setDamagedFighter] = useState(null);
    const [effectivenessMsg, setEffectivenessMsg] = useState(null);
    const [comboMsg, setComboMsg] = useState(null); // For fusion feedback

    // Battle Stats
    const [f1HP, setF1HP] = useState(calculateMaxHP(fighter1));
    const [f2HP, setF2HP] = useState(calculateMaxHP(fighter2));
    const [f1MaxHP, setF1MaxHP] = useState(calculateMaxHP(fighter1));
    const [f2MaxHP, setF2MaxHP] = useState(calculateMaxHP(fighter2));

    // Energy System
    const [f1Energy, setF1Energy] = useState(3);
    const [f2Energy, setF2Energy] = useState(3);
    const MAX_ENERGY = 5;

    // CARD SYSTEM (The "Hand")
    const [hand, setHand] = useState([]); // Array of move objects
    const [selectedIndices, setSelectedIndices] = useState([]); // Array of indices [0, 2]
    const [deck, setDeck] = useState([]); // Pool of moves

    // Enemy AI
    const [f2Moves, setF2Moves] = useState([]);

    const [, setLoadingMoves] = useState(true);
    const [turn, setTurn] = useState('player'); // 'player' | 'opponent'
    const [lastMoveName, setLastMoveName] = useState(null);

    // ITEM SYSTEM
    const [showItems, setShowItems] = useState(false);

    // OUTFIT POWERS
    const [outfitId, setOutfitId] = useState('default');
    useEffect(() => {
        const id = localStorage.getItem(STORAGE_KEYS.CURRENT_OUTFIT) || 'default';
        setOutfitId(id);

        // Initial Bonuses
        if (id === 'cool') {
            setF1Energy(4); // Start with 4 instead of 3
        }
    }, []);

    const handleUseItem = async (itemId) => {
        if (turn !== 'player' || winner) return;

        if (itemId === 'potion') {
            if (removeItem('potion')) {
                setF1HP(prev => Math.min(f1MaxHP, prev + 5)); // TCG heal is small
                setBattleLog(prev => ["🧪 Used Potion! Restored some HP.", ...prev]);
                setShowItems(false);
                setTurn('opponent');
            }
        } else if (itemId.includes('ball')) {
            // Only allowed in SINGLE BATTLES (not tournament)
            // For now, let's assume it's allowed if the prop is passed
            if (removeItem(itemId)) {
                setBattleLog(prev => [`🚀 Threw a ${itemId}!`, ...prev]);
                setShowItems(false);

                const catchRate = itemId === 'masterball' ? 1.0 : itemId === 'ultraball' ? 0.6 : itemId === 'greatball' ? 0.4 : 0.2;
                const success = Math.random() < catchRate;

                if (success) {
                    setBattleLog(prev => ["✨ GOTCHA! Pokémon was caught!", ...prev]);
                    toggleOwned(fighter2.id);
                    setTimeout(() => onBattleEnd(fighter1), 2000);
                } else {
                    setBattleLog(prev => ["💨 Oh no! It broke free!", ...prev]);
                    setTurn('opponent');
                }
            }
        }
    };

    // Initialize Battle
    useEffect(() => {
        const initBattle = async () => {
            setLoadingMoves(true);
            try {
                // Ensure we have full details (moves, stats)
                const ensureDetails = async (pokemon) => {
                    if (pokemon.moves && pokemon.stats) return pokemon;
                    return await getPokemonDetails(pokemon.name);
                };

                const [p1Full, p2Full] = await Promise.all([
                    ensureDetails(fighter1),
                    ensureDetails(fighter2)
                ]);

                // Update local state HP with real stats now that we have them
                const p1Max = calculateMaxHP(p1Full);
                const p2Max = calculateMaxHP(p2Full);
                setF1HP(p1Max);
                setF2HP(p2Max);
                setF1MaxHP(p1Max);
                setF2MaxHP(p2Max);

                // Get all moves for both fighters
                const fetchMoves = async (pokemon) => {
                    // Fetch details for ALL moves (or top 10 to avoid slowness)
                    if (!pokemon.moves) return [];
                    const limitedMoves = pokemon.moves.slice(0, 10);
                    const details = await Promise.all(limitedMoves.map(m => getMoveDetails(m.move.url)));
                    return details.filter(m => m !== null).map(m => ({
                        ...m,
                        baseDamage: m.power ? Math.floor(m.power / 20) + 1 : 1, // Rough estimate
                        cost: calculateEnergyCost(m.power ? Math.floor(m.power / 20) + 1 : 1),
                        id: Math.random() // Unique ID for keying
                    }));
                };

                const [p1Moves, p2Moves] = await Promise.all([
                    fetchMoves(p1Full),
                    fetchMoves(p2Full)
                ]);

                // Player Deck
                setDeck(p1Moves);

                // Draw initial hand of 4 cards
                const initialHand = [];
                for (let i = 0; i < 4; i++) {
                    const randomMove = p1Moves[Math.floor(Math.random() * p1Moves.length)];
                    initialHand.push({ ...randomMove, instanceId: Math.random() });
                }
                setHand(initialHand);

                // Opponent Moves (Simple list for AI)
                setF2Moves(p2Moves);

            } catch (error) {
                console.error("Error initializing battle", error);
            } finally {
                setLoadingMoves(false);
            }
        };
        initBattle();
    }, [fighter1, fighter2]);

    // Draw Cards Helper
    const drawCards = useCallback((count) => {
        if (deck.length === 0) return;
        setHand(prev => {
            const newCards = [];
            for (let i = 0; i < count; i++) {
                const randomMove = deck[Math.floor(Math.random() * deck.length)];
                newCards.push({ ...randomMove, instanceId: Math.random() });
            }
            // Max hand size is 5
            const finalHand = [...prev, ...newCards].slice(0, 5);
            return finalHand;
        });
    }, [deck]);

    // Card Selection Logic
    const handleCardClick = (index) => {
        if (turn !== 'player' || winner) return;

        if (selectedIndices.includes(index)) {
            // Deselect
            setSelectedIndices(prev => prev.filter(i => i !== index));
        } else {
            // Select (Max 2 for fusion)
            if (selectedIndices.length < 2) {
                setSelectedIndices(prev => [...prev, index]);
            }
        }
    };

    // PLAYER ATTACK
    const handleAttack = async () => {
        if (selectedIndices.length === 0) return;

        let move;
        // FUSION
        if (selectedIndices.length === 2) {
            const m1 = hand[selectedIndices[0]];
            const m2 = hand[selectedIndices[1]];
            move = combineMoves(m1, m2);
            setComboMsg(`FUSION! ${m1.name} + ${m2.name}`);
            setTimeout(() => setComboMsg(null), 2000);
        } else {
            move = hand[selectedIndices[0]];
        }

        // Check Energy
        if (f1Energy < move.cost) {
            setBattleLog(prev => ["⚡ Not enough energy!", ...prev]);
            return;
        }

        // Execute
        await executeTurn(fighter1, fighter2, move, setF2HP, setTurn, setF1Energy, f1Energy, true);

        // Remove used cards
        const usedIndices = selectedIndices;
        setHand(prev => prev.filter((_, i) => !usedIndices.includes(i)));
        setSelectedIndices([]); // Reset selection
    };

    // SKIP / RECHARGE
    const handleSkip = () => {
        setBattleLog(prev => ["Skipped turn to recharge energy...", ...prev]);
        setF1Energy(prev => Math.min(MAX_ENERGY, prev + 2)); // Bonus recharge
        drawCards(1);
        setTurn('opponent');
    };

    // GENERIC TURN EXECUTION
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const executeTurn = async (attacker, defender, move, setDefenderHP, setNextTurn, setAttackerEnergy, currentEnergy, isPlayer) => {
        // Deduct Energy
        setAttackerEnergy(prev => Math.max(0, prev - move.cost));

        // Get fatigue if player is attacking
        const fatigue = isPlayer ? (careStats[attacker.id]?.fatigue || 0) : 0;

        // Calculate Smart Damage (Anti-Spam + Fatigue)
        const res = calculateSmartDamage(attacker, defender, move, isPlayer ? lastMoveName : null, fatigue);
        if (isPlayer) setLastMoveName(move.name);

        // Log
        setBattleLog(prev => [`${attacker.name} uses ${move.name}! ${res.message}`, ...prev]);

        // Animations
        setAttackingFighter(attacker);
        await new Promise(r => setTimeout(r, 300));
        setAttackingFighter(null);

        setDamagedFighter(defender);
        if (res.effectiveness > 1) setEffectivenessMsg({ fighter: defender, msg: "Super Effective!", type: "super-effective" });
        else if (res.effectiveness < 1 && res.effectiveness > 0) setEffectivenessMsg({ fighter: defender, msg: "Not very effective...", type: "not-very-effective" });

        await new Promise(r => setTimeout(r, 400));
        setDamagedFighter(null);
        setEffectivenessMsg(null);

        // Apply Damage
        console.log(`[Battle] Applying ${res.damage} damage to ${defender.name}. Current HP:`, defender === fighter1 ? f1HP : f2HP); // Note: f1HP/f2HP might be stale in callback, but useful for initial check

        setDefenderHP(prev => {
            const newHP = Math.max(0, prev - res.damage);
            console.log(`[Battle] HP Update for ${defender.name}: ${prev} -> ${newHP}`);
            if (newHP <= 0) {
                setWinner(attacker);
                setBattleLog(prev => [...prev, `🏆 ${attacker.name} WINS!`]);

                // Increase fatigue if player won or ended battle
                if (isPlayer) {
                    addFatigue(attacker.id, 15);
                    // Special Outfit Bonus: Shiny
                    if (outfitId === 'shiny') {
                        addCoins(50); // Extra 50 coins (Double reward effectively)
                        setBattleLog(prev => ["✨ Shiny Bonus: +50 Coins!", ...prev]);
                    }
                } else {
                    // Even if we lost, our pokemon might have gained some fatigue
                    addFatigue(defender.id, 10);
                }

                setTimeout(() => onBattleEnd(attacker), 2500);
            }
            return newHP;
        });

        // End of Turn Logic
        if (!winner) { // Only switch if game didn't end
            // If Player just finished, opponent goes next
            setNextTurn(isPlayer ? 'opponent' : 'player');
        }
    };

    // OPPONENT AI TURN
    useEffect(() => {
        if (turn === 'opponent' && !winner && f2Moves.length > 0) {
            const aiTimer = setTimeout(async () => {
                // Recharge logic for AI
                setF2Energy(prev => Math.min(MAX_ENERGY, prev + 1)); // Passive regeneration

                // Simple AI: Pick best affordable move
                const affordable = f2Moves.filter(m => m.cost <= f2Energy);

                if (affordable.length > 0) {
                    const move = affordable[Math.floor(Math.random() * affordable.length)];
                    await executeTurn(fighter2, fighter1, move, setF1HP, setTurn, setF2Energy, f2Energy, false);
                } else {
                    // Skip/Recharge
                    setBattleLog(prev => [`${fighter2.name} is resting...`, ...prev]);
                    setF2Energy(prev => Math.min(MAX_ENERGY, prev + 2));
                    setTurn('player');
                }

                // Prepare Player for next turn
                setF1Energy(prev => Math.min(MAX_ENERGY, prev + 2)); // Player regenerates
                drawCards(2); // Player draws cards

                // Nature Outfit Bonus
                const currentOutfit = localStorage.getItem(STORAGE_KEYS.CURRENT_OUTFIT);
                if (currentOutfit === 'nature') {
                    setF1HP(hp => Math.min(f1MaxHP, hp + 1));
                }
            }, 1000);
            return () => clearTimeout(aiTimer);
        }
    }, [turn, winner, f2Moves, f2Energy, drawCards, executeTurn, f1MaxHP, fighter1, fighter2]);


    return (
        <div className="card-battle-arena">
            {/* Battle Log */}
            <div className="battle-log-overlay">
                {battleLog.slice(0, 3).map((log, i) => (
                    <div key={i} className="log-entry">{log}</div>
                ))}
            </div>

            {/* FIGHTERS */}
            <div className="fighters-stage">
                {/* Fighter 2 (Opponent) */}
                <div className={`fighter-card opponent ${damagedFighter === fighter2 ? 'shake' : ''} ${attackingFighter === fighter2 ? 'lunge' : ''}`}>
                    <div className="status-bar">
                        <div className="hp-bar-wrap">
                            <div className="hp-fill" style={{ width: `${(f2HP / f2MaxHP) * 100}%`, background: f2HP < f2MaxHP * 0.2 ? 'red' : '#22c55e' }}></div>
                        </div>
                        <div className="name-tag">{fighter2.name} | {f2HP} HP</div>
                    </div>
                    <img src={fighter2.sprites.front_default} className="sprite" alt="opponent" />
                    {effectivenessMsg && effectivenessMsg.fighter === fighter2 && <div className="float-text">{effectivenessMsg.msg}</div>}
                </div>

                {/* Fighter 1 (Player) */}
                <div className={`fighter-card player ${damagedFighter === fighter1 ? 'shake' : ''} ${attackingFighter === fighter1 ? 'lunge' : ''}`}>
                    <img src={fighter1.sprites.back_default || fighter1.sprites.front_default} className="sprite" alt="player" />
                    <div className="status-bar">
                        <div className="name-tag">{fighter1.name} | {f1HP} HP</div>
                        <div className="hp-bar-wrap">
                            <div className="hp-fill" style={{ width: `${(f1HP / f1MaxHP) * 100}%`, background: f1HP < f1MaxHP * 0.2 ? 'red' : '#22c55e' }}></div>
                        </div>
                        <div className="energy-pills">
                            {[...Array(MAX_ENERGY)].map((_, i) => (
                                <div key={i} className={`pill ${i < f1Energy ? 'on' : 'off'}`}>⚡</div>
                            ))}
                        </div>
                    </div>
                    {/* Combo Animation Text */}
                    {comboMsg && <div className="combo-text">{comboMsg}</div>}
                </div>
            </div>

            {/* PLAYER HAND UI */}
            <div className="player-hand-area">
                {!winner && turn === 'player' && (
                    <div className="action-buttons">
                        <button
                            className={`attack-btn ${selectedIndices.length === 0 ? 'disabled' : ''}`}
                            onClick={handleAttack}
                            disabled={selectedIndices.length === 0}
                        >
                            {selectedIndices.length === 2 ? "FUSION ATTACK!" : "ATTACK"}
                        </button>
                        <button className="item-btn" onClick={() => setShowItems(!showItems)}>
                            {showItems ? "Back" : "Items"}
                        </button>
                        <button className="skip-btn" onClick={handleSkip}>Skip & Charge</button>
                    </div>
                )}

                {showItems && (
                    <div className="items-overlay">
                        <h3>Your Bag</h3>
                        <div className="battle-items-grid">
                            {Object.entries(inventory).map(([id, count]) => (
                                <button
                                    key={id}
                                    className="battle-item-card"
                                    onClick={() => handleUseItem(id)}
                                    disabled={count === 0}
                                >
                                    <span className="item-name">{id.replace('-', ' ')}</span>
                                    <span className="item-count">x{count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="cards-scroll-container">
                    {hand.map((move, i) => {
                        const isSelected = selectedIndices.includes(i);
                        const canAfford = f1Energy >= move.cost;
                        const typeColor = getTypeColor(move.type);

                        return (
                            <div
                                key={i}
                                className={`move-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'too-expensive' : ''}`}
                                style={{ borderColor: typeColor }}
                                onClick={() => handleCardClick(i)}
                            >
                                <div className="card-cost" style={{ background: typeColor }}>{move.cost}</div>
                                <div className="card-title">{move.name}</div>
                                <div className="card-type" style={{ background: typeColor }}>{move.type}</div>
                                <div className="card-power">PWR: {move.baseDamage || '?'}</div>
                                {isSelected && <div className="check-mark">✅</div>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

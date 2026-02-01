import { useState, useEffect, useCallback } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { calculateMaxHP, calculateSmartDamage, getMoves, getTypeColor, chooseBestMove } from '../../../lib/battle-logic';
import { BattleHeader } from './BattleHeader';
import { BattleControls } from './BattleControls';
import './BattleArena.css';

export function BattleArena({ initialFighter1, initialFighter2, onBattleEnd }) {
    const { addCoins } = usePokemonContext();
    const [fighter1, setFighter1] = useState(null);
    const [fighter2, setFighter2] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isBattling, setIsBattling] = useState(false);
    const [f1HP, setF1HP] = useState(0);
    const [f2HP, setF2HP] = useState(0);
    const [f1MaxHP, setF1MaxHP] = useState(0);
    const [f2MaxHP, setF2MaxHP] = useState(0);
    const [f1Energy, setF1Energy] = useState(3);
    const [f2Energy, setF2Energy] = useState(3);
    const [turn, setTurn] = useState('player');
    const [f1Moves, setF1Moves] = useState([]);
    const [f1Weakened, setF1Weakened] = useState(false);
    const [f2Weakened, setF2Weakened] = useState(false);
    const [f1Status, setF1Status] = useState(null);
    const [f2Status, setF2Status] = useState(null);

    const initializeFighter = useCallback((pokemon, slot) => {
        const hp = calculateMaxHP(pokemon);
        if (slot === 1) {
            setFighter1(pokemon); setF1HP(hp); setF1MaxHP(hp); setF1Energy(3); setF1Moves(getMoves(pokemon)); setF1Status(null);
        } else {
            setFighter2(pokemon); setF2HP(hp); setF2MaxHP(hp); setF2Energy(3); setF2Status(null);
        }
    }, []);

    useEffect(() => {
        if (initialFighter1 && !fighter1) initializeFighter(initialFighter1, 1);
        if (initialFighter2 && !fighter2) initializeFighter(initialFighter2, 2);
    }, [initialFighter1, initialFighter2, fighter1, fighter2, initializeFighter]);

    const addLog = (msg, color = '#4ade80') => setBattleLog(prev => [{ text: msg, color }, ...prev]);

    const endBattle = useCallback((win) => {
        setIsBattling(false);
        setWinner(win === 1 ? fighter1 : fighter2);
        if (win === 1) addCoins(100);
        if (onBattleEnd) onBattleEnd(win === 1 ? fighter1 : fighter2);
    }, [fighter1, fighter2, addCoins, onBattleEnd]);

    const executeMove = useCallback(async (attacker, defender, move, isPlayer) => {
        const attackerStatus = isPlayer ? f1Status : f2Status;

        // 0. Check Status Block (Before Cost)
        if (attackerStatus === 'freeze') {
            if (Math.random() < 0.2) {
                 addLog(`${attacker.name} is ontdooid!`, '#67e8f9');
                 if (isPlayer) setF1Status(null); else setF2Status(null);
            } else {
                 addLog(`${attacker.name} is bevroren!`, '#67e8f9');
                 if (isPlayer) { setTurn('enemy'); setF2Energy(e => Math.min(5, e+1)); }
                 else { setTurn('player'); setF1Energy(e => Math.min(5, e+1)); }
                 return;
            }
        }
        if (attackerStatus === 'sleep') {
             if (Math.random() < 0.33) {
                 addLog(`${attacker.name} is wakker geworden!`, '#fbbf24');
                 if (isPlayer) setF1Status(null); else setF2Status(null);
             } else {
                 addLog(`${attacker.name} slaapt...`, '#9ca3af');
                 if (isPlayer) { setTurn('enemy'); setF2Energy(e => Math.min(5, e+1)); }
                 else { setTurn('player'); setF1Energy(e => Math.min(5, e+1)); }
                 return;
            }
        }
        if (attackerStatus === 'paralysis') {
            if (Math.random() < 0.25) {
                 addLog(`${attacker.name} is verlamd!`, '#facc15');
                 if (isPlayer) { setTurn('enemy'); setF2Energy(e => Math.min(5, e+1)); }
                 else { setTurn('player'); setF1Energy(e => Math.min(5, e+1)); }
                 return;
            }
        }

        // 1. Deduct Energy
        if (isPlayer) {
            setF1Energy(prev => Math.max(0, prev - (move.cost || 1)));
        } else {
            setF2Energy(prev => Math.max(0, prev - (move.cost || 1)));
        }

        const result = calculateSmartDamage(
            attacker,
            defender,
            move,
            {
                lastMoveName: null,
                fatigue: 0,
                isWeakened: isPlayer ? f2Weakened : f1Weakened,
                attackerStatus
            }
        );
        const { damage, recoilDamage, appliedStatus } = result;
        const color = getTypeColor(attacker.types?.[0]?.type?.name);

        if (isPlayer) {
            const nextHP = Math.max(0, f2HP - damage);
            setF2HP(nextHP);
            addLog(`${attacker.name} gebruikt ${move.name}! -${damage} HP${result.message}`, color);

            if (f2Weakened) setF2Weakened(false); // Reset after being hit
            
            if (appliedStatus && !f2Status) {
                setF2Status(appliedStatus);
            }

            let currentF1HP = f1HP;

            if (recoilDamage > 0) {
                currentF1HP = Math.max(0, f1HP - recoilDamage);
                setF1HP(currentF1HP);
                addLog(`${attacker.name} krijgt -${recoilDamage} terugslag schade!`, color);
                setF1Weakened(true); // Weak after recoil
                if (currentF1HP === 0) { endBattle(2); return; }
            }

            if (nextHP === 0) { endBattle(1); return; }
            
            // End of Turn Status Damage
            if (attackerStatus === 'burn' || attackerStatus === 'poison') {
                const dot = Math.floor(f1MaxHP / 8) || 1;
                const afterDotHP = Math.max(0, currentF1HP - dot);
                setF1HP(afterDotHP);
                addLog(`${attacker.name} lijdt door ${attackerStatus}! -${dot}`, '#ef4444');
                if (afterDotHP === 0) { endBattle(2); return; }
            }

            setTurn('enemy');
            setF2Energy(prev => Math.min(5, prev + 1)); // Enemy regenerates energy
        } else {
            const nextHP = Math.max(0, f1HP - damage);
            setF1HP(nextHP);
            addLog(`Vijand ${attacker.name} gebruikt ${move.name}! -${damage} HP${result.message}`, color);

            if (f1Weakened) setF1Weakened(false); // Reset after being hit

            if (appliedStatus && !f1Status) {
                setF1Status(appliedStatus);
            }

            let currentF2HP = f2HP;

            if (recoilDamage > 0) {
                currentF2HP = Math.max(0, f2HP - recoilDamage);
                setF2HP(currentF2HP);
                addLog(`Vijand krijgt -${recoilDamage} terugslag schade!`, color);
                setF2Weakened(true); // Weak after recoil
                if (currentF2HP === 0) { endBattle(1); return; }
            }

            if (nextHP === 0) { endBattle(2); return; }

            // End of Turn Status Damage
            if (attackerStatus === 'burn' || attackerStatus === 'poison') {
                const dot = Math.floor(f2MaxHP / 8) || 1;
                const afterDotHP = Math.max(0, currentF2HP - dot);
                setF2HP(afterDotHP);
                addLog(`${attacker.name} lijdt door ${attackerStatus}! -${dot}`, '#ef4444');
                if (afterDotHP === 0) { endBattle(1); return; }
            }

            setTurn('player');
            setF1Energy(prev => Math.min(5, prev + 1)); // Player regenerates energy
        }
    }, [f1HP, f2HP, f1Weakened, f2Weakened, endBattle, f1Status, f2Status, f1MaxHP, f2MaxHP]);

    useEffect(() => {
        if (isBattling && turn === 'enemy' && !winner) {
            const timer = setTimeout(() => {
                const moves = getMoves(fighter2);
                
                // Use new AI Logic
                let move = chooseBestMove(fighter2, fighter1, moves, f2Energy);
                
                // Fallback: If no move affordable (shouldn't happen with 1-cost moves, but safe guard)
                // If really stuck, just pick cheapest
                if (!move) {
                     move = moves.sort((a,b) => (a.cost || 1) - (b.cost || 1))[0];
                }

                executeMove(fighter2, fighter1, move, false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, isBattling, winner, fighter1, fighter2, executeMove, f2Energy]);

    if (!fighter1 || !fighter2) return <div className="battle-arena">Arena voorbereiden...</div>;

    return (
        <div className="battle-arena">
            <BattleHeader fighter1={fighter1} fighter2={fighter2} f1HP={f1HP} f1MaxHP={f1MaxHP} f2HP={f2HP} f2MaxHP={f2MaxHP} f1Energy={f1Energy} f2Energy={f2Energy} f1Weakened={f1Weakened} f2Weakened={f2Weakened} />
            <div className="battle-visuals">
                <div className={`fighter-sprite f1 ${turn === 'player' ? 'active' : ''} ${f1Weakened ? 'weakened' : ''}`}><img src={fighter1.sprites?.front_default} alt={fighter1.name} style={{ imageRendering: 'pixelated' }} /></div>
                <div className={`fighter-sprite f2 ${turn === 'enemy' ? 'active' : ''} ${f2Weakened ? 'weakened' : ''}`}><img src={fighter2.sprites?.front_default} alt={fighter2.name} style={{ imageRendering: 'pixelated' }} /></div>
            </div>
            {!isBattling && !winner && <button className="btn-kenney success start-btn" onClick={() => setIsBattling(true)}>VECHTEN!</button>}
            <div className="battle-main">
                <div className="battle-log game-panel-dark"><h3>Logboek</h3>{battleLog.map((log, i) => <div key={i} className="log-entry" style={{ color: log.color }}>{log.text}</div>)}</div>
                <BattleControls moves={f1Moves} energy={f1Energy} turn={turn} isBattling={isBattling} onAttack={(m) => executeMove(fighter1, fighter2, m, true)} getTypeColor={getTypeColor} />
            </div>
            {winner && <div className="winner-overlay game-panel-dark"><h2>Overwinning voor {winner.name}!</h2><button className="btn-kenney primary" onClick={() => window.location.reload()}>Beëindigen</button></div>}
        </div>
    );
}

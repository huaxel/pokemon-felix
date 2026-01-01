import { useState, useEffect, useCallback } from 'react';
import { usePokemonContext } from '../hooks/usePokemonContext';
import { calculateMaxHP, calculateSmartDamage, getMoves, getTypeColor } from '../lib/battle-logic';
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

    const initializeFighter = useCallback((pokemon, slot) => {
        const hp = calculateMaxHP(pokemon);
        if (slot === 1) {
            setFighter1(pokemon); setF1HP(hp); setF1MaxHP(hp); setF1Energy(3); setF1Moves(getMoves(pokemon));
        } else {
            setFighter2(pokemon); setF2HP(hp); setF2MaxHP(hp); setF2Energy(3);
        }
    }, []);

    useEffect(() => {
        if (initialFighter1 && !fighter1) initializeFighter(initialFighter1, 1);
        if (initialFighter2 && !fighter2) initializeFighter(initialFighter2, 2);
    }, [initialFighter1, initialFighter2, fighter1, fighter2, initializeFighter]);

    const addLog = (msg) => setBattleLog(prev => [msg, ...prev]);

    const endBattle = useCallback((win) => {
        setIsBattling(false);
        setWinner(win === 1 ? fighter1 : fighter2);
        if (win === 1) addCoins(100);
        if (onBattleEnd) onBattleEnd(win === 1 ? fighter1 : fighter2);
    }, [fighter1, fighter2, addCoins, onBattleEnd]);

    const executeMove = async (attacker, defender, move, isPlayer) => {
        const result = calculateSmartDamage(attacker, defender, move);
        if (isPlayer) {
            const nextHP = Math.max(0, f2HP - result.damage);
            setF2HP(nextHP); addLog(`¡${attacker.name} usa ${move.name}! -${result.damage} HP`);
            if (nextHP === 0) { endBattle(1); return; }
            setTurn('enemy');
        } else {
            const nextHP = Math.max(0, f1HP - result.damage);
            setF1HP(nextHP); addLog(`¡Enemigo ${attacker.name} usa ${move.name}! -${result.damage} HP`);
            if (nextHP === 0) { endBattle(2); return; }
            setTurn('player');
            setF1Energy(prev => Math.min(5, prev + 1));
        }
    };

    useEffect(() => {
        if (isBattling && turn === 'enemy' && !winner) {
            const timer = setTimeout(() => {
                const moves = getMoves(fighter2);
                const move = moves[Math.floor(Math.random() * moves.length)];
                executeMove(fighter2, fighter1, move, false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, isBattling, winner, fighter1, fighter2]);

    if (!fighter1 || !fighter2) return <div className="battle-arena">Preparando arena...</div>;

    return (
        <div className="battle-arena">
            <BattleHeader fighter1={fighter1} fighter2={fighter2} f1HP={f1HP} f1MaxHP={f1MaxHP} f2HP={f2HP} f2MaxHP={f2MaxHP} f1Energy={f1Energy} f2Energy={f2Energy} />
            <div className="battle-visuals">
                <div className={`fighter-sprite f1 ${turn === 'player' ? 'active' : ''}`}><img src={fighter1.sprites?.front_default} alt={fighter1.name} /></div>
                <div className={`fighter-sprite f2 ${turn === 'enemy' ? 'active' : ''}`}><img src={fighter2.sprites?.front_default} alt={fighter2.name} /></div>
            </div>
            {!isBattling && !winner && <button className="start-btn" onClick={() => setIsBattling(true)}>¡Comenzar Batalla!</button>}
            <div className="battle-main">
                <div className="battle-log"><h3>Registro</h3>{battleLog.map((log, i) => <div key={i} className="log-entry">{log}</div>)}</div>
                <BattleControls moves={f1Moves} energy={f1Energy} turn={turn} isBattling={isBattling} onAttack={(m) => executeMove(fighter1, fighter2, m, true)} getTypeColor={getTypeColor} />
            </div>
            {winner && <div className="winner-overlay"><h2>¡Victoria para {winner.name}!</h2><button onClick={() => window.location.reload()}>Finalizar</button></div>}
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { calculateMaxHP, calculateSmartDamage, getMoves, chooseBestMove } from '../../../lib/battle-logic';
import { useEconomy } from '../../../contexts/DomainContexts'; // still using for now, will refactor this context later

export function useBattleController({ initialFighter1, initialFighter2, onBattleEnd }) {
  const { addCoins } = useEconomy();
  
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

  const addLog = useCallback((msg, color = '#4ade80') => {
    setBattleLog(prev => [{ text: msg, color }, ...prev]);
  }, []);

  const initializeFighter = useCallback((pokemon, slot) => {
    const hp = calculateMaxHP(pokemon);
    if (slot === 1) {
      setFighter1(pokemon);
      setF1HP(hp);
      setF1MaxHP(hp);
      setF1Energy(3);
      setF1Moves(getMoves(pokemon));
      setF1Status(null);
    } else {
      setFighter2(pokemon);
      setF2HP(hp);
      setF2MaxHP(hp);
      setF2Energy(3);
      setF2Status(null);
    }
  }, []);

  useEffect(() => {
    if (initialFighter1 && !fighter1) initializeFighter(initialFighter1, 1);
    if (initialFighter2 && !fighter2) initializeFighter(initialFighter2, 2);
  }, [initialFighter1, initialFighter2, fighter1, fighter2, initializeFighter]);

  const endBattle = useCallback(
    win => {
      setIsBattling(false);
      const winningFighter = win === 1 ? fighter1 : fighter2;
      setWinner(winningFighter);
      if (win === 1) addCoins(100);
      if (onBattleEnd) onBattleEnd(winningFighter);
    },
    [fighter1, fighter2, addCoins, onBattleEnd]
  );

  const executeMove = useCallback(
    async (attacker, defender, move, isPlayer) => {
      const attackerStatus = isPlayer ? f1Status : f2Status;

      // 0. Status Effect Strategies
      const statusStrategies = {
        freeze: {
          execute: () => {
             if (Math.random() < 0.2) {
               addLog(`${attacker.name} is ontdooid!`, '#67e8f9');
               if (isPlayer) setF1Status(null); else setF2Status(null);
               return true; // Can attack
             }
             addLog(`${attacker.name} is bevroren!`, '#67e8f9');
             return false; // Cannot attack
          }
        },
        sleep: {
          execute: () => {
             if (Math.random() < 0.33) {
               addLog(`${attacker.name} is wakker geworden!`, '#fbbf24');
               if (isPlayer) setF1Status(null); else setF2Status(null);
               return true;
             }
             addLog(`${attacker.name} slaapt...`, '#9ca3af');
             return false;
          }
        },
        paralysis: {
          execute: () => {
             if (Math.random() < 0.25) {
               addLog(`${attacker.name} is verlamd!`, '#facc15');
               return false;
             }
             return true;
          }
        }
      };

      if (attackerStatus && statusStrategies[attackerStatus]) {
         const canAttack = statusStrategies[attackerStatus].execute();
         if (!canAttack) {
            if (isPlayer) {
              setTurn('enemy');
              setF2Energy(e => Math.min(5, e + 1));
            } else {
              setTurn('player');
              setF1Energy(e => Math.min(5, e + 1));
            }
            return;
         }
      }

      // 1. Deduct Energy
      if (isPlayer) {
        setF1Energy(prev => Math.max(0, prev - (move.cost || 1)));
      } else {
        setF2Energy(prev => Math.max(0, prev - (move.cost || 1)));
      }

      const result = calculateSmartDamage(attacker, defender, move, {
        lastMoveName: null,
        fatigue: 0,
        isWeakened: isPlayer ? f2Weakened : f1Weakened,
        attackerStatus,
      });
      const { damage, recoilDamage, appliedStatus } = result;
      // Using generic logic here since type colors are visual
      const isCritical = result.message.includes('Voltreffer'); 
      const color = isCritical ? '#fbbf24' : '#4ade80';

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
          if (currentF1HP === 0) {
            endBattle(2);
            return;
          }
        }

        if (nextHP === 0) {
          endBattle(1);
          return;
        }

        // End of Turn Status Damage
        if (attackerStatus === 'burn' || attackerStatus === 'poison') {
          const dot = Math.floor(f1MaxHP / 8) || 1;
          const afterDotHP = Math.max(0, currentF1HP - dot);
          setF1HP(afterDotHP);
          addLog(`${attacker.name} lijdt door ${attackerStatus}! -${dot}`, '#ef4444');
          if (afterDotHP === 0) {
            endBattle(2);
            return;
          }
        }

        setTurn('enemy');
        setF2Energy(prev => Math.min(5, prev + 1)); // Enemy regenerates energy
      } else {
        const nextHP = Math.max(0, f1HP - damage);
        setF1HP(nextHP);
        addLog(
          `Vijand ${attacker.name} gebruikt ${move.name}! -${damage} HP${result.message}`,
          color
        );

        if (f1Weakened) setF1Weakened(false);

        if (appliedStatus && !f1Status) {
          setF1Status(appliedStatus);
        }

        let currentF2HP = f2HP;

        if (recoilDamage > 0) {
          currentF2HP = Math.max(0, f2HP - recoilDamage);
          setF2HP(currentF2HP);
          addLog(`Vijand krijgt -${recoilDamage} terugslag schade!`, color);
          setF2Weakened(true); 
          if (currentF2HP === 0) {
            endBattle(1);
            return;
          }
        }

        if (nextHP === 0) {
          endBattle(2);
          return;
        }

        if (attackerStatus === 'burn' || attackerStatus === 'poison') {
          const dot = Math.floor(f2MaxHP / 8) || 1;
          const afterDotHP = Math.max(0, currentF2HP - dot);
          setF2HP(afterDotHP);
          addLog(`${attacker.name} lijdt door ${attackerStatus}! -${dot}`, '#ef4444');
          if (afterDotHP === 0) {
            endBattle(1);
            return;
          }
        }

        setTurn('player');
        setF1Energy(prev => Math.min(5, prev + 1));
      }
    },
    [f1HP, f2HP, f1Weakened, f2Weakened, endBattle, f1Status, f2Status, f1MaxHP, f2MaxHP, addLog]
  );

  useEffect(() => {
    let timer;
    if (isBattling && turn === 'enemy' && !winner && fighter1 && fighter2) {
      timer = setTimeout(() => {
        const moves = getMoves(fighter2);
        let move = chooseBestMove(fighter2, fighter1, moves, f2Energy);
        if (!move) {
          move = moves.sort((a, b) => (a.cost || 1) - (b.cost || 1))[0];
        }
        executeMove(fighter2, fighter1, move, false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [turn, isBattling, winner, fighter1, fighter2, executeMove, f2Energy]);


  return {
    fighter1,
    fighter2,
    f1HP,
    f1MaxHP,
    f2HP,
    f2MaxHP,
    f1Energy,
    f2Energy,
    f1Weakened,
    f2Weakened,
    f1Status,
    f2Status,
    f1Moves,
    turn,
    battleLog,
    winner,
    isBattling,
    setIsBattling,
    executeMove
  };
}

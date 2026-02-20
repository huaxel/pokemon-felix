import { getTypeColor } from '../../../lib/battle-logic';
import { BattleHeader } from './BattleHeader';
import { BattleControls } from './BattleControls';
import { useBattleController } from '../hooks/useBattleController';
import './BattleArena.css';

export function BattleArena({ initialFighter1, initialFighter2, onBattleEnd }) {
  const {
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
    f1Moves,
    turn,
    battleLog,
    winner,
    isBattling,
    setIsBattling,
    executeMove,
  } = useBattleController({ initialFighter1, initialFighter2, onBattleEnd });

  if (!fighter1 || !fighter2) return <div className="battle-arena">Arena voorbereiden...</div>;

  return (
    <div className="battle-arena">
      <BattleHeader
        fighter1={fighter1}
        fighter2={fighter2}
        f1HP={f1HP}
        f1MaxHP={f1MaxHP}
        f2HP={f2HP}
        f2MaxHP={f2MaxHP}
        f1Energy={f1Energy}
        f2Energy={f2Energy}
        f1Weakened={f1Weakened}
        f2Weakened={f2Weakened}
      />
      <div className="battle-visuals">
        <div
          className={`fighter-sprite f1 ${turn === 'player' ? 'active' : ''} ${f1Weakened ? 'weakened' : ''}`}
        >
          <img
            src={fighter1.sprites?.front_default}
            alt={fighter1.name}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div
          className={`fighter-sprite f2 ${turn === 'enemy' ? 'active' : ''} ${f2Weakened ? 'weakened' : ''}`}
        >
          <img
            src={fighter2.sprites?.front_default}
            alt={fighter2.name}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
      {!isBattling && !winner && (
        <button className="btn-kenney success start-btn" onClick={() => setIsBattling(true)}>
          VECHTEN!
        </button>
      )}
      <div className="battle-main">
        <div className="battle-log game-panel-dark">
          <h3>Logboek</h3>
          {battleLog.map((log, i) => (
            <div key={i} className="log-entry" style={{ color: log.color }}>
              {log.text}
            </div>
          ))}
        </div>
        <BattleControls
          moves={f1Moves}
          energy={f1Energy}
          turn={turn}
          isBattling={isBattling}
          onAttack={m => executeMove(fighter1, fighter2, m, true)}
          getTypeColor={getTypeColor}
        />
      </div>
      {winner && (
        <div className="winner-overlay game-panel-dark">
          <h2>Overwinning voor {winner.name}!</h2>
          <button className="btn-kenney primary" onClick={() => window.location.reload()}>
            Beëindigen
          </button>
        </div>
      )}
    </div>
  );
}

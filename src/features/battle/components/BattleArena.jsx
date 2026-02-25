import { Canvas } from '@react-three/fiber';
import { getTypeColor } from '../../../lib/battle-logic';
import { BattleHeader } from './BattleHeader';
import { BattleControls } from './BattleControls';
import { useBattleController } from '../hooks/useBattleController';
import { WorldScene3DMain } from '../../world/components/WorldScene3DMain';
import { TILE_TYPES } from '../../world/worldConstants';
import './BattleArena.css';

const BATTLE_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y >= 5) return TILE_TYPES.GRASS;
    if (y === 4) return xIndex === 0 || xIndex === 7 ? TILE_TYPES.GRASS : TILE_TYPES.PATH;
    if (y === 3) return TILE_TYPES.PATH;
    return TILE_TYPES.SAND;
  }),
);

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
        <div className="battle-3d-wrapper">
          <Canvas
            shadows={false}
            dpr={[1, 1.5]}
            gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
            camera={{ position: [3.5, 4.5, 8], fov: 55 }}
          >
            <WorldScene3DMain
              mapGrid={BATTLE_GRID}
              onObjectClick={undefined}
              isNight={false}
              enableSky={true}
            />
          </Canvas>
        </div>
        <div className="battle-visuals-inner">
          <div
            className={`fighter-sprite f1 ${turn === 'player' ? 'active' : ''} ${f1Weakened ? 'weakened' : ''
              }`}
          >
            <img
              src={fighter1.sprites?.front_default}
              alt={fighter1.name}
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div
            className={`fighter-sprite f2 ${turn === 'enemy' ? 'active' : ''} ${f2Weakened ? 'weakened' : ''
              }`}
          >
            <img
              src={fighter2.sprites?.front_default}
              alt={fighter2.name}
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
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

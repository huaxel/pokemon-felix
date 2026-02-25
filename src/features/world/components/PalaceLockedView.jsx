import { Crown, Trophy } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { WorldPageHeader } from './WorldPageHeader';
import { WorldScene3DMain } from './WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import { grassTile } from '../worldAssets';

const PALACE_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y >= 6) return TILE_TYPES.GRASS;
    if (y === 5) return TILE_TYPES.PATH;
    if (y === 2 && xIndex >= 2 && xIndex <= 5) return TILE_TYPES.PALACE;
    if (y === 3 && (xIndex === 2 || xIndex === 5)) return TILE_TYPES.PALACE;
    return TILE_TYPES.SAND;
  }),
);

export function PalaceLockedView({ ownedCount }) {
  return (
    <div
      className="palace-page locked"
      style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
    >
      <WorldPageHeader title="Paleis van de Kampioen" icon="👑" />

      <div className="palace-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={PALACE_GRID}
            onObjectClick={undefined}
            isNight={false}
            enableSky={false}
          />
        </Canvas>
      </div>

      <div className="locked-content">
        <Crown size={120} className="locked-icon" />
        <h2>Paleis Gesloten</h2>
        <p>Alleen kampioenen mogen deze heilige plaats betreden.</p>
        <div className="requirement">
          <Trophy size={24} />
          <span>Vang minstens 50 Pokémon</span>
        </div>
        <div className="progress">
          <span>{ownedCount} / 50</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (ownedCount / 50) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

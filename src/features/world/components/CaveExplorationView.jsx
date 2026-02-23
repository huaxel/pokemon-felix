import React from 'react';
import { Canvas } from '@react-three/fiber';
import { WorldScene3DMain } from './WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';

const CAVE_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.MOUNTAIN;
    if (xIndex === 3 || xIndex === 4) return TILE_TYPES.PATH;
    return TILE_TYPES.SAND;
  })
);

export function CaveExplorationView({ depth, onExplore, onExit, onReturn }) {
  return (
    <div className="exploration-view">
      <div className="cave-visual">
        <div className="cave-3d-wrapper">
          <Canvas
            shadows={false}
            dpr={[1, 1.5]}
            gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
            camera={{ position: [3.5, 4, 7], fov: 55 }}
          >
            <WorldScene3DMain
              mapGrid={CAVE_GRID}
              onObjectClick={undefined}
              isNight={true}
              enableSky={false}
            />
          </Canvas>
        </div>
        <div className={`depth-indicator depth-${Math.min(5, Math.floor(depth / 20))}`}>
          {depth === 0 ? 'Entrance' : `Depth: ${depth}m`}
        </div>
      </div>

      <div className="cave-actions">
        <button className="explore-btn" onClick={onExplore}>
          Go Deeper... 🔦
        </button>
        <div className="minor-actions">
          {depth > 0 && (
            <button className="return-entrance-btn" onClick={onReturn}>
              Back to Entrance
            </button>
          )}
          <button className="exit-btn" onClick={onExit}>
            Leave Cave
          </button>
        </div>
      </div>

      <p className="cave-hint">
        The deeper you go, the rarer the Pokemon... but it gets harder to find them!
      </p>
    </div>
  );
}

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { WorldScene3DMain } from './WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';

const WATER_INTRO_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y >= 6) return TILE_TYPES.GRASS;
    if (y === 5) {
      return xIndex === 0 || xIndex === 7 ? TILE_TYPES.GRASS : TILE_TYPES.SAND;
    }
    return TILE_TYPES.WATER;
  }),
);

export function WaterIntroView({ onLearn, onExit }) {
  return (
    <div className="water-route-page intro">
      <div className="surf-lesson">
        <h1>🌊 Water Route</h1>
        <div className="water-scene">
          <div className="water-animation" />
          <div className="water-3d-wrapper">
            <Canvas
              shadows={false}
              dpr={[1, 1.5]}
              gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
              camera={{ position: [3.5, 4, 6], fov: 60 }}
            >
              <WorldScene3DMain
                mapGrid={WATER_INTRO_GRID}
                onObjectClick={undefined}
                isNight={false}
                enableSky={false}
              />
            </Canvas>
          </div>
          <p className="water-text">A vast expanse of water blocks your path...</p>
        </div>
        <div className="surf-info">
          <h2>Learn SURF?</h2>
          <p>Surf allows you to travel across water and discover new areas!</p>
          <ul>
            <li>🌊 Encounter water-type Pokemon</li>
            <li>💎 Find hidden treasures</li>
            <li>🗺️ Explore new locations</li>
          </ul>
        </div>
        <button className="learn-surf-btn" onClick={onLearn}>
          🏄 Learn SURF
        </button>
        <button className="back-btn" onClick={onExit}>
          ← Back
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { WorldScene3DMain } from './WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';

const MOUNTAIN_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y >= 5) return TILE_TYPES.GRASS;
    if (y === 4) return xIndex === 0 || xIndex === 7 ? TILE_TYPES.GRASS : TILE_TYPES.PATH;
    if (y === 3) return TILE_TYPES.PATH;
    return TILE_TYPES.MOUNTAIN;
  }),
);

export function MountainHikeView({
  altitude,
  tiredness,
  currentStage,
  foundPokemon,
  message,
  onExit,
  onClimb,
  onRest,
  onCatch,
  onPass,
}) {
  const progressPercent = Math.min(100, (altitude / 2000) * 100);

  return (
    <div className="mountain-page hiking">
      <div className="mountain-3d-strip">
        <div className="mountain-3d-wrapper">
          <Canvas
            shadows={false}
            dpr={[1, 1.5]}
            gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
            camera={{ position: [3.5, 5, 8], fov: 55 }}
          >
            <WorldScene3DMain
              mapGrid={MOUNTAIN_GRID}
              onObjectClick={undefined}
              isNight={false}
              enableSky={false}
            />
          </Canvas>
        </div>
      </div>
      <div className="hiking-header">
        <h2>⛰️ Berg Beklimmen</h2>
        <button className="exit-btn btn-kenney neutral" onClick={onExit}>
          Verlaten
        </button>
      </div>

      <div className="climb-stats">
        <div className="stat">
          <span>📍 Hoogte</span>
          <div className="altitude-display">{altitude}m</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="stat">
          <span>😫 Vermoeidheid</span>
          <div className="tiredness-display">{tiredness}/100</div>
          <div className="energy-bar">
            <div
              className="energy-fill"
              style={{
                width: `${tiredness}%`,
                backgroundColor:
                  tiredness > 70 ? '#ef4444' : tiredness > 40 ? '#f59e0b' : '#22c55e',
              }}
            ></div>
          </div>
        </div>
      </div>

      {currentStage && (
        <div className="current-zone">
          <h3>{currentStage.name}</h3>
          <p>{currentStage.description}</p>
        </div>
      )}

      {foundPokemon ? (
        <div className="pokemon-encounter">
          <h3>Ontmoeting!</h3>
          <img
            src={foundPokemon.sprites?.front_default}
            alt={foundPokemon.name}
            style={{ imageRendering: 'pixelated' }}
          />
          <h4>{foundPokemon.name}</h4>
          <div className="encounter-buttons">
            <button className="catch-btn btn-kenney primary" onClick={onCatch}>
              🎯 Vangen
            </button>
            <button className="pass-btn btn-kenney neutral" onClick={onPass}>
              👋 Overslaan
            </button>
          </div>
        </div>
      ) : (
        <div className="climb-actions">
          <button
            className="climb-btn btn-kenney primary"
            onClick={onClimb}
            disabled={tiredness >= 100}
          >
            ⬆️ Hoger Klimmen
          </button>
          {tiredness > 20 && (
            <button className="rest-btn btn-kenney warning" onClick={onRest}>
              😴 Rusten
            </button>
          )}
        </div>
      )}

      {message && <div className="message-box">{message}</div>}
    </div>
  );
}

import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerControls3D } from './PlayerControls3D';
import { WorldScene3DMain } from './WorldScene3DMain';

/**
 * WorldView3D
 * Standardized 3D viewport for the main adventure map.
 */
export function WorldView3D({ playerPos, mapGrid, townObjects, handleTileClick }) {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '4px solid #475569',
            backgroundColor: '#000'
        }}>
            <Canvas shadows camera={{ position: [playerPos.x, 1.6, playerPos.y], fov: 75 }}>
                <PlayerControls3D
                    mapGrid={mapGrid}
                    initialPos={playerPos}
                    onPositionChange={(newPos) => {
                        // Update the actual game state when moving in 3D
                        handleTileClick(newPos.x, newPos.y);
                    }}
                />
                <WorldScene3DMain
                    mapGrid={mapGrid}
                    townObjects={townObjects}
                    onObjectClick={(x, y) => handleTileClick(x, y)}
                />
            </Canvas>

            {/* HUD Overlays for 3D Mode */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 10
            }}></div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                pointerEvents: 'none',
                fontSize: '0.9rem',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>⌨️ Bediening:</div>
                WASD om te lopen • Muis om te kijken • Klik om te ontgrendelen • Klik op gebouw om binnen te gaan
            </div>
        </div>
    );
}

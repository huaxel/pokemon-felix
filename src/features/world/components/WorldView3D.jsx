import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { PlayerControls3D } from './PlayerControls3D';
import { WorldScene3DMain } from './WorldScene3DMain';

/**
 * WorldView3D
 * Standardized 3D viewport for the main adventure map.
 */
export function WorldView3D({ playerPos, mapGrid, townObjects, handleTileClick, viewMode = 'first', isNight = false }) {
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
            <Canvas
                shadows={false}
                dpr={[1, 1.5]}
                gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
                camera={viewMode === 'first' ? { position: [playerPos.x, 1.6, playerPos.y], fov: 75 } : undefined}
            >
                {viewMode === 'first' ? (
                    <PlayerControls3D
                        mapGrid={mapGrid}
                        initialPos={playerPos}
                        onPositionChange={(newPos) => {
                            handleTileClick(newPos.x, newPos.y);
                        }}
                    />
                ) : (
                    <OrthographicCamera
                        makeDefault
                        position={[playerPos.x, 12, playerPos.y]}
                        rotation={[-Math.PI / 4, 0, 0]}
                        zoom={50}
                    />
                )}
                <WorldScene3DMain
                    mapGrid={mapGrid}
                    townObjects={townObjects}
                    onObjectClick={(x, y) => handleTileClick(x, y)}
                    isNight={isNight}
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
                {viewMode === 'first'
                    ? 'WASD om te lopen • Muis om te kijken • Klik om te ontgrendelen • Klik op gebouw om binnen te gaan'
                    : 'Klik op tegels/gebouwen om te interacteren • Pijltjestoetsen bewegen de speler'}
            </div>
        </div>
    );
}

import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useData } from '../../../contexts/DomainContexts';
import { PlayerControls3D } from '../components/PlayerControls3D';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { EncounterModal } from '../components/EncounterModal';
import { Pokeball3D } from '../components/Pokeball3D';
import { PokemonSprite } from '../components/PokemonSprite';
import { useEncounter } from '../hooks/useEncounter';
import { ArrowLeft } from 'lucide-react';
import './SafariZone3D.css';
import { TILE_TYPES } from '../worldConstants';

const SAFARI_GRID_SIZE = 10;

const baseSafariGrid = Array.from({ length: SAFARI_GRID_SIZE }, (_, y) =>
    Array.from({ length: SAFARI_GRID_SIZE }, (_, x) => {
        const dx = x - SAFARI_GRID_SIZE / 2;
        const dy = y - SAFARI_GRID_SIZE / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2.5) return TILE_TYPES.WATER;
        if (dist < 4) return TILE_TYPES.SAND;
        return TILE_TYPES.GRASS;
    }),
);

export function SafariZone3D() {
    const navigate = useNavigate();
    const { pokemonList, loading } = useData();
    const [isLocked, setIsLocked] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    // Hook into our existing Encounter logic!
    const {
        encounter,
        setEncounter,
        catching,
        catchMessage,
        handleCatch,
        handleFlee,
    } = useEncounter({
        onFleeCustom: () => {
            // Small delay on flee before letting them walk again
            setTimeout(() => setShowInstructions(true), 500);
        },
        onCatchSuccessCustom: () => {
            setTimeout(() => setShowInstructions(true), 1500);
        },
        onBattleEndCustom: () => {
            setShowInstructions(true);
        }
    });

    const [thrownBall, setThrownBall] = useState(null);

    const handlePokemonClick = (pokemonOrX, targetPositionOrY, _maybeType) => {
        if (thrownBall) return;

        // If it's a Pokemon sprite, pokemonOrX will be an object with an 'id' or 'image'
        // If it's from WorldScene3DMain ground, pokemonOrX will be a number (x coordinate)
        const isPokemon = typeof pokemonOrX === 'object' && (pokemonOrX.id || pokemonOrX.image);

        if (!isPokemon) return;

        // Start the throwing animation
        setThrownBall({
            target: targetPositionOrY,
            pokemon: pokemonOrX
        });
    };

    const onBallHit = () => {
        if (!thrownBall) return;
        const pokemon = thrownBall.pokemon;
        setThrownBall(null);

        // Original click logic: Unlock controls and show modal
        document.exitPointerLock();
        setIsLocked(false);
        setEncounter(pokemon);
    };

    if (loading) {
        return (
            <div className="safari-loading">
                <h2>Safari Zone Laden...</h2>
            </div>
        );
    }

    return (
        <div className="safari-container">
            {/* 3D Canvas */}
            <Canvas
                shadows={false}
                dpr={[1, 1.5]}
                gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
                camera={{ position: [0, 2, 5], fov: 75 }}
                onCreated={({ gl }) => {
                    const canvas = gl.domElement;
                    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
                }}
            >
                {/* Only enable movement when not in an encounter */}
                <Suspense fallback={null}>
                    {!encounter && (
                        <PlayerControls3D
                            mapGrid={baseSafariGrid}
                            initialPos={{ x: 0, y: 0 }}
                            onLock={() => {
                                setIsLocked(true);
                                setShowInstructions(false);
                            }}
                            onUnlock={() => setIsLocked(false)}
                        />
                    )}
                    <WorldScene3DMain
                        mapGrid={baseSafariGrid}
                        onObjectClick={handlePokemonClick}
                        enableSky={false}
                    />

                    {pokemonList.slice(0, 8).map((p, i) => (
                        <PokemonSprite
                            key={`safari-mon-${p.id}-${i}`}
                            pokemon={p}
                            position={[
                                Math.sin(i * 0.5) * 10,
                                1,
                                Math.cos(i * 0.5) * 10
                            ]}
                            orbit={{
                                radius: 1.5 + (i % 3) * 0.4,
                                speed: 0.5 + i * 0.07,
                                phase: i * Math.PI * 0.25,
                                heightOffset: 0.15 * Math.sin(i * 0.8)
                            }}
                            onClick={handlePokemonClick}
                        />
                    ))}

                    {/* 3D Thrown Pokéball */}
                    {thrownBall && (
                        <Pokeball3D
                            startPos={[0, 1.6, 0]} // Camera height
                            targetPos={thrownBall.target}
                            onHit={onBallHit}
                        />
                    )}
                </Suspense>
            </Canvas>

            {/* 2D UI Overlay */}
            <div className="safari-ui-layer pointer-events-none">
                {/* Only show crosshair when locked in */}
                {isLocked && !encounter && <div className="crosshair">+</div>}

                {/* Back Button (top left) */}
                {!isLocked && !encounter && (
                    <button
                        className="btn-kenney back-btn pointer-events-auto"
                        onClick={() => navigate('/adventure')}
                        style={{ position: 'absolute', top: 20, left: 20 }}>

                        <ArrowLeft size={24} /> Verlaten
                    </button>
                )}

                {/* Click to Play instructions */}
                {!isLocked && !encounter && showInstructions && (
                    <div className="instructions-overlay pointer-events-auto">
                        <div className="instructions-modal game-panel">
                            <h2 style={{ fontFamily: '"Press Start 2P", cursive' }}>Safari Zone 3D</h2>
                            <p>Klik om te beginnen</p>
                            <p className="controls-hint">WASD om te bewegen, Muis om te kijken</p>
                            <p className="controls-hint">Klik op een Pokémon om hem te vangen!</p>
                        </div>
                    </div>
                )}

                {/* The Reused Encounter Modal! */}
                {encounter && (
                    <div className="encounter-overlay pointer-events-auto" style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)'
                    }}>
                        <EncounterModal
                            encounter={encounter}
                            catching={catching}
                            catchMessage={catchMessage}
                            onCatch={handleCatch}
                            onFlee={handleFlee}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useData } from '../../../contexts/DomainContexts';
import { PlayerControls3D } from '../components/PlayerControls3D';
import { WorldScene3D } from '../components/WorldScene3D';
import { EncounterModal } from '../components/EncounterModal';
import { Pokeball3D } from '../components/Pokeball3D';
import { useEncounter } from '../hooks/useEncounter';
import { ArrowLeft } from 'lucide-react';
import './SafariZone3D.css';

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

    const handlePokemonClick = (pokemon, targetPosition) => {
        if (thrownBall) return;

        // Start the throwing animation
        // Camera position is roughly our eyes
        setThrownBall({
            target: targetPosition,
            pokemon: pokemon
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
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
                {/* Only enable movement when not in an encounter */}
                {!encounter && (
                    <PlayerControls3D
                        onLock={() => {
                            setIsLocked(true);
                            setShowInstructions(false);
                        }}
                        onUnlock={() => setIsLocked(false)}
                    />
                )}
                <WorldScene3D
                    pokemonList={pokemonList}
                    onPokemonClick={handlePokemonClick}
                />

                {/* 3D Thrown Pokéball */}
                {thrownBall && (
                    <Pokeball3D
                        startPos={[0, 1.6, 0]} // Camera height
                        targetPos={thrownBall.target}
                        onHit={onBallHit}
                    />
                )}
            </Canvas>

            {/* 2D UI Overlay */}
            <div className="safari-ui-layer pointer-events-none">
                {/* Only show crosshair when locked in */}
                {isLocked && !encounter && <div className="crosshair">+</div>}

                {/* Back Button (top left) */}
                {!isLocked && !encounter && (
                    <button
                        className="btn-kenney back-btn pointer-events-auto"
                        onClick={() => navigate('/world')}
                        style={{ position: 'absolute', top: 20, left: 20 }}
                    >
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
                            pokemon={encounter}
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

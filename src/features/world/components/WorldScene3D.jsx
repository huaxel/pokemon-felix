import React, { useMemo } from 'react';
import { Sky, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PokemonSprite } from './PokemonSprite';

import grassTileImage from '../worldAssets/tile_0000.png';

export function WorldScene3D({ pokemonList, onPokemonClick }) {
    // Load floor texture and repeat it
    const grassTexture = useTexture(grassTileImage);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(50, 50);
    grassTexture.magFilter = THREE.NearestFilter;
    grassTexture.minFilter = THREE.NearestFilter;

    // Generate random spawning positions around the player
    const spawnPoints = useMemo(() => {
        // Only spawn up to 20 pokemon to not overwhelm the scene
        const amount = Math.min(pokemonList.length, 20);
        const spawns = [];

        // Create a deterministic seeded random if possible, or just Math.random for prototype
        for (let i = 0; i < amount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 25; // spawn between 5 and 30 units away
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // Randomly pick a pokemon from the list
            const mon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
            spawns.push({ position: [x, 1, z], pokemon: mon, id: i });
        }
        return spawns;
    }, [pokemonList]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

            <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial map={grassTexture} />
            </mesh>

            {/* Safari Walls (Invisible borders) */}
            <mesh position={[0, 5, -50]}>
                <boxGeometry args={[100, 10, 1]} />
                <meshBasicMaterial color="#2d1810" />
            </mesh>
            <mesh position={[0, 5, 50]}>
                <boxGeometry args={[100, 10, 1]} />
                <meshBasicMaterial color="#2d1810" />
            </mesh>
            <mesh position={[-50, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[100, 10, 1]} />
                <meshBasicMaterial color="#2d1810" />
            </mesh>
            <mesh position={[50, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[100, 10, 1]} />
                <meshBasicMaterial color="#2d1810" />
            </mesh>

            {/* Sprites */}
            {spawnPoints.map(spawn => (
                <PokemonSprite
                    key={spawn.id}
                    position={spawn.position}
                    pokemon={spawn.pokemon}
                    onClick={onPokemonClick}
                />
            ))}
        </>
    );
}

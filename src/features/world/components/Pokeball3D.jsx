import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { pokeballTile } from '../worldAssets';

/**
 * Pokeball3D
 * A 3D sphere with a Pokéball texture that follows a parabolic path.
 */
export function Pokeball3D({ startPos, targetPos, onComplete, onHit }) {
    const meshRef = useRef();
    const texture = useTexture(pokeballTile);

    if (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
    }

    const startTime = useRef(Date.now());
    const duration = 1000; // 1 second flight

    useFrame(() => {
        if (!meshRef.current) return;

        const elapsed = Date.now() - startTime.current;
        const t = Math.min(elapsed / duration, 1);

        // Parabolic interpolation
        const currentPos = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(...startPos),
            new THREE.Vector3(...targetPos),
            t
        );

        // Add height arc
        const height = Math.sin(t * Math.PI) * 2;
        currentPos.y += height;

        meshRef.current.position.copy(currentPos);

        // Rotate while flying
        meshRef.current.rotation.x += 0.1;
        meshRef.current.rotation.y += 0.1;

        if (t >= 1) {
            onComplete?.();
            onHit?.();
        }
    });

    return (
        <mesh ref={meshRef} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

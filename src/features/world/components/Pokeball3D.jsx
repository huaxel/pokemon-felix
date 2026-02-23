import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { pokeballTile } from '../worldAssets';

/**
 * Pokeball3D
 * A 3D sphere with a Pokéball texture that follows a parabolic path.
 */
export function Pokeball3D({ startPos = [0, 0, 0], targetPos = [0, 0, 0], onComplete, onHit }) {
    const meshRef = useRef();
    const texture = useTexture(pokeballTile);

    React.useLayoutEffect(() => {
        if (texture) {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.needsUpdate = true;
        }
    }, [texture]);

    const startTime = useRef(Date.now());
    const startVec = React.useMemo(() => new THREE.Vector3(...startPos), [startPos]);
    const targetVec = React.useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
    const currentVec = React.useMemo(() => new THREE.Vector3(), []);
    const duration = 1000; // 1 second flight

    useFrame(() => {
        if (!meshRef.current) return;

        const elapsed = Date.now() - startTime.current;
        const t = Math.min(elapsed / duration, 1);

        // Parabolic interpolation
        currentVec.lerpVectors(startVec, targetVec, t);

        // Add height arc
        const height = Math.sin(t * Math.PI) * 2;
        currentVec.y += height;

        meshRef.current.position.copy(currentVec);

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

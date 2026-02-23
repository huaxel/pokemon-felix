import React, { useRef, useMemo } from 'react';
import { Billboard, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * StaticBillboard
 * Renders a 2D sprite as a 3D billboard that faces the camera.
 * Used for trees, bushes, and other decorative elements.
 */
export function StaticBillboard({ image, position, scale = [1, 1], alphaTest = 0.5 }) {
    const texture = useTexture(image);
    const meshRef = useRef();

    const phase = useMemo(
        () => (position[0] * 12.9898 + position[2] * 78.233) % (Math.PI * 2),
        [position],
    );

    const halfHeight = scale[1] / 2;
    const shadowRadius = scale[0] * 0.45;

    React.useLayoutEffect(() => {
        if (texture) {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.needsUpdate = true;
        }
    }, [texture]);

    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.elapsedTime;
            const sway = Math.sin(t * 0.6 + phase) * 0.04;
            const lift = Math.sin(t * 1.4 + phase) * 0.04;
            meshRef.current.rotation.z = sway;
            meshRef.current.position.y = lift;
        }
    });

    return (
        <group position={position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -halfHeight + 0.01, 0]}
            >
                <circleGeometry args={[shadowRadius, 20]} />
                <meshBasicMaterial
                    color="black"
                    transparent={true}
                    opacity={0.35}
                />
            </mesh>
            <Billboard follow={true}>
                <mesh ref={meshRef}>
                    <planeGeometry args={[scale[0], scale[1]]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent={true}
                        alphaTest={alphaTest}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </Billboard>
        </group>
    );
}

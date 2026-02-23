import React, { useState, useRef } from 'react';
import { Billboard, useTexture, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * InteractiveBillboard
 * Renders a 2D sprite as a 3D billboard that reacts to clicks.
 * Used for buildings, NPCs, and quest items.
 */
export function InteractiveBillboard({
    image,
    position,
    scale = [2, 2],
    label,
    onClick,
    labelOffset = [0, 1.2, 0],
    bobbing = true
}) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();
    const texture = useTexture(image);

    React.useLayoutEffect(() => {
        if (texture) {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.needsUpdate = true;
        }
    }, [texture]);

    useFrame((state) => {
        if (bobbing && meshRef.current) {
            // Subtle sine wave for a "floating" look
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    return (
        <group position={position}>
            {/* Optional Label */}
            {label && (hovered || label.alwaysShow) && (
                <Billboard position={labelOffset}>
                    <Text
                        fontSize={0.2}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="#000000"
                    >
                        {label.text || label}
                    </Text>
                </Billboard>
            )}

            {/* Main Sprite */}
            <Billboard follow={true}>
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={hovered ? 1.05 : 1}
                >
                    <planeGeometry args={[scale[0], scale[1]]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent={true}
                        alphaTest={0.5}
                        side={THREE.DoubleSide}
                        color={hovered ? '#ffffff' : '#eeeeee'}
                    />
                </mesh>
            </Billboard>
        </group>
    );
}

import React, { useState, useRef } from 'react';
import { Billboard, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function PokemonSprite({ pokemon, position, onClick }) {
    // const texture = useTexture(pokemon.image);
    const meshRef = useRef();

    // To avoid blurry pixels, set texture filtering safely
    /*
    React.useLayoutEffect(() => {
        if (texture) {
            texture.magFilter = 1003; // THREE.NearestFilter
            texture.minFilter = 1003; // THREE.NearestFilter
            texture.needsUpdate = true;
        }
    }, [texture]);
    */

    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Wild pokemon bob up and down slightly
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
        }
    });

    return (
        <Billboard position={position} follow={true}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(pokemon);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                }}
                scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
            >
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial
                    color="red"
                    transparent={true}
                    alphaTest={0.5}
                    side={2} // THREE.DoubleSide
                />
            </mesh>
        </Billboard>
    );
}

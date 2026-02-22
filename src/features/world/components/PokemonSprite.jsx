import React, { useState } from 'react';
import { Billboard, useTexture } from '@react-three/drei';

export function PokemonSprite({ pokemon, position, onClick }) {
    const texture = useTexture(pokemon.image);

    // To avoid blurry pixels, set texture filtering
    texture.magFilter = 1003; // THREE.NearestFilter
    texture.minFilter = 1003; // THREE.NearestFilter

    const [hovered, setHovered] = useState(false);

    return (
        <Billboard position={position} follow={true}>
            <mesh
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
                    map={texture}
                    transparent={true}
                    alphaTest={0.5}
                    side={2} // THREE.DoubleSide
                />
            </mesh>
        </Billboard>
    );
}

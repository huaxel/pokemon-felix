import React, { useState, useRef, useMemo } from 'react';
import { Billboard, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PokemonSprite({ pokemon, position, onClick, orbit }) {
    const imageUrl = useMemo(
        () => pokemon.image || pokemon.sprites?.front_default || null,
        [pokemon],
    );

    const texture = useTexture(imageUrl || undefined);
    const groupRef = useRef();
    const meshRef = useRef();
    const shadowRef = useRef();

    // To avoid blurry pixels, set texture filtering safely
    React.useLayoutEffect(() => {
        if (texture && imageUrl) {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            texture.anisotropy = 1;
            texture.needsUpdate = true;
        }
    }, [texture, imageUrl]);

    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (groupRef.current) {
            let baseX = position[0];
            let baseY = position[1];
            let baseZ = position[2];

            if (orbit) {
                const radius = orbit.radius ?? 1.5;
                const speed = orbit.speed ?? 0.4;
                const heightOffset = orbit.heightOffset ?? 0;
                const phase = orbit.phase ?? 0;

                baseX += Math.cos(t * speed + phase) * radius;
                baseZ += Math.sin(t * speed + phase) * radius;
                baseY += heightOffset;
            }

            const bobOffset = Math.sin(t * 3) * 0.1;
            groupRef.current.position.set(
                baseX,
                baseY + bobOffset,
                baseZ,
            );
        }

        if (meshRef.current) {
            const baseScale = hovered ? 1.2 : 1;
            const breathe = 1 + 0.05 * Math.sin(t * 2);
            const finalScale = baseScale * breathe;

            meshRef.current.scale.set(finalScale, finalScale, finalScale);

            const tiltAmount = hovered ? 0.18 : 0.1;
            meshRef.current.rotation.x = Math.sin(t * 1.5) * tiltAmount;
        }

        if (shadowRef.current) {
            const shadowScale = hovered ? 1.1 : 1;
            const shadowSquash = 1 + 0.2 * Math.abs(Math.sin(t * 3));
            shadowRef.current.scale.set(
                shadowScale * shadowSquash,
                shadowScale,
                shadowScale * shadowSquash,
            );

            const material = shadowRef.current.material;
            if (material) {
                const baseOpacity = hovered ? 0.5 : 0.35;
                const bobInfluence = 0.1 * (1 - Math.abs(Math.sin(t * 3)));
                material.opacity = baseOpacity + bobInfluence;
            }
        }
    });

    return (
        <group ref={groupRef}>
            <Billboard follow={true}>
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(pokemon, position);
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
            <mesh
                ref={shadowRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.01, 0]}
            >
                <circleGeometry args={[0.7, 16]} />
                <meshBasicMaterial
                    color="black"
                    transparent={true}
                    opacity={hovered ? 0.5 : 0.35}
                />
            </mesh>
        </group>
    );
}

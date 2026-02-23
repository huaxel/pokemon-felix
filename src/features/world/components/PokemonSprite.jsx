import React, { useState, useRef, useMemo } from 'react';
import { Billboard, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TYPE_AURA_COLORS = {
  normal: '#a8a77a',
  fire: '#ee8130',
  water: '#6390f0',
  electric: '#f7d02c',
  grass: '#7ac74c',
  ice: '#96d9d6',
  fighting: '#c22e28',
  poison: '#a33ea1',
  ground: '#e2bf65',
  flying: '#a98ff3',
  psychic: '#f95587',
  bug: '#a6b91a',
  rock: '#b6a136',
  ghost: '#735797',
  dragon: '#6f35fc',
  dark: '#705746',
  steel: '#b7b7ce',
  fairy: '#d685ad',
};

export function PokemonSprite({ pokemon, position, onClick, orbit }) {
  const imageUrl = useMemo(
    () => pokemon.image || pokemon.sprites?.front_default || null,
    [pokemon]
  );

  const mainType = useMemo(() => pokemon?.types?.[0]?.type?.name || 'normal', [pokemon]);

  const auraColor = useMemo(() => TYPE_AURA_COLORS[mainType] || '#000000', [mainType]);

  const baseSize = useMemo(() => {
    const h = pokemon && typeof pokemon.height === 'number' ? pokemon.height : null;
    if (!h) return 1;
    const normalized = h / 20;
    if (normalized < 0.7) return 0.7;
    if (normalized > 1.6) return 1.6;
    return normalized;
  }, [pokemon]);

  const motionProfile = useMemo(() => {
    const id = pokemon && typeof pokemon.id === 'number' ? pokemon.id : 0;
    const phase1 = (id * 0.37) % (Math.PI * 2);
    const phase2 = (id * 0.73) % (Math.PI * 2);
    const ampJitter = 0.85 + (id % 7) / 40;
    return { phase1, phase2, ampJitter };
  }, [pokemon]);

  const texture = useTexture(imageUrl || undefined);
  const groupRef = useRef();
  const meshRef = useRef();
  const shadowRef = useRef();
  const clickTimeRef = useRef(null);

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

  useFrame(state => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;

    let clickOffset = 0;
    if (clickTimeRef.current !== null) {
      const dt = now - clickTimeRef.current;
      const duration = 0.4;
      if (dt < duration) {
        const phase = (dt / duration) * Math.PI;
        clickOffset = Math.sin(phase) * 0.18 * motionProfile.ampJitter;
      } else {
        clickTimeRef.current = null;
      }
    }

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

      const bobOffset = Math.sin(t * 3 + motionProfile.phase1) * 0.1 * motionProfile.ampJitter;
      groupRef.current.position.set(baseX, baseY + bobOffset + clickOffset, baseZ);
    }

    if (meshRef.current) {
      const baseScale = (hovered ? 1.2 : 1) * baseSize;
      const breathe = 1 + 0.05 * Math.sin(t * 2 + motionProfile.phase2);
      const finalScale = baseScale * breathe;

      meshRef.current.scale.set(finalScale, finalScale, finalScale);

      const tiltAmount = hovered ? 0.18 : 0.1;
      meshRef.current.rotation.x = Math.sin(t * 1.5) * tiltAmount;
    }

    if (shadowRef.current) {
      const shadowScale = hovered ? 1.1 : 1;
      const shadowSquash = 1 + 0.2 * Math.abs(Math.sin(t * 3 + motionProfile.phase1));
      shadowRef.current.scale.set(
        shadowScale * shadowSquash,
        shadowScale,
        shadowScale * shadowSquash
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
          onClick={e => {
            e.stopPropagation();
            clickTimeRef.current = performance.now() / 1000;
            if (onClick) {
              onClick(pokemon, position);
            }
          }}
          onPointerOver={e => {
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
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.7, 16]} />
        <meshBasicMaterial color="black" transparent={true} opacity={hovered ? 0.5 : 0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial color={auraColor} transparent={true} opacity={hovered ? 0.35 : 0.18} />
      </mesh>
    </group>
  );
}

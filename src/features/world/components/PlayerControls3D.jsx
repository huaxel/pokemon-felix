import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

import { TILE_TYPES } from '../worldConstants';

export function PlayerControls3D({ onLock, onUnlock, mapGrid, initialPos, onPositionChange }) {
    const { camera } = useThree();
    const controlsRef = useRef();
    const lastGridPos = useRef({ x: Math.round(initialPos?.x || 0), y: Math.round(initialPos?.y || 0) });

    // Movement state
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    setMovement((m) => ({ ...m, forward: true }));
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    setMovement((m) => ({ ...m, left: true }));
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    setMovement((m) => ({ ...m, backward: true }));
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    setMovement((m) => ({ ...m, right: true }));
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    setMovement((m) => ({ ...m, forward: false }));
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    setMovement((m) => ({ ...m, left: false }));
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    setMovement((m) => ({ ...m, backward: false }));
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    setMovement((m) => ({ ...m, right: false }));
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const speed = 10;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame((state, delta) => {
        if (!controlsRef.current || !controlsRef.current.isLocked) return;

        // Save current position
        const oldX = camera.position.x;
        const oldZ = camera.position.z;

        // Determine movement vectors
        frontVector.set(0, 0, Number(movement.backward) - Number(movement.forward));
        sideVector.set(Number(movement.left) - Number(movement.right), 0, 0);

        // Combine vectors and normalize
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta);

        // Apply movement horizontally
        controlsRef.current.moveRight(-direction.x);
        controlsRef.current.moveForward(-direction.z);

        // Collision detection (Grid based)
        const nextX = camera.position.x;
        const nextZ = camera.position.z;

        const gridX = Math.round(nextX);
        const gridZ = Math.round(nextZ);

        // Check bounds
        const isOutOfBounds = !mapGrid || !mapGrid[0] || gridX < 0 || gridX >= mapGrid[0].length || gridZ < 0 || gridZ >= mapGrid.length;

        let shouldBounce = isOutOfBounds;
        if (!isOutOfBounds) {
            const tileType = mapGrid[gridZ][gridX];
            // Solid tiles: House, Trees, Walls
            if (tileType === TILE_TYPES.HOUSE || tileType === TILE_TYPES.TREE || tileType === TILE_TYPES.GYM) {
                shouldBounce = true;
            }
        }

        if (shouldBounce) {
            // Restore position
            camera.position.x = oldX;
            camera.position.z = oldZ;
        } else {
            // Sync with game state if grid position changed
            if (gridX !== lastGridPos.current.x || gridZ !== lastGridPos.current.y) {
                lastGridPos.current = { x: gridX, y: gridZ };
                onPositionChange?.({ x: gridX, y: gridZ });
            }
        }

        // Keep camera at fixed eye height
        camera.position.y = 1.6;
    });

    return (
        <PointerLockControls
            ref={controlsRef}
            onLock={onLock}
            onUnlock={onUnlock}
        />
    );
}

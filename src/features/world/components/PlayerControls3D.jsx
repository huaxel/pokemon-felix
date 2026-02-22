import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

export function PlayerControls3D({ onLock, onUnlock }) {
    const { camera } = useThree();
    const controlsRef = useRef();

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

    const speed = 15;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame((state, delta) => {
        if (!controlsRef.current || !controlsRef.current.isLocked) return;

        // Determine movement vectors
        frontVector.set(0, 0, Number(movement.backward) - Number(movement.forward));
        sideVector.set(Number(movement.left) - Number(movement.right), 0, 0);

        // Combine vectors and normalize
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed * delta);

        // Apply movement against camera orientation
        controlsRef.current.moveRight(-direction.x);
        controlsRef.current.moveForward(-direction.z);

        // Keep camera at fixed eye height
        camera.position.y = 2;
    });

    return (
        <PointerLockControls
            ref={controlsRef}
            onLock={onLock}
            onUnlock={onUnlock}
        />
    );
}

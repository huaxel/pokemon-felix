import { Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * StaticBillboard
 * Renders a 2D sprite as a 3D billboard that faces the camera.
 * Used for trees, bushes, and other decorative elements.
 */
export function StaticBillboard({ image, position, scale = [1, 1], alphaTest = 0.5 }) {
    const texture = useTexture(image);

    // Ensure the texture is pixelated for that retro look
    if (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
    }

    return (
        <Billboard position={position} follow={true}>
            <mesh>
                <planeGeometry args={[scale[0], scale[1]]} />
                <meshBasicMaterial
                    map={texture}
                    transparent={true}
                    alphaTest={alphaTest}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </Billboard>
    );
}

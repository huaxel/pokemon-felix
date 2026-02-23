import React, { useMemo } from 'react';
import { Sky, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TILE_TYPES } from '../worldConstants';
import {
    grassTile, pathTile,
    houseTile, houseTile2, treeTile, gymTile, marketTile, cityHallTile,
    shopUrbanTile, fishermanTile, caveEntranceTile, desertCactusTile,
    professorTile, sandTile, snowTile, waterCenterTile
} from '../worldAssets';
import { StaticBillboard } from './StaticBillboard';
import { InteractiveBillboard } from './InteractiveBillboard';

const BUILDING_ASSETS = {
    [TILE_TYPES.HOUSE]: houseTile,
    [TILE_TYPES.CENTER]: cityHallTile,
    [TILE_TYPES.TREE]: treeTile,
    [TILE_TYPES.GACHA]: marketTile,
    [TILE_TYPES.GYM]: gymTile,
    [TILE_TYPES.MARKET]: marketTile,
    [TILE_TYPES.EVOLUTION]: cityHallTile,
    [TILE_TYPES.FISHERMAN]: fishermanTile,
    [TILE_TYPES.SCHOOL]: cityHallTile,
    [TILE_TYPES.WARDROBE]: shopUrbanTile,
    [TILE_TYPES.BANK]: cityHallTile,
    [TILE_TYPES.POTION_LAB]: houseTile2,
    [TILE_TYPES.PALACE]: cityHallTile,
    [TILE_TYPES.EVOLUTION_HALL]: cityHallTile,
    [TILE_TYPES.MOUNTAIN]: gymTile,
    [TILE_TYPES.SECRET_CAVE]: caveEntranceTile,
    [TILE_TYPES.URBAN_SHOP]: shopUrbanTile,
    [TILE_TYPES.ART_STUDIO]: houseTile2,
    [TILE_TYPES.CITY_HALL]: cityHallTile,
};

export function WorldScene3DMain({
    mapGrid,
    onObjectClick
}) {
    const grassTex = useTexture(grassTile);
    const pathTex = useTexture(pathTile);
    const waterTex = useTexture(waterCenterTile);
    const sandTex = useTexture(sandTile);
    const snowTex = useTexture(snowTile);

    React.useLayoutEffect(() => {
        [grassTex, pathTex, waterTex, sandTex, snowTex].forEach(t => {
            if (t) {
                t.magFilter = THREE.NearestFilter;
                t.minFilter = THREE.NearestFilter;
                t.wrapS = THREE.RepeatWrapping;
                t.wrapT = THREE.RepeatWrapping;
                t.needsUpdate = true;
            }
        });
    }, [grassTex, pathTex, waterTex, sandTex, snowTex]);

    const loadedTextures = useMemo(() => {
        return {
            [TILE_TYPES.GRASS]: grassTex,
            [TILE_TYPES.PATH]: pathTex,
            [TILE_TYPES.WATER]: waterTex,
            [TILE_TYPES.SAND]: sandTex,
            [TILE_TYPES.SNOW]: snowTex,
        };
    }, [grassTex, pathTex, waterTex, sandTex, snowTex]);

    const getGroundMaterial = (type) => {
        const texture = loadedTextures[type] || loadedTextures[TILE_TYPES.GRASS];
        let color = new THREE.Color(1, 1, 1);

        if (type === TILE_TYPES.SAND) color = new THREE.Color(1, 0.95, 0.7);
        if (type === TILE_TYPES.SNOW) color = new THREE.Color(0.9, 0.9, 1.1);

        return (
            <meshStandardMaterial
                map={texture}
                color={color}
                transparent={type === TILE_TYPES.WATER}
                opacity={type === TILE_TYPES.WATER ? 0.7 : 1}
            />
        );
    };

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
            <Sky sunPosition={[100, 10, 100]} />

            {/* Ground Tiles */}
            {mapGrid.map((row, y) =>
                row.map((tile, x) => (
                    <mesh key={`ground-${x}-${y}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, y]} receiveShadow>
                        <planeGeometry args={[1, 1]} />
                        {getGroundMaterial(tile)}
                    </mesh>
                ))
            )}

            {/* Persistent Objects (Buildings, Trees) */}
            {mapGrid.map((row, y) =>
                row.map((tile, x) => {
                    if (tile === TILE_TYPES.TREE) {
                        return (
                            <StaticBillboard
                                key={`tree-${x}-${y}`}
                                image={treeTile}
                                position={[x, 0.5, y]}
                                scale={[1, 1]}
                            />
                        );
                    }

                    const buildingImg = BUILDING_ASSETS[tile];
                    if (buildingImg && tile !== TILE_TYPES.TREE) {
                        return (
                            <InteractiveBillboard
                                key={`building-${x}-${y}`}
                                image={buildingImg}
                                position={[x, 1, y]}
                                scale={[2, 2]}
                                label={Object.keys(TILE_TYPES).find(key => TILE_TYPES[key] === tile)}
                                onClick={() => onObjectClick?.(x, y, tile)}
                            />
                        );
                    }

                    if (x === 5 && y === 5) {
                        return (
                            <InteractiveBillboard
                                key="npc-professor"
                                image={professorTile}
                                position={[x, 0.6, y]}
                                scale={[1, 1]}
                                label="Prof. Felix"
                                onClick={() => onObjectClick?.(x, y, 'NPC_PROFESSOR')}
                            />
                        );
                    }

                    return null;
                })
            )}

            {/* Desert Cacti */}
            {mapGrid.map((row, y) =>
                row.map((tile, x) => {
                    if (tile === TILE_TYPES.DESERT) {
                        return (
                            <StaticBillboard
                                key={`cactus-${x}-${y}`}
                                image={desertCactusTile}
                                position={[x, 0.5, y]}
                                scale={[1, 1]}
                            />
                        );
                    }
                    return null;
                })
            )}
        </>
    );
}

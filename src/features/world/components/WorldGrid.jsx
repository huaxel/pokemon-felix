import React from 'react';
import { TILE_TYPES } from '../worldConstants';

// Building Assets
import gachaImage from '../../../assets/buildings/gacha_machine.png';
import marketImage from '../../../assets/buildings/market_stall.png';
import gymImage from '../../../assets/buildings/gym_building.png';
import evoImage from '../../../assets/buildings/evo_lab.png';
import houseImage from '../../../assets/buildings/house.png';
import centerImage from '../../../assets/buildings/pokecenter.png';
import treeImage from '../../../assets/buildings/tree.png';
import waterEdgeImage from '../../../assets/buildings/water_edge.png';
import waterCenterImage from '../../../assets/buildings/water_center.png';
import fishermanImage from '../../../assets/buildings/fisherman.png';
import cityHallImage from '../../../assets/buildings/city_hall.png';
import shopUrbanImage from '../../../assets/buildings/shop_urban.png';
import playerSprite from '../../../assets/kenney_roguelike-characters/Spritesheet/roguelikeChar_transparent.png';
import grassTile from '../../../assets/kenney_tiny-town/Tiles/tile_0000.png';
import pathTile from '../../../assets/kenney_tiny-town/Tiles/tile_0008.png';
import waterTile from '../../../assets/kenney_tiny-town/Tiles/tile_0032.png';

export function WorldGrid({
    mapGrid,
    playerPos,
    playerName,
    playerColor,
    treasures,
    isBuildMode,
    handleTileClick,
    seasonStyle
}) {
    const getTileContent = (type, x, y) => {
        if (x === playerPos.x && y === playerPos.y) {
            return (
                <div className="player-sprite-container">
                    <span className="player-name-label">{playerName}</span>
                    <div className="player-avatar" style={{ backgroundColor: playerColor }}>
                        <img src={playerSprite} alt="player" className="player-sprite" />
                    </div>
                </div>
            );
        }

        // Schat
        if (treasures.some(t => t.x === x && t.y === y)) return 'T';

        // Professor Eik op (5, 5)
        if (x === 5 && y === 5) return 'Prof';

        switch (type) {
            case TILE_TYPES.GRASS: return null;
            case TILE_TYPES.PATH: return null;
            case TILE_TYPES.HOUSE: return <img src={houseImage} className="building-sprite" alt="House" />;
            case TILE_TYPES.CENTER: return <img src={centerImage} className="building-sprite" alt="Center" />;
            case TILE_TYPES.TREE: return <img src={treeImage} className="building-sprite" alt="Tree" />;
            case TILE_TYPES.GACHA: return <img src={gachaImage} className="building-sprite" alt="Gacha" />;
            case TILE_TYPES.GYM: return <img src={gymImage} className="building-sprite" alt="Gym" />;
            case TILE_TYPES.MARKET: return <img src={marketImage} className="building-sprite" alt="Markt" />;
            case TILE_TYPES.EVOLUTION: return <img src={evoImage} className="building-sprite" alt="Evolutie" />;
            case TILE_TYPES.WATER: return <img src={mapGrid[y][x - 1] === TILE_TYPES.WATER ? waterCenterImage : waterEdgeImage} className="water-sprite" alt="Water" />;
            case TILE_TYPES.FISHERMAN: return <img src={fishermanImage} className="building-sprite" alt="Fisherman" />;
            case TILE_TYPES.SCHOOL: return <img src={cityHallImage} className="building-sprite" alt="School" />;
            case TILE_TYPES.WARDROBE: return <img src={shopUrbanImage} className="building-sprite" alt="Wardrobe" />;
            case TILE_TYPES.BANK: return <img src={centerImage} className="building-sprite" alt="Bank" />; // Using center as placeholder
            case TILE_TYPES.POTION_LAB: return <img src={evoImage} className="building-sprite" alt="Potion Lab" />;
            case TILE_TYPES.FOUNTAIN: return <img src={waterCenterImage} className="building-sprite" alt="Fountain" />;
            case TILE_TYPES.PALACE: return <img src={cityHallImage} className="building-sprite" alt="Palace" />;
            case TILE_TYPES.EVOLUTION_HALL: return <img src={evoImage} className="building-sprite" alt="Evolution Hall" />;
            case TILE_TYPES.MOUNTAIN: return <img src={gymImage} className="building-sprite" alt="Mountain" />;
            case TILE_TYPES.SECRET_CAVE: return <img src={houseImage} className="building-sprite" alt="Secret Cave" />;
            case TILE_TYPES.WATER_ROUTE: return <img src={waterCenterImage} className="building-sprite" alt="Water Route" />;
            case TILE_TYPES.CITY_HALL: return <img src={cityHallImage} className="building-sprite" alt="City Hall" />;
            case TILE_TYPES.URBAN_SHOP: return <img src={shopUrbanImage} className="building-sprite" alt="Urban Shop" />;
            default: return null;
        }
    };

    const getTileStyle = (type) => {
        if (type === TILE_TYPES.GRASS) {
            return { backgroundImage: `url(${grassTile})`, backgroundSize: 'cover' };
        }
        if (type === TILE_TYPES.PATH) {
            return { backgroundImage: `url(${pathTile})`, backgroundSize: 'cover' };
        }
        if (type === TILE_TYPES.WATER) {
            return { backgroundImage: `url(${waterTile})`, backgroundSize: 'cover' };
        }
        return {};
    };

    return (
        <div className="map-grid" style={{ backgroundColor: seasonStyle.grass, borderColor: '#475569' }}>
            {mapGrid.map((row, y) => (
                <div key={y} className="map-row">
                    {row.map((tile, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={`tile type-${tile} ${isBuildMode ? 'buildable' : ''}`}
                            onClick={() => handleTileClick(x, y)}
                            style={{
                                ...(tile === TILE_TYPES.TREE || tile === TILE_TYPES.GRASS ? { color: seasonStyle.tree } : {}),
                                ...getTileStyle(tile)
                            }}
                        >
                            {getTileContent(tile, x, y)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

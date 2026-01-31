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
import fishermanImage from '../../../assets/kenney_rpg-urban-pack/Tiles/tile_0200.png';
import cityHallImage from '../../../assets/kenney_rpg-urban-pack/Tiles/tile_0150.png';
import shopUrbanImage from '../../../assets/kenney_rpg-urban-pack/Tiles/tile_0170.png';
import caveEntranceTile from '../../../assets/kenney_tiny-town/Tiles/tile_0110.png';
import desertCactusTile from '../../../assets/kenney_tiny-town/Tiles/tile_0083.png';
import chestTile from '../../../assets/kenney_tiny-town/Tiles/tile_0089.png';
import roguelikeSheet from '../../../assets/kenney_roguelike-characters/Spritesheet/roguelikeChar_transparent.png';
import grassTile from '../../../assets/kenney_tiny-town/Tiles/tile_0000.png';
import pathTile from '../../../assets/kenney_tiny-town/Tiles/tile_0008.png';
import waterTile from '../../../assets/kenney_tiny-town/Tiles/tile_0032.png';
import pokeballImage from '../../../assets/items/pokeball.png';
import artStudioImage from '../../../assets/buildings/art_studio_building.png';

const BUILDING_IMAGES = {
    [TILE_TYPES.HOUSE]: houseImage, [TILE_TYPES.CENTER]: centerImage, [TILE_TYPES.TREE]: treeImage,
    [TILE_TYPES.GACHA]: gachaImage, [TILE_TYPES.GYM]: gymImage, [TILE_TYPES.MARKET]: marketImage,
    [TILE_TYPES.EVOLUTION]: evoImage, [TILE_TYPES.FISHERMAN]: fishermanImage, [TILE_TYPES.SCHOOL]: cityHallImage,
    [TILE_TYPES.WARDROBE]: shopUrbanImage, [TILE_TYPES.BANK]: centerImage, [TILE_TYPES.POTION_LAB]: evoImage,
    [TILE_TYPES.FOUNTAIN]: waterCenterImage, [TILE_TYPES.PALACE]: cityHallImage, [TILE_TYPES.EVOLUTION_HALL]: evoImage,
    [TILE_TYPES.MOUNTAIN]: gymImage, [TILE_TYPES.SECRET_CAVE]: houseImage, [TILE_TYPES.WATER_ROUTE]: waterCenterImage,
    [TILE_TYPES.CITY_HALL]: cityHallImage, [TILE_TYPES.URBAN_SHOP]: shopUrbanImage,
    [TILE_TYPES.CITY_HALL]: cityHallImage, [TILE_TYPES.URBAN_SHOP]: shopUrbanImage,
    // Desert and Mountain will be handled via CSS filters
};

const PlayerSprite = ({ name, color }) => (
    <div className="player-sprite-container">
        <span className="player-name-label">{name}</span>
        <div className="player-avatar" style={{ backgroundColor: color }}>
            <div style={{ width: '16px', height: '16px', backgroundImage: `url(${roguelikeSheet})`, backgroundPosition: '0 0', backgroundSize: '912px 368px', transform: 'scale(1.5)', imageRendering: 'pixelated' }} />
        </div>
    </div>
);

const NPCSprite = () => (
    <div className="npc-sprite" title="Professor Eik" style={{ width: '16px', height: '16px', backgroundImage: `url(${roguelikeSheet})`, backgroundPosition: '0 -16px', backgroundSize: '912px 368px', transform: 'scale(1.8)', imageRendering: 'pixelated', filter: 'sepia(0.5)' }} />
);

export function WorldGrid({
    mapGrid, playerPos, playerName, playerColor, treasures, pokeballs, isBuildMode, handleTileClick, seasonStyle
}) {
    const getTileContent = (type, x, y) => {
        if (x === playerPos.x && y === playerPos.y) return <PlayerSprite name={playerName} color={playerColor} />;
        if (treasures.some(t => t.x === x && t.y === y)) return <img src={chestTile} className="item-sprite" alt="T" style={{ width: '80%', height: '80%', imageRendering: 'pixelated' }} />;
        if (pokeballs && pokeballs.some(p => p.x === x && p.y === y)) return <img src={pokeballImage} className="item-sprite pokeball-sprite" alt="P" style={{ width: '60%', height: '60%', imageRendering: 'pixelated', cursor: 'pointer' }} />;
        if (x === 5 && y === 5) return <NPCSprite />;
        if (type === TILE_TYPES.WATER) return <img src={mapGrid[y][x - 1] === TILE_TYPES.WATER ? waterCenterImage : waterEdgeImage} className="water-sprite" alt="W" />;
        if (type === TILE_TYPES.ART_STUDIO) return <img src={artStudioImage} className="building-sprite" alt="Art Studio" />;
        if (type === TILE_TYPES.ART_STUDIO) return <img src={artStudioImage} className="building-sprite" alt="Art Studio" />;
        if (type === TILE_TYPES.CAVE_DUNGEON) return <img src={caveEntranceTile} className="building-sprite" alt="Cave" style={{ imageRendering: 'pixelated' }} />;
        if (type === TILE_TYPES.DESERT) return <img src={desertCactusTile} className="building-sprite" alt="Desert" style={{ imageRendering: 'pixelated' }} />;
        const img = BUILDING_IMAGES[type];
        return img ? <img src={img} className="building-sprite" alt={type} /> : null;
    };

    const getTileStyle = (type) => {
        if (type === TILE_TYPES.SAND) {
            return { backgroundImage: `url(${grassTile})`, backgroundSize: 'cover', filter: 'sepia(1) hue-rotate(-50deg) saturate(1.5) brightness(1.1)' };
        }
        if (type === TILE_TYPES.SNOW) {
            return { backgroundImage: `url(${grassTile})`, backgroundSize: 'cover', filter: 'hue-rotate(180deg) brightness(1.5) saturate(0.5)' };
        }
        const bg = { [TILE_TYPES.GRASS]: grassTile, [TILE_TYPES.PATH]: pathTile, [TILE_TYPES.WATER]: waterTile }[type];
        return bg ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover' } : {};
    };

    return (
        <div className="map-grid" style={{ backgroundColor: seasonStyle.grass, borderColor: '#475569' }}>
            {mapGrid.map((row, y) => (
                <div key={y} className="map-row">
                    {row.map((tile, x) => (
                        <div key={`${x}-${y}`} className={`tile type-${tile} ${isBuildMode ? 'buildable' : ''}`} onClick={() => handleTileClick(x, y)} style={{ ...(tile === TILE_TYPES.TREE || tile === TILE_TYPES.GRASS ? { color: seasonStyle.tree } : {}), ...getTileStyle(tile) }}>
                            {getTileContent(tile, x, y)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

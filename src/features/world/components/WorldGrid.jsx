import { TILE_TYPES } from '../worldConstants';
import {
  grassTile,
  pathTile,
  waterTile,
  waterEdgeTile,
  waterCenterTile,
  houseTile,
  houseTile2,
  treeTile,
  centerTile,
  marketTile,
  gymTile,
  cityHallTile,
  shopUrbanTile,
  fishermanTile,
  caveEntranceTile,
  desertCactusTile,
  chestTile,
  pokeballTile,
  roguelikeSheet,
} from '../worldAssets';

const BUILDING_IMAGES = {
  [TILE_TYPES.HOUSE]: houseTile,
  [TILE_TYPES.CENTER]: centerTile,
  [TILE_TYPES.TREE]: treeTile,
  [TILE_TYPES.GACHA]: marketTile, // Reuse market for Gacha
  [TILE_TYPES.GYM]: gymTile,
  [TILE_TYPES.MARKET]: marketTile,
  [TILE_TYPES.EVOLUTION]: cityHallTile, // Reuse City Hall
  [TILE_TYPES.FISHERMAN]: fishermanTile,
  [TILE_TYPES.SCHOOL]: cityHallTile,
  [TILE_TYPES.WARDROBE]: shopUrbanTile,
  [TILE_TYPES.BANK]: centerTile,
  [TILE_TYPES.POTION_LAB]: houseTile2,
  [TILE_TYPES.FOUNTAIN]: waterCenterTile,
  [TILE_TYPES.PALACE]: cityHallTile,
  [TILE_TYPES.EVOLUTION_HALL]: cityHallTile,
  [TILE_TYPES.MOUNTAIN]: gymTile,
  [TILE_TYPES.SECRET_CAVE]: caveEntranceTile,
  [TILE_TYPES.WATER_ROUTE]: waterCenterTile,
  [TILE_TYPES.CITY_HALL]: cityHallTile,
  [TILE_TYPES.URBAN_SHOP]: shopUrbanTile,
  [TILE_TYPES.ART_STUDIO]: houseTile2,
};

const PlayerSprite = ({ name, color }) => (
  <div className="player-sprite-container">
    <span className="player-name-label">{name}</span>
    <div className="player-avatar" style={{ backgroundColor: color }}>
      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundImage: `url(${roguelikeSheet})`,
          backgroundPosition: '0 0',
          backgroundSize: '912px 368px',
          transform: 'scale(1.5)',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  </div>
);

const NPCSprite = () => (
  <div
    className="npc-sprite"
    title="Professor Eik"
    style={{
      width: '16px',
      height: '16px',
      backgroundImage: `url(${roguelikeSheet})`,
      backgroundPosition: '0 -16px',
      backgroundSize: '912px 368px',
      transform: 'scale(1.8)',
      imageRendering: 'pixelated',
      filter: 'sepia(0.5)',
    }}
  />
);

export function WorldGrid({
  mapGrid,
  playerPos,
  playerName,
  playerColor,
  treasures,
  pokeballs,
  isBuildMode,
  handleTileClick,
  seasonStyle,
}) {
  const getTileContent = (type, x, y) => {
    if (x === playerPos.x && y === playerPos.y)
      return <PlayerSprite name={playerName} color={playerColor} />;
    if (treasures.some(t => t.x === x && t.y === y))
      return (
        <img
          src={chestTile}
          className="item-sprite"
          alt="T"
          style={{ width: '80%', height: '80%', imageRendering: 'pixelated' }}
        />
      );
    if (pokeballs && pokeballs.some(p => p.x === x && p.y === y))
      return (
        <img
          src={pokeballTile}
          className="item-sprite pokeball-sprite"
          alt="P"
          style={{ width: '60%', height: '60%', imageRendering: 'pixelated', cursor: 'pointer' }}
        />
      );
    if (x === 5 && y === 5) return <NPCSprite />;
    if (type === TILE_TYPES.WATER)
      return (
        <img
          src={mapGrid[y][x - 1] === TILE_TYPES.WATER ? waterCenterTile : waterEdgeTile}
          className="water-sprite"
          alt="W"
        />
      );
    if (type === TILE_TYPES.ART_STUDIO)
      return <img src={houseTile2} className="building-sprite" alt="Art Studio" />;
    if (type === TILE_TYPES.CAVE_DUNGEON)
      return (
        <img
          src={caveEntranceTile}
          className="building-sprite"
          alt="Cave"
          style={{ imageRendering: 'pixelated' }}
        />
      );
    if (type === TILE_TYPES.DESERT)
      return (
        <img
          src={desertCactusTile}
          className="building-sprite"
          alt="Desert"
          style={{ imageRendering: 'pixelated' }}
        />
      );
    const img = BUILDING_IMAGES[type];
    return img ? <img src={img} className="building-sprite" alt={type} /> : null;
  };

  const getTileStyle = type => {
    if (type === TILE_TYPES.SAND) {
      return {
        backgroundImage: `url(${grassTile})`,
        backgroundSize: 'cover',
        filter: 'sepia(1) hue-rotate(-50deg) saturate(1.5) brightness(1.1)',
      };
    }
    if (type === TILE_TYPES.SNOW) {
      return {
        backgroundImage: `url(${grassTile})`,
        backgroundSize: 'cover',
        filter: 'hue-rotate(180deg) brightness(1.5) saturate(0.5)',
      };
    }
    const bg = {
      [TILE_TYPES.GRASS]: grassTile,
      [TILE_TYPES.PATH]: pathTile,
      [TILE_TYPES.WATER]: waterTile,
    }[type];
    return bg ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover' } : {};
  };

  return (
    <div
      className="map-grid"
      style={{ backgroundColor: seasonStyle.grass, borderColor: '#475569' }}
    >
      {mapGrid.map((row, y) => (
        <div key={y} className="map-row">
          {row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              className={`tile type-${tile} ${isBuildMode ? 'buildable' : ''}`}
              onClick={() => handleTileClick(x, y)}
              style={{
                ...(tile === TILE_TYPES.TREE || tile === TILE_TYPES.GRASS
                  ? { color: seasonStyle.tree }
                  : {}),
                ...getTileStyle(tile),
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

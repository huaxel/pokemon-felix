/**
 * World Page Constants
 * Extracted from WorldPage.jsx to follow DRY and KISS principles
 */

// Time System
export const TIME_CONFIG = {
  NIGHT_START_HOUR: 20,
  NIGHT_END_HOUR: 6,
  TIME_CHECK_INTERVAL: 60000, // 1 minute
};

// Treasure System
export const TREASURE_CONFIG = {
  MAX_TREASURES: 3,
  SPAWN_CHANCE: 0.3,
  SPAWN_INTERVAL: 10000, // 10 seconds
  REWARD_AMOUNT: 100,
};

// Pokeball System
export const POKEBALL_CONFIG = {
  MAX_POKEBALLS: 2,
  SPAWN_CHANCE: 0.2,
  SPAWN_INTERVAL: 15000, // 15 seconds
  REWARD_AMOUNT: 250,
};

// GPS System
export const GPS_CONFIG = {
  REWARD_AMOUNT: 500,
};

// Rewards
export const REWARDS = {
  TREASURE: 100,
  POKEBALL: 250,
  GPS_TREASURE: 500,
  GRASS_COINS: 20,
  QUEST_COMPLETION: 500,
};

// Tile Types
export const TILE_TYPES = {
  GRASS: 0,
  PATH: 1,
  HOUSE: 2,
  CENTER: 3,
  TREE: 4,
  GACHA: 5,
  SQUAD: 6,
  GYM: 7,
  MARKET: 8,
  EVOLUTION: 9,
  WATER: 10,
  FISHERMAN: 11,
  SCHOOL: 12,
  CITY_HALL: 13,
  WARDROBE: 14,
  URBAN_SHOP: 15,
  BANK: 16,
  POTION_LAB: 17,
  FOUNTAIN: 18,
  PALACE: 19,
  EVOLUTION_HALL: 20,
  MOUNTAIN: 21,
  SECRET_CAVE: 22,
  WATER_ROUTE: 23,
  DESERT: 24,
  CAVE_DUNGEON: 25,
  ART_STUDIO: 26,
  SAND: 27,
  SNOW: 28,
};

// Seasons
export const SEASONS = ['Lente', 'Zomer', 'Herfst', 'Winter'];

// Season Styles
export const SEASON_STYLES = {
  0: {
    // Lente (Spring)
    grass: '#bbf7d0',
    tree: '#f472b6',
    bg: '#f0fdf4',
    tile: '#dcfce7',
  },
  1: {
    // Zomer (Summer)
    grass: '#4ade80',
    tree: '#166534',
    bg: '#dcfce7',
    tile: '#bbf7d0',
  },
  2: {
    // Herfst (Autumn)
    grass: '#fef3c7',
    tree: '#d97706',
    bg: '#fffbeb',
    tile: '#fde68a',
  },
  3: {
    // Winter
    grass: '#f1f5f9',
    tree: '#94a3b8',
    bg: '#e2e8f0',
    tile: '#f8fafc',
  },
};

// Weather Types
export const WEATHER_TYPES = {
  SUNNY: 'sunny',
  RAINY: 'rainy',
  SNOWY: 'snowy',
};

// Encounter System
export const ENCOUNTER_CONFIG = {
  BASE_CHANCE: 0.3,
  WILD_POKEMON_CHANCE: 0.6,
  TEAM_ROCKET_CHANCE: 0.8, // 0.6-0.8 range
};

// NPC Positions
export const NPC_POSITIONS = {
  PROFESSOR_OAK: { x: 5, y: 5 },
  FISHERMAN: { x: 5, y: 7 },
};

// Quest Requirements
export const QUEST_REQUIREMENTS = {
  TREE_PLANTING: 3,
};

// Outfit Colors
export const OUTFIT_COLORS = {
  default: '#ef4444',
  cool: '#3b82f6',
  nature: '#22c55e',
  shiny: '#eab308',
  ninja: '#1e293b',
};

// Navigation Delay
export const NAVIGATION_DELAY = 1000; // ms

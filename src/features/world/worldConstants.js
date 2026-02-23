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

// World Layouts
export const WORLDS_CONFIG = {
  green_valley: [
    [1, 1, 1, 14, 0, 4, 4, 0, 19, 3],
    [1, 12, 1, 13, 16, 17, 4, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 25, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 9, 6],
    [4, 4, 0, 0, 1, 0, 23, 10, 10, 18],
    [0, 0, 0, 0, 1, 1, 10, 10, 10, 0],
    [0, 0, 7, 0, 1, 11, 10, 10, 10, 20],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 21],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 21],
    [5, 0, 26, 2, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 24, 1, 0, 0, 0, 0, 0],
  ],
  desert_oasis: [
    [27, 27, 27, 1, 27, 27, 27, 28, 28, 28],
    [27, 1, 1, 1, 27, 27, 27, 27, 28, 27],
    [27, 1, 25, 1, 27, 10, 10, 27, 27, 27],
    [27, 1, 1, 1, 27, 10, 11, 10, 27, 27],
    [27, 27, 27, 27, 27, 10, 10, 27, 27, 27],
    [28, 28, 27, 27, 27, 27, 27, 27, 27, 27],
    [28, 28, 28, 27, 4, 4, 27, 27, 5, 27],
    [27, 27, 27, 27, 4, 4, 27, 27, 27, 27],
    [27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
    [27, 3, 27, 27, 27, 27, 24, 27, 27, 27],
    [27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
  ],
  frozen_peak: [
    [28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [28, 1, 1, 1, 28, 28, 28, 28, 28, 28],
    [28, 1, 7, 1, 28, 28, 28, 28, 28, 28],
    [28, 1, 1, 1, 28, 28, 28, 28, 28, 28],
    [28, 28, 28, 28, 28, 10, 10, 28, 28, 28],
    [28, 28, 28, 28, 28, 10, 10, 28, 28, 28],
    [28, 4, 4, 28, 28, 28, 28, 28, 28, 28],
    [28, 4, 4, 28, 28, 3, 28, 28, 28, 28],
    [28, 28, 28, 28, 28, 1, 28, 28, 28, 28],
    [28, 28, 28, 5, 28, 1, 28, 21, 28, 28],
    [28, 28, 28, 28, 28, 1, 28, 28, 28, 28],
  ],
};

// Map new continents to existing layouts for now
WORLDS_CONFIG.na = WORLDS_CONFIG.green_valley;
WORLDS_CONFIG.sa = WORLDS_CONFIG.green_valley;
WORLDS_CONFIG.eu = WORLDS_CONFIG.green_valley;
WORLDS_CONFIG.af = WORLDS_CONFIG.desert_oasis;
WORLDS_CONFIG.as = WORLDS_CONFIG.frozen_peak;
WORLDS_CONFIG.oc = WORLDS_CONFIG.green_valley;

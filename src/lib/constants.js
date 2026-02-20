// Centralized constants for storage keys and other shared values
export const STORAGE_KEYS = {
  COLLECTION: 'felix-pokemon-collection',
  CARE: 'felix-pokemon-care',
  TOWN: 'felix-town-layout',
  SQUAD: 'felix-squad',
  COINS: 'felix-coins',
  INVENTORY: 'felix-inventory',
  QUESTS: 'felix-quests',
  CURRENT_OUTFIT: 'felix-current-outfit',
  OWNED_OUTFITS: 'felix-owned-outfits',
  COMPLETED_QUIZZES: 'felix-completed-quizzes',
  BANK_BALANCE: 'felix-bank-balance',
  BANK_LAST_INTEREST: 'felix-bank-last-interest',
};

// Battle configuration constants
export const BATTLE_CONFIG = {
  MAX_SQUAD_SIZE: 4,
  INITIAL_ENERGY: 3,
  MAX_ENERGY: 5,
  PAGINATION_SIZE: 50,
};

// Legacy exports for backward compatibility
export const COLLECTION_STORAGE_KEY = STORAGE_KEYS.COLLECTION;
export const CARE_STORAGE_KEY = STORAGE_KEYS.CARE;

/**
 * RandomService
 * Provides seeded random number generation for deterministic behavior.
 * Uses a linear congruential generator (LCG).
 */

const LCG_M = 2147483647; // 2^31 - 1
const LCG_A = 16807; // 7^5

let currentSeed = Date.now() % LCG_M;

/**
 * Set a specific seed for deterministic results
 * @param {number} seed
 */
export function setSeed(seed) {
  currentSeed = seed % LCG_M;
}

/**
 * Returns a float between 0 (inclusive) and 1 (exclusive)
 */
function next() {
  currentSeed = (LCG_A * currentSeed) % LCG_M;
  return (currentSeed - 1) / (LCG_M - 1);
}

/**
 * Returns a float between 0 (inclusive) and 1 (exclusive)
 * Alias for readability matching Math.random() signature
 */
export function float() {
  return next();
}

/**
 * Returns an integer between min and max (inclusive)
 */
export function int(min, max) {
  return Math.floor(next() * (max - min + 1)) + min;
}

/**
 * Returns true with the given probability (0..1)
 */
export function bool(probability = 0.5) {
  return next() < probability;
}

/**
 * Pick a random item from an array
 */
export function pick(array) {
  if (!array || array.length === 0) return null;
  return array[int(0, array.length - 1)];
}

// Legacy compatibility: default export as an object matching old API
export const randomService = { setSeed, float, int, bool, pick };

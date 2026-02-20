/**
 * RandomService
 * Provides seeded random number generation for deterministic behavior.
 * Uses a linear congruential generator (LCG).
 */

class RandomService {
  constructor(seed = Date.now()) {
    this.seed = seed;
    this.m = 2147483647; // 2^31 - 1
    this.a = 16807; // 7^5
    this.c = 0;
    this.current = seed % this.m;
  }

  /**
   * Set a specific seed for deterministic results
   * @param {number} seed
   */
  setSeed(seed) {
    this.seed = seed;
    this.current = seed % this.m;
  }

  /**
   * Returns a float between 0 (inclusive) and 1 (exclusive)
   */
  next() {
    this.current = (this.a * this.current + this.c) % this.m;
    // Transform to 0..1
    return (this.current - 1) / (this.m - 1);
  }

  /**
   * Alias for next() to match Math.random() signature
   */
  float() {
    return this.next();
  }

  /**
   * Returns an integer between min and max (inclusive)
   */
  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns true with the given probability (0..1)
   */
  bool(probability = 0.5) {
    return this.next() < probability;
  }

  /**
   * Pick a random item from an array
   */
  pick(array) {
    if (!array || array.length === 0) return null;
    return array[this.int(0, array.length - 1)];
  }
}

// Export a singleton instance by default
export const randomService = new RandomService();
export { RandomService };

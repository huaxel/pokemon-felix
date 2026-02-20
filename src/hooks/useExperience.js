import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const EXP_STORAGE_KEY = 'pokemon_exp_stats';

export function useExperience(ownedIds) {
  const [xpStats, setXpStats] = useLocalStorage(EXP_STORAGE_KEY, {});

  // Initialize stats for new pokemon
  useEffect(() => {
    setXpStats(prev => {
      const newStats = { ...prev };
      let changed = false;

      // Add defaults for any owned ids missing
      ownedIds.forEach(id => {
        if (!newStats[id]) {
          newStats[id] = {
            level: 5,
            xp: 0,
            toNextLevel: 100, // Simple formula: level * 20 ?? No, let's allow custom scaling
          };
          changed = true;
        }
      });

      return changed ? newStats : prev;
    });
  }, [ownedIds, setXpStats]);

  /**
   * Gain experience for a pokemon
   * @param {number} id Pokemon ID
   * @param {number} amount XP amount
   * @returns {Object} Result { leveledUp: boolean, newLevel: number }
   */
  const gainExperience = (id, amount) => {
    const result = { leveledUp: false, newLevel: 0 };

    setXpStats(prev => {
      const current = prev[id] || { level: 5, xp: 0, toNextLevel: 100 };
      let { level, xp } = current;
      let toNext = level * 100; // Formula: Level * 100 to advance

      xp += amount;

      // Level Up Logic
      if (xp >= toNext) {
        while (xp >= toNext) {
          xp -= toNext;
          level += 1;
          toNext = level * 100;
          result.leveledUp = true;
          result.newLevel = level;
        }
      }

      return {
        ...prev,
        [id]: { level, xp, toNextLevel: toNext }, // Store calculated values
      };
    });

    return result;
  };

  return {
    xpStats,
    gainExperience,
  };
}

import { useCallback } from 'react';
import { useEconomy, useDomainCollection } from '../contexts/DomainContexts';

/**
 * Handles complex actions that orchestrate multiple domains
 * previously handled inside the God Object.
 */
export function useGlobalActions() {
  const economy = useEconomy();
  const collection = useDomainCollection();

  const sellPokemon = useCallback(
    async id => {
      if (collection.ownedIds.includes(id)) {
        await collection.toggleOwned(id);
        economy.addCoins(50);
        return true;
      }
      return false;
    },
    [collection, economy]
  );

  const evolvePokemon = useCallback(
    async (oldId, newId) => {
      if (collection.ownedIds.includes(oldId) && economy.spendCoins(300)) {
        await collection.toggleOwned(oldId);
        await collection.toggleOwned(newId);
        return true;
      }
      return false;
    },
    [collection, economy]
  );

  return { sellPokemon, evolvePokemon };
}

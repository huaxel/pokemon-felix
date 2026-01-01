import { useState, useMemo, useCallback } from 'react';
import { PokemonContext } from './PokemonContext';
import { CollectionContext } from './CollectionContext';
import { BattleContext } from './BattleContext';
import { UIContext } from './UIContext';
import { CareContext } from './CareContext';
import { TownContext } from './TownContext';
import { usePokemonData } from '../hooks/usePokemonData';
import { useCollection } from '../hooks/useCollection';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { useCoins } from '../hooks/useCoins';
import { useSquad } from '../hooks/useSquad';
import { useCare } from '../hooks/useCare';
import { useTown } from '../hooks/useTown';
import { useInventory } from '../hooks/useInventory';
import { useQuests } from '../hooks/useQuests';

/**
 * Refactored Provider component with proper memoization
 * Provides all Pokemon-related data through a single, optimized context
 */
export function PokemonProvider({ children }) {
    const pokemonData = usePokemonData();
    const collection = useCollection();
    const search = usePokemonSearch();
    const { coins, addCoins, removeCoins, spendCoins } = useCoins();
    const squad = useSquad();
    const care = useCare(collection.ownedIds);
    const town = useTown();
    const { inventory, addItem, removeItem } = useInventory();
    const { quests, updateQuestProgress, completeQuest } = useQuests();
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);

    // Memoized callbacks
    const toggleConsole = useCallback((isOpen) => {
        setIsConsoleOpen(prev => isOpen ?? !prev);
    }, []);

    const handleCompleteQuest = useCallback((id) => {
        const reward = completeQuest(id);
        if (reward) {
            if (reward.coins) addCoins(reward.coins);
            if (reward.item) addItem(reward.item, 1);
            return true;
        }
        return false;
    }, [completeQuest, addCoins, addItem]);

    const toggleOwnedWithQuest = useCallback((id) => {
        const wasOwned = collection.ownedIds.includes(id);
        collection.toggleOwned(id);
        if (!wasOwned) updateQuestProgress('catch');
    }, [collection, updateQuestProgress]);

    const sellPokemon = useCallback(async (id) => {
        if (collection.ownedIds.includes(id)) {
            await collection.toggleOwned(id);
            addCoins(50);
            return true;
        }
        return false;
    }, [collection, addCoins]);

    const evolvePokemon = useCallback(async (oldId, newId) => {
        if (collection.ownedIds.includes(oldId) && spendCoins(300)) {
            await collection.toggleOwned(oldId);
            await collection.toggleOwned(newId);
            return true;
        }
        return false;
    }, [collection, spendCoins]);

    // Memoized context values for sub-contexts
    const collectionValue = useMemo(() => ({
        ownedIds: collection.ownedIds,
        setOwnedIds: collection.setOwnedIds,
        toggleOwned: toggleOwnedWithQuest
    }), [collection.ownedIds, collection.setOwnedIds, toggleOwnedWithQuest]);

    const battleValue = useMemo(() => ({
        squadIds: squad.squadIds,
        addToSquad: squad.addToSquad,
        removeFromSquad: squad.removeFromSquad,
        isInSquad: squad.isInSquad,
        isSquadFull: squad.isSquadFull
    }), [squad]);

    const uiValue = useMemo(() => ({
        isConsoleOpen,
        toggleConsole
    }), [isConsoleOpen, toggleConsole]);

    const careValue = useMemo(() => ({
        careStats: care.careStats,
        healPokemon: care.healPokemon,
        healAll: care.healAll,
        feedPokemon: care.feedPokemon,
        addFatigue: care.addFatigue
    }), [care]);

    const townValue = useMemo(() => ({
        townObjects: town.townObjects,
        addObject: town.addObject,
        removeObject: town.removeObject,
        clearTown: town.clearTown
    }), [town]);

    // Main context value - properly memoized and structured
    const value = useMemo(() => ({
        // Pokemon data
        pokemonList: pokemonData.pokemonList,
        loading: pokemonData.loading || search.loading,
        loadPokemon: pokemonData.loadPokemon,

        // Collection
        ownedIds: collection.ownedIds,
        setOwnedIds: collection.setOwnedIds,
        toggleOwned: toggleOwnedWithQuest,

        // Squad/Battle
        squadIds: squad.squadIds,
        addToSquad: squad.addToSquad,
        removeFromSquad: squad.removeFromSquad,
        isInSquad: squad.isInSquad,
        isSquadFull: squad.isSquadFull,

        // Search
        allPokemonNames: search.allPokemonNames,
        searchResults: search.searchResults,
        searchTerm: search.searchTerm,
        handleSearch: search.handleSearch,
        clearSearch: search.clearSearch,

        // Economy
        coins,
        addCoins,
        removeCoins,
        spendCoins,

        // Care
        careStats: care.careStats,
        healPokemon: care.healPokemon,
        healAll: care.healAll,
        feedPokemon: care.feedPokemon,
        addFatigue: care.addFatigue,

        // Town
        townObjects: town.townObjects,
        addObject: town.addObject,
        removeObject: town.removeObject,
        clearTown: town.clearTown,

        // Inventory
        inventory,
        addItem,
        removeItem,

        // Quests
        quests,
        updateQuestProgress,
        completeQuest: handleCompleteQuest,

        // UI
        isConsoleOpen,
        toggleConsole,

        // Meta Actions
        sellPokemon,
        evolvePokemon
    }), [
        pokemonData, search, collection, squad, coins, addCoins, removeCoins, spendCoins,
        care, town, inventory, addItem, removeItem, quests, updateQuestProgress,
        handleCompleteQuest, isConsoleOpen, toggleConsole, toggleOwnedWithQuest,
        sellPokemon, evolvePokemon
    ]);

    // Note: Specialized contexts maintained for backward compatibility and scoped access
    // Main PokemonContext provides everything, but specialized contexts allow
    // components to express their specific dependencies
    return (
        <PokemonContext.Provider value={value}>
            <UIContext.Provider value={uiValue}>
                <CollectionContext.Provider value={collectionValue}>
                    <BattleContext.Provider value={battleValue}>
                        <CareContext.Provider value={careValue}>
                            <TownContext.Provider value={townValue}>
                                {children}
                            </TownContext.Provider>
                        </CareContext.Provider>
                    </BattleContext.Provider>
                </CollectionContext.Provider>
            </UIContext.Provider>
        </PokemonContext.Provider>
    );
}

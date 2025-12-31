import { useState } from 'react';
import { PokemonContext } from './PokemonContext';
import { CollectionContext } from './CollectionContext';
import { BattleContext } from './BattleContext';
import { UIContext } from './UIContext';
import { usePokemonData } from '../hooks/usePokemonData';
import { useCollection } from '../hooks/useCollection';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { useCoins } from '../hooks/useCoins';
import { useSquad } from '../hooks/useSquad';
import { useCare } from '../hooks/useCare';
import { useTown } from '../hooks/useTown';
import { CareContext } from './CareContext';
import { TownContext } from './TownContext';
import { useInventory } from '../hooks/useInventory';
import { useQuests } from '../hooks/useQuests';

/**
 * Provider component that wraps the app and provides Pokemon data
 */
export function PokemonProvider({ children }) {
    const pokemonData = usePokemonData();
    const collection = useCollection();
    const search = usePokemonSearch();
    const { coins, addCoins, spendCoins } = useCoins();
    const squad = useSquad();
    const care = useCare(collection.ownedIds);
    const town = useTown();
    const { inventory, addItem, removeItem } = useInventory();

    const { quests, updateQuestProgress, completeQuest } = useQuests();
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);

    const toggleConsole = (isOpen) => setIsConsoleOpen(prev => isOpen ?? !prev);

    const handleCompleteQuest = (id) => {
        const reward = completeQuest(id);
        if (reward) {
            if (reward.coins) addCoins(reward.coins);
            if (reward.item) addItem(reward.item, 1);
            return true;
        }
        return false;
    };

    const toggleOwnedWithQuest = (id) => {
        const wasOwned = collection.ownedIds.includes(id);
        collection.toggleOwned(id);
        if (!wasOwned) updateQuestProgress('catch');
    };

    const collectionValue = {
        ownedIds: collection.ownedIds,
        setOwnedIds: collection.setOwnedIds,
        toggleOwned: toggleOwnedWithQuest
    };

    const battleValue = {
        squadIds: squad.squadIds,
        addToSquad: squad.addToSquad,
        removeFromSquad: squad.removeFromSquad,
        isInSquad: squad.isInSquad,
        isSquadFull: squad.isSquadFull
    };

    const uiValue = {
        isConsoleOpen,
        toggleConsole
    };

    const careValue = {
        careStats: care.careStats,
        healPokemon: care.healPokemon,
        healAll: care.healAll,
        feedPokemon: care.feedPokemon,
        addFatigue: care.addFatigue
    };

    const townValue = {
        townObjects: town.townObjects,
        addObject: town.addObject,
        removeObject: town.removeObject,
        clearTown: town.clearTown
    };

    const value = {
        // UI State (also available via UIContext)
        isConsoleOpen,
        toggleConsole,

        // Pokemon data
        pokemonList: pokemonData.pokemonList,
        loading: pokemonData.loading || search.loading,
        loadPokemon: pokemonData.loadPokemon,

        // Collection (also available via CollectionContext)
        ownedIds: collection.ownedIds,
        setOwnedIds: collection.setOwnedIds,
        toggleOwned: toggleOwnedWithQuest,

        // Squad (also available via BattleContext)
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
        spendCoins,

        // Care
        careStats: care.careStats,
        healPokemon: care.healPokemon,
        healAll: care.healAll,
        feedPokemon: care.feedPokemon,
        addFatigue: care.addFatigue,

        // Town (Creative)
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

        // New Meta Actions
        sellPokemon: async (id) => {
            if (collection.ownedIds.includes(id)) {
                await collection.toggleOwned(id);
                addCoins(50);
                return true;
            }
            return false;
        },
        evolvePokemon: async (oldId, newId) => {
            if (collection.ownedIds.includes(oldId) && spendCoins(300)) {
                // Remove old, add new
                await collection.toggleOwned(oldId);
                await collection.toggleOwned(newId);
                return true;
            }
            return false;
        }
    };

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

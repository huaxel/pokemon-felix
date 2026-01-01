import { useMemo, useState, useCallback } from 'react';
import { usePokemonData } from '../hooks/usePokemonData';
import { useCollection } from '../hooks/useCollection';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { useCoins } from '../hooks/useCoins';
import { useSquad } from '../hooks/useSquad';
import { useCare } from '../hooks/useCare';
import { useTown } from '../hooks/useTown';
import { useInventory } from '../hooks/useInventory';
import { useQuests } from '../hooks/useQuests';
import {
    DataContext,
    EconomyContext,
    ProgressContext,
    CollectionContext,
    CareContext,
    TownContext,
    UIContext
} from './DomainContexts';

// --- Domain Providers ---

/**
 * Manages Pokemon data and search
 */
export function DataProvider({ children }) {
    const pokemonData = usePokemonData();
    const search = usePokemonSearch();

    const value = useMemo(() => ({
        pokemonList: pokemonData.pokemonList,
        loading: pokemonData.loading || search.loading,
        loadPokemon: pokemonData.loadPokemon,
        allPokemonNames: search.allPokemonNames,
        searchResults: search.searchResults,
        searchTerm: search.searchTerm,
        handleSearch: search.handleSearch,
        clearSearch: search.clearSearch,
    }), [pokemonData, search]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Manages Economy and Inventory
 */
export function EconomyProvider({ children }) {
    const { coins, addCoins, removeCoins, spendCoins } = useCoins();
    const { inventory, addItem, removeItem } = useInventory();

    const value = useMemo(() => ({
        coins,
        addCoins,
        removeCoins,
        spendCoins,
        inventory,
        addItem,
        removeItem
    }), [coins, addCoins, removeCoins, spendCoins, inventory, addItem, removeItem]);

    return <EconomyContext.Provider value={value}>{children}</EconomyContext.Provider>;
}

/**
 * Manages Collection and Squad
 */
export function CollectionProvider({ children, onCatch }) {
    const collection = useCollection();
    const squad = useSquad();

    const toggleOwned = useCallback((id) => {
        const wasOwned = collection.ownedIds.includes(id);
        collection.toggleOwned(id);
        if (!wasOwned && onCatch) {
            onCatch(id);
        }
    }, [collection, onCatch]);

    const value = useMemo(() => ({
        ownedIds: collection.ownedIds,
        setOwnedIds: collection.setOwnedIds,
        toggleOwned,
        ...squad
    }), [collection, toggleOwned, squad]);

    return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

/**
 * Manages Pokemon Care
 */
export function CareProvider({ children, ownedIds }) {
    const care = useCare(ownedIds);

    const value = useMemo(() => ({
        ...care
    }), [care]);

    return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

/**
 * Manages Town objects
 */
export function TownProvider({ children }) {
    const town = useTown();

    const value = useMemo(() => ({
        ...town
    }), [town]);

    return <TownContext.Provider value={value}>{children}</TownContext.Provider>;
}

/**
 * Manages UI state
 */
export function UIProvider({ children }) {
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);

    const toggleConsole = useCallback((isOpen) => {
        setIsConsoleOpen(prev => isOpen ?? !prev);
    }, []);

    const value = useMemo(() => ({
        isConsoleOpen,
        toggleConsole
    }), [isConsoleOpen, toggleConsole]);

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * Manages game progression (Quests)
 */
export function ProgressProvider({ children, onCompleteQuest }) {
    const { quests, updateQuestProgress, completeQuest } = useQuests();

    const handleComplete = useCallback((id) => {
        const reward = completeQuest(id);
        if (reward && onCompleteQuest) {
            onCompleteQuest(reward);
            return true;
        }
        return false;
    }, [completeQuest, onCompleteQuest]);

    const value = useMemo(() => ({
        quests,
        updateQuestProgress,
        completeQuest: handleComplete
    }), [quests, updateQuestProgress, handleComplete]);

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

import React, { useMemo, useState, useCallback } from 'react';
import { useCollection } from '../hooks/useCollection';
import { useCoins } from '../hooks/useCoins';
import { useSquad } from '../hooks/useSquad';

import { useCare } from '../hooks/useCare';
import { useExperience } from '../hooks/useExperience';
import { useTown } from '../hooks/useTown';
import { useInventory } from '../hooks/useInventory';
import { useQuests } from '../hooks/useQuests';
import { useDailyRewards } from '../hooks/useDailyRewards';
import { useToast } from '../hooks/useToast';
import {
    DataContext,
    EconomyContext,
    ProgressContext,
    CollectionContext,
    CareContext,
    ExperienceContext,
    TownContext,
    UIContext
} from './DomainContexts';

// --- Domain Providers ---

/**
 * Manages Pokemon data and search
 */
/**
 * Manages Pokemon data and search using React Query
 */
import { usePokemonListQuery, useAllPokemonNamesQuery } from '../hooks/usePokemonQueries';
import { usePokemonSearch } from '../hooks/usePokemonSearch';

export function DataProvider({ children }) {
    // React Query Hooks
    const {
        data: pokemonPages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingList
    } = usePokemonListQuery();

    const {
        data: allNames,
        isLoading: isLoadingNames
    } = useAllPokemonNamesQuery();

    // Flatten pages into a single list
    const pokemonList = useMemo(() => {
        return pokemonPages?.pages?.flat() || [];
    }, [pokemonPages]);

    // Keep search logic separated for now (it relies on local filtering usually)
    // But we inject the allNames from the query
    const search = usePokemonSearch(allNames);

    const loadPokemon = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const value = useMemo(() => ({
        pokemonList,
        loading: isLoadingList || isLoadingNames || search.loading,
        loadPokemon,
        allPokemonNames: allNames || [],
        searchResults: search.searchResults,
        searchTerm: search.searchTerm,
        handleSearch: search.handleSearch,
        clearSearch: search.clearSearch,
    }), [pokemonList, isLoadingList, isLoadingNames, search, loadPokemon, allNames]);

    return (
        <React.Fragment>
            <DataContext.Provider value={value}>{children}</DataContext.Provider>
        </React.Fragment>
    );
}

/**
 * Manages Economy and Inventory
 */
export function EconomyProvider({ children }) {
    const {
        coins, addCoins, removeCoins, spendCoins,
        bankBalance, deposit, withdraw, calculateDailyInterest, interestRate
    } = useCoins();
    const { inventory, addItem, removeItem } = useInventory();

    const value = useMemo(() => ({
        coins,
        addCoins,
        removeCoins,
        spendCoins,
        inventory,
        addItem,
        removeItem,
        // Bank
        bankBalance,
        deposit,
        withdraw,
        calculateDailyInterest,
        interestRate
    }), [
        coins, addCoins, removeCoins, spendCoins,
        inventory, addItem, removeItem,
        bankBalance, deposit, withdraw, calculateDailyInterest, interestRate
    ]);

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
 * Manages Pokemon Level and XP
 */
export function ExperienceProvider({ children, ownedIds }) {
    const experience = useExperience(ownedIds);

    const value = useMemo(() => ({
        ...experience
    }), [experience]);

    return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
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
    const { toasts, removeToast, showSuccess, showError, showInfo, showWarning, showQuest, showCoins } = useToast();

    const toggleConsole = useCallback((isOpen) => {
        setIsConsoleOpen(prev => isOpen ?? !prev);
    }, []);

    const value = useMemo(() => ({
        isConsoleOpen,
        toggleConsole,
        // Toast
        toasts,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showQuest,
        showCoins
    }), [
        isConsoleOpen, toggleConsole,
        toasts, removeToast,
        showSuccess, showError, showInfo, showWarning, showQuest, showCoins
    ]);

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * Manages game progression (Quests)
 */
export function ProgressProvider({ children, onCompleteQuest, onClaimDailyReward }) {
    const { quests, updateQuestProgress, completeQuest } = useQuests();
    const { canClaim, claimReward } = useDailyRewards();

    const handleComplete = useCallback((id) => {
        const reward = completeQuest(id);
        if (reward && onCompleteQuest) {
            onCompleteQuest(reward);
            return true;
        }
        return false;
    }, [completeQuest, onCompleteQuest]);

    const handleClaimDailyReward = useCallback(() => {
        if (canClaim) {
            claimReward();
            if (onClaimDailyReward) {
                onClaimDailyReward();
            }
            return true;
        }
        return false;
    }, [canClaim, claimReward, onClaimDailyReward]);

    const value = useMemo(() => ({
        quests,
        updateQuestProgress,
        completeQuest: handleComplete,
        dailyReward: {
            canClaim,
            claimReward, // Keep raw access if needed, but prefer handleClaimDailyReward
            handleClaimDailyReward
        }
    }), [quests, updateQuestProgress, handleComplete, canClaim, claimReward, handleClaimDailyReward]);

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

import React, { useMemo, useCallback, useContext } from 'react';
import {
    DataProvider, EconomyProvider, ProgressProvider,
    CollectionProvider, CareProvider, ExperienceProvider, TownProvider, UIProvider
} from './DomainProviders';
import {
    DataContext, EconomyContext, ProgressContext,
    CollectionContext, CareContext, ExperienceContext, TownContext, UIContext
} from './DomainContexts';
import { PokemonContext } from './PokemonContext';
import { UIContext as UIContextOrig } from './UIContext';
import { CollectionContext as CollectionContextOrig } from './CollectionContext';
import { BattleContext as BattleContextOrig } from './BattleContext';
import { CareContext as CareContextOrig } from './CareContext';
import { TownContext as TownContextOrig } from './TownContext';


import { composeProviders } from '../lib/composeProviders';
import { BankInterestManager } from '../features/world/bank/components/BankInterestManager';

export function PokemonProvider({ children }) {
    const ComposedProviders = useMemo(() => composeProviders([
        DataProvider,
        EconomyProvider,
        UIProvider,
        TownProvider,
        ProgressProviderWrapper,
        CollectionCareOrchestrator
    ]), []);

    return (
        <React.Fragment>
            <ComposedProviders>
                <BankInterestManager />
                {children}
            </ComposedProviders>
        </React.Fragment>
    );
}

/**
 * Handles domains that depend on each other (Collection -> Care, Progress)
 * This itself is a composed chain, could be further flattened if we wanted, 
 * but since it contains logic (callbacks), we keep the structure but flatten the render.
 */
function CollectionCareOrchestrator({ children }) {
    const { updateQuestProgress } = useContext(ProgressContext);

    const handleCatch = useCallback(() => {
        updateQuestProgress('catch');
    }, [updateQuestProgress]);

    const ComposedInner = useMemo(() => composeProviders([
        [CollectionProvider, { onCatch: handleCatch }],
        CareProviderWrapper,
        ExperienceProviderWrapper,
        FinalContextAssembler
    ]), [handleCatch]);

    return <ComposedInner>{children}</ComposedInner>;
}

/**
 * Small wrappers to inject context dependencies before provider initialization
 */
function ProgressProviderWrapper({ children }) {
    const { showSuccess } = useContext(UIContext);
    const { addCoins, addItem } = useContext(EconomyContext);

    const handleCompleteQuest = useCallback((reward) => {
        if (reward.coins) addCoins(reward.coins);
        if (reward.item) addItem(reward.item, 1);
    }, [addCoins, addItem]);

    const handleClaimDailyReward = useCallback(() => {
        addCoins(100);
        showSuccess('¡Has recibido 100 monedas! 💰');
    }, [addCoins, showSuccess]);

    return (
        <ProgressProvider
            onCompleteQuest={handleCompleteQuest}
            onClaimDailyReward={handleClaimDailyReward}
        >
            {children}
        </ProgressProvider>
    );
}

function CareProviderWrapper({ children }) {
    const { ownedIds } = useContext(CollectionContext);
    return (
        <CareProvider ownedIds={ownedIds}>
            {children}
        </CareProvider>
    );
}

function ExperienceProviderWrapper({ children }) {
    const { ownedIds } = useContext(CollectionContext);
    return (
        <ExperienceProvider ownedIds={ownedIds}>
            {children}
        </ExperienceProvider>
    );
}

/**
 * Final step: Assemble the monolithic context for backward compatibility
 */
function FinalContextAssembler({ children }) {
    const data = useContext(DataContext);
    const economy = useContext(EconomyContext);
    const collection = useContext(CollectionContext);

    const care = useContext(CareContext);
    const experience = useContext(ExperienceContext);
    const town = useContext(TownContext);
    const progress = useContext(ProgressContext);
    const ui = useContext(UIContext);

    // Orchestrated meta-actions
    const sellPokemon = useCallback(async (id) => {
        if (collection.ownedIds.includes(id)) {
            await collection.toggleOwned(id);
            economy.addCoins(50);
            return true;
        }
        return false;
    }, [collection, economy]);

    const evolvePokemon = useCallback(async (oldId, newId) => {
        if (collection.ownedIds.includes(oldId) && economy.spendCoins(300)) {
            await collection.toggleOwned(oldId);
            await collection.toggleOwned(newId);
            return true;
        }
        return false;
    }, [collection, economy]);

    // Root context value (God object for legacy components)
    const value = useMemo(() => ({
        ...data,
        ...economy,
        ...collection,
        ...care,
        ...experience,
        ...town,
        ...progress,
        ...ui,
        sellPokemon,
        evolvePokemon
    }), [data, economy, collection, care, experience, town, progress, ui, sellPokemon, evolvePokemon]);

    // Legacy Context Values
    const collectionLegacy = useMemo(() => ({
        ownedIds: collection.ownedIds,
        setOwnedIds: collection.setOwnedIds,
        toggleOwned: collection.toggleOwned
    }), [collection]);

    const battleLegacy = useMemo(() => ({
        squadIds: collection.squadIds,
        addToSquad: collection.addToSquad,
        removeFromSquad: collection.removeFromSquad,
        isInSquad: collection.isInSquad,
        isSquadFull: collection.isSquadFull
    }), [collection]);

    return (
        <PokemonContext.Provider value={value}>
            <UIContextOrig.Provider value={ui}>
                <CollectionContextOrig.Provider value={collectionLegacy}>
                    <BattleContextOrig.Provider value={battleLegacy}>
                        <CareContextOrig.Provider value={care}>
                            <TownContextOrig.Provider value={town}>
                                {children}
                            </TownContextOrig.Provider>
                        </CareContextOrig.Provider>
                    </BattleContextOrig.Provider>
                </CollectionContextOrig.Provider>
            </UIContextOrig.Provider>
        </PokemonContext.Provider>
    );
}

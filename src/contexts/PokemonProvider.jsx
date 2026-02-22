import React, { useMemo, useCallback, useContext } from 'react';
import {
  DataProvider,
  EconomyProvider,
  ProgressProvider,
  CollectionProvider,
  CareProvider,
  ExperienceProvider,
  TownProvider,
  UIProvider,
} from './DomainProviders';
import {
  DataContext,
  EconomyContext,
  ProgressContext,
  CollectionContext,
  CareContext,
  ExperienceContext,
  TownContext,
  UIContext,
} from './DomainContexts';

import { composeProviders } from '../lib/composeProviders';
import { BankInterestManager } from '../features/world/bank/components/BankInterestManager';

export function PokemonProvider({ children }) {
  const ComposedProviders = useMemo(
    () =>
      composeProviders([
        DataProvider,
        EconomyProvider,
        UIProvider,
        TownProvider,
        ProgressProviderWrapper,
        CollectionCareOrchestrator,
      ]),
    []
  );

  return (
    <ComposedProviders>
      <BankInterestManager />
      {children}
    </ComposedProviders>
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

  const ComposedInner = useMemo(
    () =>
      composeProviders([
        [CollectionProvider, { onCatch: handleCatch }],
        CareProviderWrapper,
        ExperienceProviderWrapper,
      ]),
    [handleCatch]
  );

  return <ComposedInner>{children}</ComposedInner>;
}

/**
 * Small wrappers to inject context dependencies before provider initialization
 */
function ProgressProviderWrapper({ children }) {
  const { showSuccess } = useContext(UIContext);
  const { addCoins, addItem } = useContext(EconomyContext);

  const handleCompleteQuest = useCallback(
    reward => {
      if (reward.coins) addCoins(reward.coins);
      if (reward.item) addItem(reward.item, 1);
    },
    [addCoins, addItem]
  );

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
  return <CareProvider ownedIds={ownedIds}>{children}</CareProvider>;
}

function ExperienceProviderWrapper({ children }) {
  const { ownedIds } = useContext(CollectionContext);
  return <ExperienceProvider ownedIds={ownedIds}>{children}</ExperienceProvider>;
}


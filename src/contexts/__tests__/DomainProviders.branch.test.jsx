import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonListQuery: vi.fn(),
  useAllPokemonNamesQuery: vi.fn(),
}));

vi.mock('../../hooks/usePokemonSearch', () => ({
  usePokemonSearch: vi.fn(),
}));

vi.mock('../../hooks/useCollection', () => ({
  useCollection: vi.fn(),
}));

vi.mock('../../hooks/useSquad', () => ({
  useSquad: vi.fn(),
}));

vi.mock('../../hooks/useQuests', () => ({
  useQuests: vi.fn(),
}));

vi.mock('../../hooks/useDailyRewards', () => ({
  useDailyRewards: vi.fn(),
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: vi.fn(),
}));

import * as pokemonQueries from '../../hooks/usePokemonQueries';
import * as pokemonSearch from '../../hooks/usePokemonSearch';
import * as collectionHook from '../../hooks/useCollection';
import * as squadHook from '../../hooks/useSquad';
import * as questsHook from '../../hooks/useQuests';
import * as dailyRewardsHook from '../../hooks/useDailyRewards';
import * as toastHook from '../../hooks/useToast';

import { DataProvider, CollectionProvider, ProgressProvider, UIProvider } from '../DomainProviders';
import { useData, useDomainCollection, useProgress, useUI } from '../DomainContexts';

describe('DomainProviders branches', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('DataProvider loadPokemon calls fetchNextPage only when allowed', () => {
    const fetchNextPage = vi.fn();
    pokemonQueries.usePokemonListQuery.mockReturnValue({
      data: { pages: [[{ id: 1 }]] },
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
    });
    pokemonQueries.useAllPokemonNamesQuery.mockReturnValue({ data: [], isLoading: false });
    pokemonSearch.usePokemonSearch.mockReturnValue({
      loading: false,
      searchResults: [],
      searchTerm: '',
      handleSearch: vi.fn(),
      clearSearch: vi.fn(),
    });

    const wrapper = ({ children }) => React.createElement(DataProvider, null, children);
    const { result } = renderHook(() => useData(), { wrapper });

    act(() => result.current.loadPokemon());
    expect(fetchNextPage).toHaveBeenCalledTimes(1);

    fetchNextPage.mockClear();
    pokemonQueries.usePokemonListQuery.mockReturnValue({
      data: { pages: [[{ id: 1 }]] },
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: true,
      isLoading: false,
    });

    const { result: result2 } = renderHook(() => useData(), { wrapper });
    act(() => result2.current.loadPokemon());
    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('CollectionProvider calls onCatch only when newly owned', () => {
    const toggleOwned = vi.fn();
    collectionHook.useCollection.mockReturnValue({
      ownedIds: [1],
      setOwnedIds: vi.fn(),
      toggleOwned,
    });
    squadHook.useSquad.mockReturnValue({});

    const onCatch = vi.fn();
    const wrapper = ({ children }) =>
      React.createElement(CollectionProvider, { onCatch }, children);
    const { result } = renderHook(() => useDomainCollection(), { wrapper });

    act(() => result.current.toggleOwned(2));
    expect(toggleOwned).toHaveBeenCalledWith(2);
    expect(onCatch).toHaveBeenCalledWith(2);

    onCatch.mockClear();
    act(() => result.current.toggleOwned(1));
    expect(onCatch).not.toHaveBeenCalled();
  });

  it('ProgressProvider completes quests and claims daily rewards based on canClaim', () => {
    const completeQuest = vi.fn();
    const updateQuestProgress = vi.fn();

    questsHook.useQuests.mockReturnValue({
      quests: [],
      updateQuestProgress,
      completeQuest,
    });

    const claimReward = vi.fn();
    dailyRewardsHook.useDailyRewards.mockReturnValue({
      canClaim: true,
      claimReward,
    });

    const onCompleteQuest = vi.fn();
    const onClaimDailyReward = vi.fn();

    const wrapper = ({ children }) =>
      React.createElement(ProgressProvider, { onCompleteQuest, onClaimDailyReward }, children);

    completeQuest.mockReturnValueOnce({ coins: 1 });
    const { result } = renderHook(() => useProgress(), { wrapper });

    expect(result.current.completeQuest('q1')).toBe(true);
    expect(onCompleteQuest).toHaveBeenCalledWith({ coins: 1 });

    onCompleteQuest.mockClear();
    completeQuest.mockReturnValueOnce(null);
    expect(result.current.completeQuest('q2')).toBe(false);
    expect(onCompleteQuest).not.toHaveBeenCalled();

    expect(result.current.dailyReward.handleClaimDailyReward()).toBe(true);
    expect(claimReward).toHaveBeenCalled();
    expect(onClaimDailyReward).toHaveBeenCalled();

    dailyRewardsHook.useDailyRewards.mockReturnValue({
      canClaim: false,
      claimReward,
    });
    const { result: result2 } = renderHook(() => useProgress(), { wrapper });
    expect(result2.current.dailyReward.handleClaimDailyReward()).toBe(false);
  });

  it('UIProvider toggles console open state', () => {
    toastHook.useToast.mockReturnValue({
      toasts: [],
      removeToast: vi.fn(),
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      showQuest: vi.fn(),
      showCoins: vi.fn(),
    });

    const wrapper = ({ children }) => React.createElement(UIProvider, null, children);
    const { result } = renderHook(() => useUI(), { wrapper });

    expect(result.current.isConsoleOpen).toBe(false);
    act(() => result.current.toggleConsole(true));
    expect(result.current.isConsoleOpen).toBe(true);
    act(() => result.current.toggleConsole());
    expect(result.current.isConsoleOpen).toBe(false);
  });
});

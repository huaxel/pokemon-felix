import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCare } from '../useCare';
import { CARE_STORAGE_KEY } from '../../lib/constants';

describe('useCare', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes defaults for owned ids and removes stats for unowned ids', async () => {
    const { result, rerender } = renderHook(({ ownedIds }) => useCare(ownedIds), {
      initialProps: { ownedIds: [1] },
    });

    await act(async () => {});

    expect(result.current.careStats[1]).toMatchObject({
      hp: 100,
      hunger: 0,
      happiness: 70,
      fatigue: 0,
    });

    rerender({ ownedIds: [2] });
    await act(async () => {});

    expect(result.current.careStats[1]).toBeUndefined();
    expect(result.current.careStats[2]).toBeDefined();

    const stored = JSON.parse(localStorage.getItem(CARE_STORAGE_KEY));
    expect(stored[2]).toBeDefined();
  });

  it('heals, feeds, and adds fatigue', async () => {
    const { result } = renderHook(() => useCare([1]));
    await act(async () => {});

    act(() => result.current.addFatigue(1, 30));
    expect(result.current.careStats[1].fatigue).toBe(30);

    act(() => result.current.feedPokemon(1));
    expect(result.current.careStats[1].hunger).toBe(0);
    expect(result.current.careStats[1].happiness).toBe(80);

    act(() => result.current.healPokemon(1));
    expect(result.current.careStats[1].hp).toBe(100);
    expect(result.current.careStats[1].fatigue).toBe(0);
  });
});

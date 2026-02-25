import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCoins } from '../useCoins';
import { STORAGE_KEYS } from '../../lib/constants';

describe('useCoins', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes coins and bankBalance from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.COINS, '123');
    localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, '45');

    const { result } = renderHook(() => useCoins(500));

    expect(result.current.coins).toBe(123);
    expect(result.current.bankBalance).toBe(45);
  });

  it('adds, spends, deposits, and withdraws coins', () => {
    const { result } = renderHook(() => useCoins(100));

    act(() => result.current.addCoins(50));
    expect(result.current.coins).toBe(150);

    act(() => {
      expect(result.current.spendCoins(200)).toBe(false);
      expect(result.current.spendCoins(25)).toBe(true);
    });
    expect(result.current.coins).toBe(125);

    act(() => {
      expect(result.current.deposit(0)).toBe(false);
      expect(result.current.deposit(200)).toBe(false);
      expect(result.current.deposit(50)).toBe(true);
    });
    expect(result.current.coins).toBe(75);
    expect(result.current.bankBalance).toBe(50);

    act(() => {
      expect(result.current.withdraw(0)).toBe(false);
      expect(result.current.withdraw(100)).toBe(false);
      expect(result.current.withdraw(20)).toBe(true);
    });
    expect(result.current.coins).toBe(95);
    expect(result.current.bankBalance).toBe(30);
  });

  it('calculates daily interest once per day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-23T10:00:00Z'));

    localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, '1000');
    localStorage.removeItem(STORAGE_KEYS.BANK_LAST_INTEREST);

    const { result } = renderHook(() => useCoins(0));

    let interest = 0;
    act(() => {
      interest = result.current.calculateDailyInterest();
    });

    expect(interest).toBe(20);
    expect(result.current.bankBalance).toBe(1020);
    expect(localStorage.getItem(STORAGE_KEYS.BANK_LAST_INTEREST)).toBe(new Date().toDateString());

    act(() => {
      interest = result.current.calculateDailyInterest();
    });
    expect(interest).toBe(0);
  });
});

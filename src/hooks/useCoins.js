import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../lib/constants';

export function useCoins(initialAmount = 500) {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COINS);
    return saved ? parseInt(saved, 10) : initialAmount;
  });

  const [bankBalance, setBankBalance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANK_BALANCE);
    return saved ? parseInt(saved, 10) : 0;
  });

  const INTEREST_RATE = 0.02;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, bankBalance.toString());
  }, [bankBalance]);

  const addCoins = useCallback(amount => {
    setCoins(prev => prev + amount);
  }, []);

  const removeCoins = useCallback(
    amount => {
      if (coins >= amount) {
        setCoins(prev => prev - amount);
        return true;
      }
      return false;
    },
    [coins]
  );

  const spendCoins = useCallback(
    amount => {
      if (coins >= amount) {
        setCoins(prev => prev - amount);
        return true;
      }
      return false;
    },
    [coins]
  );

  // Bank Logic
  const deposit = useCallback(
    amount => {
      if (amount <= 0) return false;
      if (coins >= amount) {
        setCoins(prev => prev - amount);
        setBankBalance(prev => prev + amount);
        return true;
      }
      return false;
    },
    [coins]
  );

  const withdraw = useCallback(
    amount => {
      if (amount <= 0) return false;
      if (bankBalance >= amount) {
        setBankBalance(prev => prev - amount);
        setCoins(prev => prev + amount);
        return true;
      }
      return false;
    },
    [bankBalance]
  );

  const calculateDailyInterest = useCallback(() => {
    const lastInterestDate = localStorage.getItem(STORAGE_KEYS.BANK_LAST_INTEREST);
    const today = new Date().toDateString();

    if (bankBalance > 0 && lastInterestDate !== today) {
      const interest = Math.floor(bankBalance * INTEREST_RATE);

      if (interest > 0) {
        setBankBalance(prev => prev + interest);
        localStorage.setItem(STORAGE_KEYS.BANK_LAST_INTEREST, today);
        return interest;
      }
    }
    return 0;
  }, [bankBalance]);

  return {
    coins,
    addCoins,
    removeCoins,
    spendCoins,
    bankBalance,
    deposit,
    withdraw,
    calculateDailyInterest,
    interestRate: INTEREST_RATE,
  };
}

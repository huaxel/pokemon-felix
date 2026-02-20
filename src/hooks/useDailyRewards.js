import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'daily_reward_date';

export function useDailyRewards() {
  const [lastClaimDate, setLastClaimDate] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const checkClaimStatus = () => {
      const today = new Date().toDateString();
      if (lastClaimDate !== today) {
        setCanClaim(true);
      } else {
        setCanClaim(false);
      }
    };

    checkClaimStatus();
    // Optional: Setup an interval to check for date change if app stays open long
  }, [lastClaimDate]);

  const claimReward = useCallback(() => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, today);
    setLastClaimDate(today);
    setCanClaim(false);
    return true;
  }, []);

  return {
    canClaim,
    claimReward,
    lastClaimDate,
  };
}

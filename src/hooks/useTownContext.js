import { useContext } from 'react';
import { TownContext } from '../contexts/TownContext';

export function useTownContext() {
  const ctx = useContext(TownContext);
  if (!ctx) throw new Error('useTownContext must be used within TownContext.Provider');
  return ctx;
}

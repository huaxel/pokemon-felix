import { useContext } from 'react';
import { CareContext } from '../contexts/CareContext';

export function useCareContext() {
  const ctx = useContext(CareContext);
  if (!ctx) throw new Error('useCareContext must be used within CareContext.Provider');
  return ctx;
}

import { useEffect } from 'react';
import { useEconomy, useUI } from '../../../../contexts/DomainContexts';

export function BankInterestManager() {
  const { calculateDailyInterest } = useEconomy();
  const { showSuccess } = useUI();

  useEffect(() => {
    const interest = calculateDailyInterest();
    if (interest > 0) {
      showSuccess(`¡Interés ganado! +${interest}`);
    }
  }, [calculateDailyInterest, showSuccess]);

  return null; // Componente lógico, no renderiza nada
}

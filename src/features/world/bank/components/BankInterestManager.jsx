import { useEffect } from 'react';
import { usePokemonContext } from '../../../../hooks/usePokemonContext';

export function BankInterestManager() {
  const { calculateDailyInterest, showSuccess } = usePokemonContext();

  useEffect(() => {
    const interest = calculateDailyInterest();
    if (interest > 0) {
      showSuccess(`¡Interés ganado! +${interest}`);
    }
  }, [calculateDailyInterest, showSuccess]);

  return null; // Componente lógico, no renderiza nada
}

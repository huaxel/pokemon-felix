import { useState, useCallback } from 'react';
import { useEconomy, useDomainCollection } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { getPokemonDetails } from '../../../lib/api';

export function useEncounter({ onBattleEndCustom }) {
  const { showSuccess, showWarning } = useToast();
  const { addCoins, addItem } = useEconomy();
  const { toggleOwned } = useDomainCollection();

  const [encounter, setEncounter] = useState(null);
  const [battleMode, setBattleMode] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [catching, setCatching] = useState(false);
  const [catchMessage, setCatchMessage] = useState('');

  const triggerEncounter = async (pokemonPool, isBossEncounter = false) => {
    const randomId = pokemonPool
      ? pokemonPool[Math.floor(Math.random() * pokemonPool.length)]
      : null;
    if (randomId) {
      const details = await getPokemonDetails(randomId);
      setEncounter(details);
      setIsBoss(isBossEncounter);
    }
  };

  const clearEncounter = useCallback(() => {
    setEncounter(null);
    setBattleMode(false);
    setShowReward(false);
    setIsBoss(false);
    setCatching(false);
    setCatchMessage('');
  }, []);

  const handleCatch = useCallback(() => {
    if (!encounter) return;

    setCatching(true);
    setCatchMessage('Je gooit een PokéBall...');

    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setCatchMessage(`Gotcha! ${encounter.name} is gevangen!`);
        toggleOwned(encounter.id);
        if (isBoss) {
          addCoins(500);
          addItem('rare-candy', 3);
        }
        setTimeout(() => clearEncounter(), 2000);
      } else {
        setCatchMessage(`Oh nee! ${encounter.name} is ontsnapt...`);
        setTimeout(() => clearEncounter(), 1500);
      }
    }, 1500);
  }, [encounter, isBoss, toggleOwned, addCoins, addItem, clearEncounter]);

  const handleBattleEnd = useCallback(
    winner => {
      if (winner && winner.name !== encounter?.name) {
        setShowReward(true);
      } else {
        clearEncounter();
      }
      if (onBattleEndCustom) onBattleEndCustom(winner);
    },
    [encounter, clearEncounter, onBattleEndCustom]
  );

  const handleRewardChoice = useCallback(
    choice => {
      if (choice === 'pokemon') {
        toggleOwned(encounter.id);
        showSuccess(`✅ ${encounter.name} voegde zich bij je team!`);
      } else {
        addCoins(500);
        showWarning(`✅ Je hebt 500 munten gewonnen!`);
      }
      clearEncounter();
    },
    [encounter, toggleOwned, addCoins, showSuccess, showWarning, clearEncounter]
  );

  return {
    encounter,
    setEncounter,
    battleMode,
    showReward,
    isBoss,
    catching,
    catchMessage,
    setBattleMode,
    triggerEncounter,
    clearEncounter,
    handleCatch,
    handleBattleEnd,
    handleRewardChoice,
  };
}

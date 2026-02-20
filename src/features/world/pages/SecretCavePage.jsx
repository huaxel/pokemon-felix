import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { BattleArena } from '../../battle/components/BattleArena';
import { getPokemonDetails } from '../../../lib/api';
import { CaveLockedView } from '../components/CaveLockedView';
import { CaveExplorationView } from '../components/CaveExplorationView';
import { CaveEncounterView } from '../components/CaveEncounterView';
import { BattleRewardModal } from '../components/BattleRewardModal';
import { WorldPageHeader } from '../components/WorldPageHeader';
import './SecretCavePage.css';

export function SecretCavePage() {
  const navigate = useNavigate();
  const { ownedIds, toggleOwned, squadIds, pokemonList, addCoins } = usePokemonContext();
  const [discovered, setDiscovered] = useState(false);
  const [depth, setDepth] = useState(0);
  const [encounter, setEncounter] = useState(null);
  const [catching, setCatching] = useState(false);
  const [catchMessage, setCatchMessage] = useState('');
  const [battleMode, setBattleMode] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const hasRareCandy = ownedIds.length >= 10; // Simple requirement for now

  const handleDiscover = () => {
    setDiscovered(true);
  };

  const handleExplore = async () => {
    const newDepth = depth + Math.floor(Math.random() * 15) + 5;
    setDepth(newDepth);

    const encounterChance = 0.2 + newDepth / 500; // Chance increases with depth
    if (Math.random() < encounterChance) {
      const rarity = Math.random();
      let targetId;

      if (rarity < 0.05 && newDepth > 100) {
        // Legendary
        const legendaries = [144, 145, 146, 150, 151];
        targetId = legendaries[Math.floor(Math.random() * legendaries.length)];
      } else if (rarity < 0.3) {
        // Rare
        const rares = [131, 143, 147, 142];
        targetId = rares[Math.floor(Math.random() * rares.length)];
      } else {
        // Common cave dwellers
        const commons = [41, 74, 111, 27];
        targetId = commons[Math.floor(Math.random() * commons.length)];
      }

      const details = await getPokemonDetails(targetId);
      setEncounter(details);
    }
  };

  const handleCatch = () => {
    setCatching(true);
    setCatchMessage('You threw a PokeBall...');

    setTimeout(() => {
      const success = Math.random() > 0.4;
      if (success) {
        setCatchMessage(`Gotcha! ${encounter.name} was caught!`);
        toggleOwned(encounter.id);
        setTimeout(() => {
          setEncounter(null);
          setCatching(false);
          setCatchMessage('');
        }, 2000);
      } else {
        setCatchMessage(`${encounter.name} broke free!`);
        setTimeout(() => {
          setCatching(false);
          setCatchMessage('');
        }, 1500);
      }
    }, 1500);
  };
  const handleBattleEnd = useCallback(
    winner => {
      if (winner && winner.name !== encounter?.name) {
        setShowReward(true);
      } else {
        setBattleMode(false);
        setEncounter(null);
      }
    },
    [encounter]
  );

  const handleRewardChoice = choice => {
    if (choice === 'pokemon') {
      toggleOwned(encounter.id);
      setCatchMessage(`¡Gotcha! ${encounter.name} se unió a tu equipo.`);
    } else {
      if (addCoins) addCoins(500);
      setCatchMessage(`¡Recibiste 500 monedas!`);
    }

    setShowReward(false);
    setBattleMode(false);
    setEncounter(null);
    setTimeout(() => setCatchMessage(''), 3000);
  };

  if (!hasRareCandy && !discovered) {
    return <CaveLockedView />;
  }

  if (!discovered) {
    return (
      <div className="cave-page entry">
        <WorldPageHeader title="Secret Cave" icon="🕳️" />
        <div className="discovery-screen">
          <div className="discovery-visual">🕳️</div>
          <h2>You found a hidden entrance!</h2>
          <p>The air feels cool and mysterious inside...</p>
          <button className="discover-btn" onClick={handleDiscover}>
            Enter Cave
          </button>
          <Link to="/world" className="cancel-btn">
            Leave it alone
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cave-page active">
      <WorldPageHeader
        title="Secret Cave"
        icon="🕳️"
        onBack={() => (encounter ? setEncounter(null) : navigate('/world'))}
      />

      <main className="cave-main">
        {showReward && <BattleRewardModal pokemon={encounter} onChoice={handleRewardChoice} />}
        {battleMode ? (
          <BattleArena
            initialFighter1={pokemonList.find(p => p.id === squadIds[0])}
            initialFighter2={encounter}
            onBattleEnd={handleBattleEnd}
          />
        ) : encounter ? (
          <CaveEncounterView
            pokemon={encounter}
            catching={catching}
            catchMessage={catchMessage}
            onCatch={handleCatch}
            onFlee={() => setEncounter(null)}
            onFight={() => setBattleMode(true)}
          />
        ) : (
          <CaveExplorationView
            depth={depth}
            onExplore={handleExplore}
            onExit={() => navigate('/world')}
            onReturn={() => setDepth(0)}
          />
        )}
      </main>
    </div>
  );
}

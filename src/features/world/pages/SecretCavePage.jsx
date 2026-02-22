import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDomainCollection, useData } from '../../../contexts/DomainContexts';
import { getPokemonDetails } from '../../../lib/api';
import { CaveLockedView } from '../components/CaveLockedView';
import { CaveExplorationView } from '../components/CaveExplorationView';
import { EncounterModal } from '../components/EncounterModal';
import { useEncounter } from '../hooks/useEncounter';
import { WorldPageHeader } from '../components/WorldPageHeader';
import './SecretCavePage.css';

export function SecretCavePage() {
  const navigate = useNavigate();
  const { ownedIds, squadIds } = useDomainCollection();
  const { pokemonList } = useData();

  const [discovered, setDiscovered] = useState(false);
  const [depth, setDepth] = useState(0);

  const {
    encounter,
    setEncounter,
    battleMode,
    showReward,
    isBoss,
    catching,
    catchMessage,
    setBattleMode,
    clearEncounter,
    handleCatch,
    handleBattleEnd,
    handleRewardChoice,
  } = useEncounter({});

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
        {encounter ? (
          <EncounterModal
            encounter={encounter}
            showReward={showReward}
            battleMode={battleMode}
            isBoss={isBoss}
            catching={catching}
            catchMessage={catchMessage}
            onRewardChoice={handleRewardChoice}
            onBattleEnd={handleBattleEnd}
            onCatch={handleCatch}
            onFight={() => setBattleMode(true)}
            onFlee={clearEncounter}
            pokemonList={pokemonList}
            squadIds={squadIds}
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

import { useState, useEffect } from 'react';
import { useDomainCollection, useEconomy } from '../../../contexts/DomainContexts';
import { BattleArena } from '../../battle/components/BattleArena';
import { getPokemonDetails } from '../../../lib/api';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { GymCard } from '../components/GymCard';
import { GymBadgeDisplay } from '../components/GymBadgeDisplay';
import { GYM_LEADERS } from '../gymConfig';
import { grassTile, bagIcon } from '../worldAssets';
import './GymPage.css';

export function GymPage() {
  const { squadIds } = useDomainCollection();
  const { addCoins } = useEconomy();
  const [selectedGym, setSelectedGym] = useState(null);
  const [battleState, setBattleState] = useState('select');
  const [currentStage, setCurrentStage] = useState(0);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [badges, setBadges] = useState(() =>
    JSON.parse(localStorage.getItem('gym_badges') || '{}')
  );

  useEffect(() => {
    localStorage.setItem('gym_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    if (selectedGym && battleState === 'battle') {
      (async () => {
        setIsLoading(true);
        const details = await getPokemonDetails(selectedGym.pokemon[currentStage]);
        if (details) setOpponentPokemon(details);
        setIsLoading(false);
      })();
    }
  }, [selectedGym, currentStage, battleState]);

  const handleBattleEnd = winnerPokemon => {
    if (squadIds.includes(winnerPokemon.id)) {
      if (currentStage < selectedGym.pokemon.length - 1)
        setTimeout(() => setCurrentStage(prev => prev + 1), 1500);
      else {
        setTimeout(() => {
          addCoins(selectedGym.reward);
          setBadges(prev => ({ ...prev, [selectedGym.id]: true }));
          setBattleState('victory');
        }, 1500);
      }
    } else {
      setBattleState('select');
      setSelectedGym(null);
    }
  };

  const handleSelectGym = gym => {
    setSelectedGym(gym);
    setCurrentStage(0);
    setBattleState('battle');
  };

  if (battleState === 'battle' && selectedGym) {
    return (
      <div
        className="gym-page battle-view gym-environment-bg"
        style={{ backgroundImage: `url(${grassTile})` }}
      >
        <div
          className="gym-battle-header game-panel"
          style={{ borderColor: selectedGym.color }}
        >
          <h2 className="gym-battle-title">
            Vechten tegen {selectedGym.name} - Fase {currentStage + 1}
          </h2>
        </div>
        {isLoading || !opponentPokemon ? (
          <div className="loading-gym game-panel">
            <p className="gym-loading-text">Gevecht voorbereiden...</p>
          </div>
        ) : (
          <BattleArena
            key={`${selectedGym.id}-${currentStage}`}
            initialFighter2={opponentPokemon}
            onBattleEnd={handleBattleEnd}
          />
        )}
      </div>
    );
  }

  if (battleState === 'victory' && selectedGym) {
    return (
      <div
        className="gym-victory-view gym-environment-bg centered-view"
        style={{ backgroundImage: `url(${grassTile})` }}
      >
        <div className="victory-card game-panel">
          <h1 className="gym-victory-title">
            Gym van {selectedGym.name} Verslagen!
          </h1>
          <div className="reward-info">
            <h2 className="gym-reward-text">
              Beloning:{' '}
              <img
                src={bagIcon}
                alt="coins"
                className="gym-reward-icon"
              />{' '}
              {selectedGym.reward}
            </h2>
          </div>
          <button
            className="btn-kenney primary gym-victory-btn"
            onClick={() => {
              setBattleState('select');
              setSelectedGym(null);
            }}
          >
            Terug naar Kaart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="gym-page gym-environment-bg"
      style={{ backgroundImage: `url(${grassTile})` }}
    >
      <WorldPageHeader title="Pokémon Gyms" icon="🏟️" />
      <div className="gym-content">
        <GymBadgeDisplay badges={badges} gymLeaders={GYM_LEADERS} />
        <div className="gym-grid">
          {GYM_LEADERS.map(gym => (
            <GymCard key={gym.id} gym={gym} isBeaten={badges[gym.id]} onSelect={handleSelectGym} />
          ))}
        </div>
      </div>
    </div>
  );
}

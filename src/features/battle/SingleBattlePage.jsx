import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDomainCollection, useEconomy, useExperience } from '../../contexts/DomainContexts';
import { BattleArena } from './components/BattleArena';
import { BattleRewardModal } from '../world/components/BattleRewardModal';
import { getPokemonDetails } from '../../lib/api';
import { grassTile } from '../world/worldAssets';
import './SingleBattlePage.css';

import { useToast } from '../../hooks/useToast'; // Correct import

export function SingleBattlePage({ allPokemon }) {
  const { squadIds, toggleOwned } = useDomainCollection();
  const { addCoins } = useEconomy();
  const { gainExperience } = useExperience();
  const { addToast } = useToast();
  const location = useLocation();
  const isWild = location.state?.isWild || false;

  const [opponent, setOpponent] = useState(null);
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [battleState, setBattleState] = useState('loading'); // loading, battle, victory, defeat
  const [showReward, setShowReward] = useState(false);

  const isLegendary = location.state?.isLegendary || false;

  const startBattle = useCallback(async () => {
    // Get user's first squad member (or random from squad)
    const userSquad = allPokemon.filter(p => squadIds.includes(p.id));
    const player = userSquad[0]; // Simple: use first pokemon

    // Get random opponent (excluding squad)
    let potentialOpponents;
    if (isLegendary) {
      const LEGENDARY_IDS = [144, 145, 146, 150, 151];
      potentialOpponents = allPokemon.filter(p => LEGENDARY_IDS.includes(p.id));
    } else {
      potentialOpponents = allPokemon.filter(p => !squadIds.includes(p.id));
    }

    // Fallback if no legendaries found (shouldn't happen if data loaded)
    if (potentialOpponents.length === 0) {
      potentialOpponents = allPokemon.filter(p => !squadIds.includes(p.id));
    }

    const randomOpponent =
      potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];

    if (!player || !randomOpponent) return;

    try {
      // Fetch full details to ensure moves are calculated correctly
      const [playerDetails, opponentDetails] = await Promise.all([
        getPokemonDetails(player.id),
        getPokemonDetails(randomOpponent.id),
      ]);

      setPlayerPokemon(playerDetails);
      setOpponent(opponentDetails);
      setBattleState('battle');
    } catch (error) {
      console.error('Failed to start battle:', error);
      // Fallback to basic data if fetch fails (better than nothing)
      setPlayerPokemon(player);
      setOpponent(randomOpponent);
      setBattleState('battle');
    }
  }, [allPokemon, squadIds, isLegendary]);

  useEffect(() => {
    if (allPokemon && allPokemon.length > 0 && squadIds.length > 0) {
      startBattle();
    }
  }, [allPokemon, squadIds, startBattle]);

  const handleBattleEnd = winner => {
    if (winner.id === playerPokemon.id) {
      if (isWild) {
        setShowReward(true);
      } else {
        setBattleState('victory');
        addCoins(50);
        const { leveledUp, newLevel } = gainExperience(playerPokemon.id, 50);
        if (leveledUp) addToast(`¡${playerPokemon.name} is nu level ${newLevel}!`, 'success');
      }
    } else {
      setBattleState('defeat');
    }
  };

  const handleRewardChoice = choice => {
    if (choice === 'pokemon') {
      toggleOwned(opponent.id);
    } else {
      addCoins(500);
    }
    setShowReward(false);
    const { leveledUp, newLevel } = gainExperience(playerPokemon.id, 50);
    if (leveledUp) addToast(`¡${playerPokemon.name} is nu level ${newLevel}!`, 'success');
    setBattleState('victory'); // Now show victory screen
  };
  // ... (rest of render logic is fine until return)

  if (battleState === 'loading' || !playerPokemon || !opponent) {
    return (
      <div
        className="single-battle-page loading"
        style={{
          backgroundColor: '#2d1810',
          backgroundImage: `url(${grassTile})`,
          backgroundSize: '64px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
          fontFamily: '"Press Start 2P", cursive',
        }}
      >
        Gevecht voorbereiden...
      </div>
    );
  }

  if (battleState === 'victory') {
    return (
      <div
        className="single-battle-page result victory"
        style={{
          backgroundColor: '#2d1810',
          backgroundImage: `url(${grassTile})`,
          backgroundSize: '64px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '2rem',
        }}
      >
        <h1
          style={{
            fontFamily: '"Press Start 2P", cursive',
            textShadow: '2px 2px 0 #000',
            color: '#fbbf24',
            fontSize: '3rem',
          }}
        >
          Overwinning!
        </h1>
        <div
          className="result-card game-panel-dark"
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          <img
            src={playerPokemon.sprites.other['official-artwork'].front_default}
            alt={playerPokemon.name}
            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
          />
          <p
            style={{
              fontFamily: '"Press Start 2P", cursive',
              marginTop: '1rem',
              fontSize: '1.2rem',
            }}
          >
            {playerPokemon.name} heeft gewonnen!
          </p>
          <div
            className="reward-badge"
            style={{ marginTop: '1rem', color: '#fbbf24', fontFamily: '"Press Start 2P", cursive' }}
          >
            +50 Munten
          </div>
          <div
            className="reward-badge exp"
            style={{ color: '#60a5fa', fontFamily: '"Press Start 2P", cursive' }}
          >
            +50 EXP
          </div>
        </div>
        <div className="actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="replay-btn btn-kenney primary" onClick={startBattle}>
            Nog een keer
          </button>
          <Link
            to="/adventure"
            className="back-btn btn-kenney neutral"
            style={{ textDecoration: 'none' }}
          >
            Terug naar de Wereld
          </Link>
        </div>
      </div>
    );
  }

  if (battleState === 'defeat') {
    return (
      <div
        className="single-battle-page result defeat"
        style={{
          backgroundColor: '#2d1810',
          backgroundImage: `url(${grassTile})`,
          backgroundSize: '64px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '2rem',
        }}
      >
        <h1
          style={{
            fontFamily: '"Press Start 2P", cursive',
            textShadow: '2px 2px 0 #000',
            color: '#ef4444',
            fontSize: '3rem',
          }}
        >
          Nederlaag
        </h1>
        <div
          className="result-card game-panel-dark"
          style={{ textAlign: 'center', padding: '2rem' }}
        >
          <img
            src={opponent.sprites.other['official-artwork'].front_default}
            alt={opponent.name}
            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
          />
          <p
            style={{
              fontFamily: '"Press Start 2P", cursive',
              marginTop: '1rem',
              fontSize: '1.2rem',
            }}
          >
            {opponent.name} heeft je verslagen.
          </p>
        </div>
        <div className="actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="replay-btn btn-kenney warning" onClick={startBattle}>
            Probeer Opnieuw
          </button>
          <Link
            to="/adventure"
            className="back-btn btn-kenney neutral"
            style={{ textDecoration: 'none' }}
          >
            Terug naar de Wereld
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="single-battle-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
        minHeight: '100vh',
      }}
    >
      <div className="battle-header-simple" style={{ padding: '1rem' }}>
        <Link
          to="/adventure"
          className="close-btn btn-kenney neutral"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            width: '40px',
            height: '40px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          ✕
        </Link>
      </div>
      {showReward ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
          }}
        >
          <BattleRewardModal pokemon={opponent} onChoice={handleRewardChoice} />
        </div>
      ) : (
        <BattleArena
          key={`${playerPokemon.id}-${opponent.id}`} // Force reset
          initialFighter1={playerPokemon}
          initialFighter2={opponent}
          onBattleEnd={handleBattleEnd}
        />
      )}
    </div>
  );
}

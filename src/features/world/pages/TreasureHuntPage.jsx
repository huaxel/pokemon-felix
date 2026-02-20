import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { TreasureTutorial } from '../components/TreasureTutorial';
import { TreasureHuntingView } from '../components/TreasureHuntingView';
import { TreasureSuccessView } from '../components/TreasureSuccessView';
import { TreasureFailedView } from '../components/TreasureFailedView';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile } from '../worldAssets';
import './TreasureHuntPage.css';

const TREASURE_HUNTS = [
  {
    id: 1,
    difficulty: 'Makkelijk',
    target: { x: 5, y: 5 },
    clue: 'De schat ligt in het centrum van de stad, waar Professor Oak vaak staat!',
    reward: 300,
    pokemonReward: 'pikachu',
  },
  {
    id: 2,
    difficulty: 'Makkelijk',
    target: { x: 8, y: 8 },
    clue: 'Kijk in de zuidoostelijke hoek, vlakbij de Gacha machine!',
    reward: 350,
    pokemonReward: 'eevee',
  },
  {
    id: 3,
    difficulty: 'Gemiddeld',
    target: { x: 3, y: 7 },
    clue: 'De schat is ten westen van het pad, vlakbij het Gym gebouw!',
    reward: 500,
    pokemonReward: 'bulbasaur',
  },
  {
    id: 4,
    difficulty: 'Gemiddeld',
    target: { x: 9, y: 4 },
    clue: 'Zoek in het oostelijke watergebied, bij het Fonteinplein!',
    reward: 550,
    pokemonReward: 'squirtle',
  },
  {
    id: 5,
    difficulty: 'Moeilijk',
    target: { x: 1, y: 1 },
    clue: 'In de noordwestelijke hoek van de wereld, waar weinig reizigers komen...',
    reward: 800,
    pokemonReward: 'charmander',
  },
  {
    id: 6,
    difficulty: 'Moeilijk',
    target: { x: 6, y: 9 },
    clue: 'Aan de zuidelijke grens, vlakbij de Evolutiehal!',
    reward: 850,
    pokemonReward: 'dratini',
  },
  {
    id: 7,
    difficulty: 'Expert',
    target: { x: 9, y: 7 },
    clue: 'Hoog in de bergen, waar de lucht ijl is...',
    reward: 1200,
    pokemonReward: 'larvitar',
  },
  {
    id: 8,
    difficulty: 'Expert',
    target: { x: 0, y: 0 },
    clue: 'Het meest noordwestelijke punt van de hele wereld!',
    reward: 1500,
    pokemonReward: 'beldum',
  },
];

export function TreasureHuntPage() {
  const navigate = useNavigate();
  const { addCoins, getPokemonDetails } = usePokemonContext();
  const [stage, setStage] = useState('tutorial');
  const [currentHunt, setCurrentHunt] = useState(null);
  const [huntsCompleted, setHuntsCompleted] = useState(0);
  const [playerGuess, setPlayerGuess] = useState({ x: '', y: '' });
  const [attempts, setAttempts] = useState(0);
  const [distance, setDistance] = useState(null);
  const [message, setMessage] = useState('');
  const [rewardPokemon, setRewardPokemon] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('treasure_hunts_completed');
    if (saved) setHuntsCompleted(parseInt(saved));
  }, []);

  const calculateDistance = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  const getDirectionHint = (guessX, guessY, targetX, targetY) => {
    const dx = targetX - guessX;
    const dy = targetY - guessY;
    let direction = '';
    if (Math.abs(dy) > 0.5) direction += dy < 0 ? 'Noord' : 'Zuid';
    if (Math.abs(dx) > 0.5) direction += dx < 0 ? 'West' : 'Oost';
    return direction || 'Heel dichtbij!';
  };

  const startNewHunt = () => {
    const availableHunts = TREASURE_HUNTS.filter(h => h.id > huntsCompleted);
    if (availableHunts.length === 0) {
      setMessage('🎉 Je hebt alle schattenjachten voltooid! Geweldig!');
      return;
    }
    setCurrentHunt(availableHunts[0]);
    setStage('hunting');
    setAttempts(0);
    setDistance(null);
    setPlayerGuess({ x: '', y: '' });
    setMessage('');
  };

  const handleGuess = async () => {
    const guessX = parseInt(playerGuess.x);
    const guessY = parseInt(playerGuess.y);
    if (isNaN(guessX) || isNaN(guessY)) {
      setMessage('❌ Voer geldige getallen in!');
      return;
    }
    if (guessX < 0 || guessX > 9 || guessY < 0 || guessY > 9) {
      setMessage('❌ Coördinaten moeten tussen 0 en 9 liggen!');
      return;
    }

    setAttempts(prev => prev + 1);
    if (guessX === currentHunt.target.x && guessY === currentHunt.target.y) {
      const pokemon = await getPokemonDetails(currentHunt.pokemonReward);
      setRewardPokemon(pokemon);
      setStage('success');
      addCoins(currentHunt.reward);
      const newCompleted = huntsCompleted + 1;
      setHuntsCompleted(newCompleted);
      localStorage.setItem('treasure_hunts_completed', newCompleted.toString());
      setMessage(`🎉 Schat gevonden!`);
    } else {
      const dist = calculateDistance(guessX, guessY, currentHunt.target.x, currentHunt.target.y);
      setDistance(dist);
      const direction = getDirectionHint(
        guessX,
        guessY,
        currentHunt.target.x,
        currentHunt.target.y
      );
      if (dist < 2) setMessage(`🔥 Heel dichtbij! Probeer naar ${direction} te gaan!`);
      else if (dist < 4) setMessage(`⚠️ Je wordt warmer! Ga naar ${direction}!`);
      else setMessage(`❄️ Nog ver weg. Ga naar ${direction}!`);
      if (attempts >= 9) {
        setStage('failed');
        setMessage(`😔 Geen pogingen meer!`);
      }
    }
  };

  return (
    <div
      className="treasure-hunt-page-wrapper"
      style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
    >
      <WorldPageHeader title="Schattenjacht" icon="🗺️" />
      {stage === 'tutorial' && (
        <TreasureTutorial
          huntsCompleted={huntsCompleted}
          totalHunts={TREASURE_HUNTS.length}
          onStart={startNewHunt}
          onBack={() => navigate('/adventure')}
        />
      )}
      {stage === 'hunting' && (
        <TreasureHuntingView
          onBack={() => setStage('tutorial')}
          currentHunt={currentHunt}
          attempts={attempts}
          distance={distance}
          message={message}
          playerGuess={playerGuess}
          setPlayerGuess={setPlayerGuess}
          onGuess={handleGuess}
        />
      )}
      {stage === 'success' && (
        <TreasureSuccessView
          currentHunt={currentHunt}
          attempts={attempts}
          rewardPokemon={rewardPokemon}
          onNext={startNewHunt}
        />
      )}
      {stage === 'failed' && (
        <TreasureFailedView
          currentHunt={currentHunt}
          onRestart={() => {
            setAttempts(0);
            setStage('hunting');
            setMessage('');
          }}
          onBack={() => setStage('tutorial')}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { useEconomy } from '../../../contexts/DomainContexts';
import { getPokemonDetails } from '../../../lib/api';
import { MountainEntryView } from '../components/MountainEntryView';
import { MountainHikeView } from '../components/MountainHikeView';
import { ALTITUDE_STAGES } from '../mountainConfig';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile } from '../worldAssets';
import './MountainPage.css';

export function MountainPage() {
  const { inventory, addItem, addCoins } = useEconomy();
  const [stage, setStage] = useState('entry');
  const [altitude, setAltitude] = useState(0);
  const [tiredness, setTiredness] = useState(0);
  const [foundPokemon, setFoundPokemon] = useState(null);
  const [message, setMessage] = useState('');

  const handleClimb = async () => {
    const idx = Math.floor(altitude / 500);
    if (idx >= ALTITUDE_STAGES.length) return setStage('summit');
    const nextAlt = (idx + 1) * 500;
    const newTired = Math.min(100, tiredness + Math.floor(Math.random() * 30) + 15);
    setAltitude(nextAlt);
    setTiredness(newTired);
    if (Math.random() < 0.4) {
      const p = await getPokemonDetails(
        ALTITUDE_STAGES[idx].pokemon[
          Math.floor(Math.random() * ALTITUDE_STAGES[idx].pokemon.length)
        ]
      );
      setFoundPokemon(p);
      setMessage(`🔔 Je hebt een ${p.name} gevonden!`);
    } else setMessage(`📍 Je bent geklommen naar ${nextAlt}m`);
    if (newTired >= 100) setStage('resting');
  };

  const handleExit = () => {
    setStage('entry');
    setAltitude(0);
    setTiredness(0);
    setFoundPokemon(null);
    setMessage('');
  };

  if (stage === 'entry')
    return (
      <div
        className="mountain-page"
        style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
      >
        <WorldPageHeader title="Bergtoppen" icon="⛰️" />
        <MountainEntryView
          hasBoots={inventory?.hiking_boots}
          zones={ALTITUDE_STAGES}
          onStartHike={() => setStage('hiking')}
        />
      </div>
    );

  if (stage === 'hiking')
    return (
      <div
        className="mountain-page"
        style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
      >
        <WorldPageHeader title="Bergtoppen" icon="⛰️" />
        <MountainHikeView
          altitude={altitude}
          tiredness={tiredness}
          currentStage={ALTITUDE_STAGES[Math.floor(altitude / 500)]}
          foundPokemon={foundPokemon}
          message={message}
          onExit={handleExit}
          onClimb={handleClimb}
          onRest={() => setStage('resting')}
          onCatch={() => {
            addItem('pokeball', -1);
            addCoins(100);
            setFoundPokemon(null);
          }}
          onPass={() => setFoundPokemon(null)}
        />
      </div>
    );

  if (stage === 'resting')
    return (
      <div
        className="mountain-page resting"
        style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
      >
        <WorldPageHeader title="Bergtoppen" icon="⛰️" />
        <div className="rest-scene">
          <h2>😴 Rusten</h2>
          <div className="rest-progress">
            <div className="rest-bar">
              <div className="rest-fill" style={{ width: `${100 - tiredness}%` }}></div>
            </div>
          </div>
          <button
            className="btn-kenney warning"
            onClick={() => setTiredness(t => Math.max(0, t - 30))}
          >
            ⏳ Meer rusten
          </button>
          {tiredness <= 30 && (
            <button className="btn-kenney primary" onClick={() => setStage('hiking')}>
              ✨ Doorgaan
            </button>
          )}
        </div>
      </div>
    );

  if (stage === 'summit')
    return (
      <div
        className="mountain-page summit"
        style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
      >
        <WorldPageHeader title="Bergtoppen" icon="⛰️" />
        <div className="summit-scene">
          <h1>🏔️ Top Bereikt!</h1>
          <div className="rewards">
            <div className="reward">💰 1000</div>
            <div className="reward">🍭 Rare Candy</div>
          </div>
          <button className="btn-kenney primary" onClick={handleExit}>
            🌄 Afdalen
          </button>
        </div>
      </div>
    );
}

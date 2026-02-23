import { useState, useEffect } from 'react';
import { useEconomy, useDomainCollection } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { getPokemonDetails } from '../../../lib/api';
import { desertCactusTile, waterImage, playerTile } from '../worldAssets';
import './DesertPage.css';

const DESERT_SIZE = 10;
const DESERT_POKEMON = [27, 28, 50, 51, 74, 75, 95, 104, 105, 111]; // Sandshrew, Diglett, Geodude, Cubone, Rhyhorn
const OASIS_POKEMON = [60, 61, 116, 117, 129]; // Poliwag, Horsea, Magikarp (water types in oasis)

const GEOGRAPHY_FACTS = [
  '🏜️ Woestijnen bedekken ongeveer 1/3 van het landoppervlak.',
  '💧 Oases zijn van vitaal belang voor het leven in de woestijn - het zijn waterbronnen!',
  "🌡️ Woestijnen kunnen overdag erg heet zijn en 's nachts koud.",
  '🌵 Cactussen slaan water op in hun stengels om te overleven.',
  '🐪 Woestijndieren zijn aangepast om weinig water nodig te hebben.',
];

export function DesertPage() {
  const { addCoins } = useEconomy();
  const { toggleOwned } = useDomainCollection();
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [encounter, setEncounter] = useState(null);
  const [sandstorm, setSandstorm] = useState(false);
  const [discoveredOases, setDiscoveredOases] = useState([]);
  const [showFact, setShowFact] = useState(true);
  const { showSuccess, showError } = useToast();

  // Generate oasis positions (3 random positions)
  const [oases] = useState(() => {
    const positions = [];
    for (let i = 0; i < 3; i++) {
      positions.push({
        x: Math.floor(Math.random() * DESERT_SIZE),
        y: Math.floor(Math.random() * DESERT_SIZE),
      });
    }
    return positions;
  });

  // Sandstorm effect (periodic)
  useEffect(() => {
    const interval = setInterval(() => {
      setSandstorm(prev => !prev);
    }, 15000); // Toggle every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const isOasis = (x, y) => {
    return oases.some(oasis => oasis.x === x && oasis.y === y);
  };

  const handleMove = (dx, dy) => {
    const newX = Math.max(0, Math.min(DESERT_SIZE - 1, playerPos.x + dx));
    const newY = Math.max(0, Math.min(DESERT_SIZE - 1, playerPos.y + dy));

    setPlayerPos({ x: newX, y: newY });

    // Check for oasis discovery
    if (isOasis(newX, newY) && !discoveredOases.some(o => o.x === newX && o.y === newY)) {
      setDiscoveredOases(prev => [...prev, { x: newX, y: newY }]);
      showSuccess('💧 Je hebt een oase gevonden! Je kunt hier uitrusten.');
      addCoins(100);
      return;
    }

    // Random encounter (30% chance, lower during sandstorm)
    const encounterChance = sandstorm ? 0.15 : 0.3;
    if (Math.random() < encounterChance) {
      triggerEncounter(newX, newY);
    }
  };

  const triggerEncounter = async (x, y) => {
    const pokemonPool = isOasis(x, y) ? OASIS_POKEMON : DESERT_POKEMON;
    const randomId = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
    const details = await getPokemonDetails(randomId);
    setEncounter(details);
  };

  const handleCatch = () => {
    if (encounter) {
      const success = Math.random() > 0.4;
      if (success) {
        toggleOwned(encounter.id);
        showSuccess(`✅ Je hebt ${encounter.name} gevangen!`);
        addCoins(50);
        setEncounter(null);
      } else {
        showError(`❌ ${encounter.name} is ontsnapt...`);
        setEncounter(null);
      }
    }
  };

  const getTileContent = (x, y) => {
    if (x === playerPos.x && y === playerPos.y) {
      return (
        <img
          src={playerTile}
          alt="Player"
          style={{ width: '80%', height: '80%', imageRendering: 'pixelated' }}
        />
      );
    }
    if (isOasis(x, y)) {
      if (discoveredOases.some(o => o.x === x && o.y === y)) {
        return (
          <img
            src={waterImage}
            alt="Oasis"
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated', opacity: 0.8 }}
          />
        );
      }
      return null; // Hidden oasis looks like sand
    }
    // Deterministic cactus placement based on coordinates to avoid re-render flickering
    if ((x * 7 + y * 13) % 10 > 7) {
      return (
        <img
          src={desertCactusTile}
          alt="Cactus"
          style={{ width: '80%', height: '80%', imageRendering: 'pixelated' }}
        />
      );
    }
    return null;
  };

  return (
    <div
      className={`desert-page ${sandstorm ? 'sandstorm' : ''}`}
      style={{
        backgroundColor: '#d97706', // Sandy color
        backgroundImage: `url(${desertCactusTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <WorldPageHeader title="Mysterieuze Woestijn" icon="🏜️" />

      {sandstorm && (
        <div
          className="sandstorm-warning"
          style={{
            backgroundColor: 'rgba(251, 191, 36, 0.8)',
            color: '#000',
            padding: '0.5rem',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          ⚠️ Zandstorm! Het zicht is beperkt.
        </div>
      )}

      {showFact && (
        <div
          className="geography-fact game-panel"
          style={{
            border: '4px solid #92400e',
            backgroundColor: '#fef3c7',
            padding: '1rem',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          {GEOGRAPHY_FACTS[Math.floor(Math.random() * GEOGRAPHY_FACTS.length)]}
          <button
            className="fact-close"
            onClick={() => setShowFact(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        className="desert-stats game-panel-dark"
        style={{
          border: '4px solid #4b5563',
          backgroundColor: '#1f2937',
          padding: '0.5rem',
          color: '#fff',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
        }}
      >
        <span>
          Positie: ({playerPos.x}, {playerPos.y})
        </span>
        <span>Oases ontdekt: {discoveredOases.length}/3</span>
      </div>

      <div
        className="desert-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${DESERT_SIZE}, 1fr)`,
          gap: '2px',
          backgroundColor: '#78350f',
          padding: '4px',
          borderRadius: '4px',
        }}
      >
        {Array.from({ length: DESERT_SIZE }).map((_, y) =>
          Array.from({ length: DESERT_SIZE }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={`desert-tile ${x === playerPos.x && y === playerPos.y ? 'player' : ''} ${isOasis(x, y) ? 'oasis' : ''}`}
              style={{
                backgroundColor:
                  isOasis(x, y) && discoveredOases.some(o => o.x === x && o.y === y)
                    ? '#3b82f6'
                    : '#fcd34d',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                border: x === playerPos.x && y === playerPos.y ? '2px solid #ef4444' : 'none',
              }}
            >
              {getTileContent(x, y)}
            </div>
          ))
        )}
      </div>

      <div
        className="desert-controls"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        <button className="btn-kenney" onClick={() => handleMove(0, -1)}>
          ⬆️
        </button>
        <div className="control-row" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-kenney" onClick={() => handleMove(-1, 0)}>
            ⬅️
          </button>
          <button className="btn-kenney" onClick={() => handleMove(1, 0)}>
            ➡️
          </button>
        </div>
        <button className="btn-kenney" onClick={() => handleMove(0, 1)}>
          ⬇️
        </button>
      </div>

      {encounter && (
        <div
          className="encounter-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <div
            className="encounter-content game-panel"
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '1rem',
              border: '4px solid #4b5563',
              maxWidth: '90%',
            }}
          >
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              Wilde Pokémon!
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <img
                src={encounter.sprites.front_default}
                alt={encounter.name}
                style={{ imageRendering: 'pixelated', width: '128px', height: '128px' }}
              />
            </div>
            <h3
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.8rem',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              {encounter.name}
            </h3>
            <div
              className="encounter-actions"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <button className="catch-btn btn-kenney success" onClick={handleCatch}>
                ⚾ Vangen
              </button>
              <button className="flee-btn btn-kenney neutral" onClick={() => setEncounter(null)}>
                🏃 Vluchten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useEconomy, useDomainCollection } from '../../../contexts/DomainContexts';
import { getPokemonDetails } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';
import { WaterIntroView } from '../components/WaterIntroView';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import './WaterRoutePage.css';

const WATER_POKEMON = [
  'magikarp',
  'goldeen',
  'psyduck',
  'poliwag',
  'tentacool',
  'horsea',
  'krabby',
  'shellder',
  'staryu',
  'slowpoke',
  'seel',
  'dewgong',
  'lapras',
  'vaporeon',
  'gyarados',
];

const WATER_ROUTE_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.WATER;
    if (y === 5 && xIndex >= 2 && xIndex <= 5) return TILE_TYPES.PATH;
    if (y === 4 && xIndex === 3) return TILE_TYPES.FISHERMAN;
    return TILE_TYPES.WATER;
  }),
);

export function WaterRoutePage() {
  const navigate = useNavigate();
  const { inventory, addCoins } = useEconomy();
  const { toggleOwned } = useDomainCollection();
  const [canSurf, setCanSurf] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [encounter, setEncounter] = useState(null);
  const [exploring, setExploring] = useState(false);
  const [message, setMessage] = useState('');
  const [treasureFound, setTreasureFound] = useState([]);

  useEffect(() => {
    setCanSurf((inventory && inventory.surf) || localStorage.getItem('learned_surf') === 'true');
  }, [inventory]);

  const handleMove = (dx, dy) => {
    const nx = Math.max(0, Math.min(9, position.x + dx)),
      ny = Math.max(0, Math.min(9, position.y + dy));
    setPosition({ x: nx, y: ny });
    if (Math.random() < 0.3) {
      (async () => {
        const p = await getPokemonDetails(
          WATER_POKEMON[Math.floor(Math.random() * WATER_POKEMON.length)]
        );
        if (Math.random() < 0.02) p.shiny = true;
        setEncounter(p);
        setMessage(`🌊 A wild ${p.name} appeared!`);
      })();
    }
    if (!treasureFound.includes(`${nx},${ny}`) && Math.random() < 0.15) {
      const amt = Math.floor(Math.random() * 200) + 50;
      addCoins(amt);
      setMessage(`💎 Found treasure! +${amt}`);
      setTreasureFound(prev => [...prev, `${nx},${ny}`]);
    }
  };

  const handleCatch = () => {
    if (Math.random() < (encounter.shiny ? 0.2 : 0.6)) {
      toggleOwned(encounter.id);
      addCoins(encounter.shiny ? 500 : 150);
      setMessage(`✨ Caught ${encounter.name}!`);
      setEncounter(null);
    } else {
      setMessage(`💨 ${encounter.name} swam away!`);
      setEncounter(null);
    }
  };

  if (!canSurf && !exploring)
    return (
      <WaterIntroView
        onLearn={() => {
          localStorage.setItem('learned_surf', 'true');
          setCanSurf(true);
          setExploring(true);
        }}
        onExit={() => navigate('/adventure')}
      />
    );

  return (
    <div className="water-route-page surfing">
      <div className="waterroute-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={WATER_ROUTE_GRID}
            onObjectClick={undefined}
            isNight={false}
            enableSky={false}
          />
        </Canvas>
      </div>
      <div className="water-header">
        <h2>🌊 Water Route</h2>
        <button className="exit-btn" onClick={() => navigate('/adventure')}>
          Exit
        </button>
      </div>
      <div className="position-display">
        Position: ({position.x}, {position.y}) | Treasures: {treasureFound.length}
      </div>
      {message && <div className="water-message">{message}</div>}
      {encounter ? (
        <div className="water-encounter">
          <img
            src={encounter.sprites?.front_default}
            alt={encounter.name}
            className={encounter.shiny ? 'shiny' : ''}
          />
          <h3>
            {encounter.name} {encounter.shiny && '✨'}
          </h3>
          <div className="encounter-actions">
            <button onClick={handleCatch}>🎣 Catch</button>
            <button onClick={() => setEncounter(null)}>🏊 Swim Away</button>
          </div>
        </div>
      ) : (
        <>
          <div className="water-grid">
            {Array(10)
              .fill(0)
              .map((_, y) => (
                <div key={y} className="water-row">
                  {Array(10)
                    .fill(0)
                    .map((_, x) => (
                      <div
                        key={`${x}-${y}`}
                        className={`water-tile ${position.x === x && position.y === y ? 'player' : ''} ${treasureFound.includes(`${x},${y}`) ? 'explored' : ''}`}
                      >
                        {position.x === x && position.y === y ? '🏄' : '🌊'}
                      </div>
                    ))}
                </div>
              ))}
          </div>
          <div className="surf-controls">
            <div className="d-pad">
              <button onClick={() => handleMove(0, -1)}>⬆️</button>
              <div className="middle">
                <button onClick={() => handleMove(-1, 0)}>⬅️</button>
                <div className="center"></div>
                <button onClick={() => handleMove(1, 0)}>➡️</button>
              </div>
              <button onClick={() => handleMove(0, 1)}>⬇️</button>
            </div>
          </div>
        </>
      )}
      <div className="water-guide">
        <h3>🌊 Guide</h3>
        <ul>
          <li>🎮 Surf around</li>
          <li>🌊 30% encounter</li>
          <li>💎 15% treasure</li>
          <li>✨ 2% shiny</li>
        </ul>
      </div>
    </div>
  );
}

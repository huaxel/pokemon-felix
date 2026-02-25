import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useCare } from '../../../contexts/DomainContexts';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { TILE_TYPES } from '../worldConstants';
import { grassTile, nurseTile } from '../worldAssets';
import healingMachineImage from '../../../assets/buildings/healing_machine.png';
import './PokemonCenterPage.css';

const CENTER_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.GRASS;
    if (y === 3 && xIndex === 4) return TILE_TYPES.CENTER;
    if (y === 4 && xIndex === 4) return TILE_TYPES.CENTER;
    if (xIndex === 4) return TILE_TYPES.PATH;
    return TILE_TYPES.GRASS;
  }),
);

export function PokemonCenterPage() {
  const navigate = useNavigate();
  const { healAll } = useCare();
  const [healingState, setHealingState] = useState('idle'); // idle, healing, finished
  const [message, setMessage] = useState('Welkom in het Pokémon Center! Wil je je team genezen?');

  const handleHeal = () => {
    setHealingState('healing');
    setMessage('Een moment geduld alstublieft!');

    // Animation sequence
    setTimeout(() => {
      setMessage('Ding... Ding... Ding... Dong! 🎵');
      healAll();
      setHealingState('finished');

      setTimeout(() => {
        setMessage('Je team is hersteld! Tot ziens!');
        setHealingState('done');
      }, 1500);
    }, 3000);
  };

  return (
    <div
      className="pokemon-center-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <WorldPageHeader title="Pokémon Center" icon="🏥" backPath="/adventure" />

      <div className="center-content">
        <div className="center-3d-bg">
          <Canvas
            shadows={false}
            dpr={[1, 1.5]}
            gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
            camera={{ position: [3.5, 4.5, 8], fov: 55 }}
          >
            <WorldScene3DMain
              mapGrid={CENTER_GRID}
              onObjectClick={undefined}
              isNight={false}
              enableSky={false}
            />
          </Canvas>
        </div>
        <div className="healing-machine-container">
          <img
            src={healingMachineImage}
            alt="Machine"
            className={`healing-machine ${healingState === 'healing' ? 'active' : ''}`}
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="pokeballs-overlay">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className={`pokeball-light ${healingState === 'healing' ? `animate-${i}` : ''}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="nurse-counter">
          <img
            src={nurseTile}
            alt="Nurse"
            className="nurse-npc"
            style={{ imageRendering: 'pixelated', width: '128px', height: '128px' }}
          />
          <div className="dialog-box">
            <p
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.8rem',
                lineHeight: '1.5',
              }}
            >
              {message}
            </p>
            {healingState === 'idle' && (
              <button
                className="btn-kenney primary heal-btn"
                onClick={handleHeal}
                style={{
                  fontSize: '0.8rem',
                  padding: '1rem 2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart fill="white" size={16} style={{ marginRight: '0.5rem' }} /> Team Genezen
              </button>
            )}
            {healingState === 'done' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-kenney primary heal-btn"
                  onClick={() => navigate('/adventure')}
                  style={{ fontSize: '0.8rem', padding: '1rem' }}
                >
                  Bedankt!
                </button>
                <button
                  className="btn-kenney success heal-btn"
                  onClick={() => navigate('/trainer-selection')}
                  style={{ fontSize: '0.8rem', padding: '1rem' }}
                >
                  Zoek Trainers
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

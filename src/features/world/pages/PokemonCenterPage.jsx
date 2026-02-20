import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCare } from '../../../contexts/DomainContexts';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile, nurseTile } from '../worldAssets';
import healingMachineImage from '../../../assets/buildings/healing_machine.png';
import './PokemonCenterPage.css';

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
      <WorldPageHeader title="Pokémon Center" icon="🏥" backPath="/world" />

      <div className="center-content">
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
              <button
                className="btn-kenney primary heal-btn"
                onClick={() => navigate('/world')}
                style={{ fontSize: '0.8rem', padding: '1rem 2rem' }}
              >
                Bedankt! (Verlaten)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

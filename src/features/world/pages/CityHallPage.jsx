import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { usePlayer } from '../../../hooks/usePlayer';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile, mayorTile } from '../worldAssets';
import bagIcon from '../../../assets/items/bag_icon.png';
import './CityHallPage.css';

export function CityHallPage() {
  const navigate = useNavigate();
  const { ownedIds, coins, dailyReward } = usePokemonContext();
  const { playerName } = usePlayer();
  const { canClaim, handleClaimDailyReward } = dailyReward;

  const onClaim = () => {
    handleClaimDailyReward();
  };

  // Stats
  const battlesWon = localStorage.getItem('battles_won') || 0;

  return (
    <div
      className="city-hall-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <WorldPageHeader title="Gemeentehuis" icon="🏛️" />

      <main className="hall-content">
        <div
          className="mayor-desk game-panel-dark"
          style={{
            border: '4px solid #4b5563',
            backgroundColor: '#1f2937',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <img
            src={mayorTile}
            alt="Mayor"
            className="mayor-npc"
            style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }}
          />
          <div className="mayor-dialogue-box" style={{ color: '#fff' }}>
            <p
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.8rem',
                marginBottom: '0.5rem',
                color: '#fbbf24',
              }}
            >
              <strong>Burgemeester:</strong> Welkom, <strong>{playerName}</strong>!
            </p>
            <p style={{ fontSize: '0.9rem' }}>De stad bloeit dankzij trainers zoals jij.</p>
            {canClaim ? (
              <button
                className="claim-btn btn-kenney success"
                onClick={onClaim}
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🎁 Dagelijkse Subsidie Claimen (100)
              </button>
            ) : (
              <p
                className="come-back-msg"
                style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#9ca3af' }}
              >
                Kom morgen terug voor je subsidie.
              </p>
            )}
          </div>
        </div>

        <div className="hall-services">
          <div
            className="service-card records game-panel-dark"
            style={{
              border: '4px solid #4b5563',
              backgroundColor: '#1f2937',
              padding: '1rem',
              color: '#fff',
            }}
          >
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                marginBottom: '1rem',
                color: '#60a5fa',
              }}
            >
              📊 Jouw Gegevens
            </h2>
            <div className="stats-grid">
              <div className="stat" style={{ marginBottom: '0.5rem' }}>
                <span className="stat-label">Pokémon: </span>
                <span
                  className="stat-value"
                  style={{ fontFamily: '"Press Start 2P", cursive', color: '#fbbf24' }}
                >
                  {ownedIds.length}
                </span>
              </div>
              <div className="stat" style={{ marginBottom: '0.5rem' }}>
                <span className="stat-label">Gevechten Gewonnen: </span>
                <span
                  className="stat-value"
                  style={{ fontFamily: '"Press Start 2P", cursive', color: '#fbbf24' }}
                >
                  {battlesWon}
                </span>
              </div>
              <div
                className="stat"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span className="stat-label">Huidig Geld: </span>
                <span
                  className="stat-value"
                  style={{
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <img
                    src={bagIcon}
                    alt="coins"
                    style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
                  />{' '}
                  {coins}
                </span>
              </div>
            </div>
          </div>

          <div
            className="service-card registry game-panel-dark"
            style={{
              border: '4px solid #4b5563',
              backgroundColor: '#1f2937',
              padding: '1rem',
              color: '#fff',
              marginTop: '1rem',
            }}
          >
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                marginBottom: '1rem',
                color: '#f472b6',
              }}
            >
              📝 Bevolkingsregister
            </h2>
            <p style={{ marginBottom: '1rem' }}>Officiële trainersidentificatie.</p>
            <button
              className="registry-btn btn-kenney primary"
              onClick={() => navigate('/profile')}
            >
              Paspoort Bekijken
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

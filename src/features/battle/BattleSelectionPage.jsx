import { Link } from 'react-router-dom';
import pokeballImage from '../../assets/items/pokeball.png';
import bagIcon from '../../assets/items/bag_icon.png';
import './BattleSelectionPage.css';

export function BattleSelectionPage() {
  return (
    <div
      className="battle-selection-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: 'url(../../assets/kenney_tiny-town/Tiles/tile_0000.png)',
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <div className="battle-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: '"Press Start 2P", cursive',
            textShadow: '2px 2px 0 #000',
            color: 'white',
          }}
        >
          Gevechtsmodi
        </h1>
        <p
          style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fbbf24' }}
        >
          Kies je uitdaging
        </p>
      </div>

      <div
        className="battle-modes-container"
        style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <Link
          to="/tournament"
          className="battle-mode-card tournament game-panel"
          style={{
            textDecoration: 'none',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div className="mode-icon" style={{ textAlign: 'center' }}>
            <img
              src={pokeballImage}
              alt="tournament"
              className="mode-icon-img"
              style={{ width: '64px', imageRendering: 'pixelated' }}
            />
          </div>
          <div className="mode-content" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Toernooi
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              Neem het op tegen 8 trainers in een knock-out toernooi.
            </p>
            <div
              className="mode-rewards"
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span className="reward-label" style={{ fontWeight: 'bold' }}>
                Beloning:
              </span>
              <span
                className="reward-value"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}
              >
                <img
                  src={bagIcon}
                  alt="coins"
                  className="coin-icon"
                  style={{ width: '16px', imageRendering: 'pixelated' }}
                />
                200
              </span>
            </div>
          </div>
          <div
            className="mode-action btn-kenney primary"
            style={{ textAlign: 'center', marginTop: 'auto' }}
          >
            Toernooi Binnengaan
          </div>
        </Link>

        <Link
          to="/trainer-selection"
          className="battle-mode-card trainers game-panel"
          style={{
            textDecoration: 'none',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div className="mode-icon" style={{ textAlign: 'center' }}>
            <img
              src={pokeballImage}
              alt="trainers"
              className="mode-icon-img"
              style={{ width: '64px', imageRendering: 'pixelated' }}
            />
          </div>
          <div className="mode-content" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Trainers
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              Daag je vrienden en rivalen uit in 1v1 gevechten.
            </p>
            <div
              className="mode-rewards"
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span className="reward-label" style={{ fontWeight: 'bold' }}>
                Beloning:
              </span>
              <span
                className="reward-value"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}
              >
                <img
                  src={bagIcon}
                  alt="coins"
                  className="coin-icon"
                  style={{ width: '16px', imageRendering: 'pixelated' }}
                />
                150+
              </span>
            </div>
          </div>
          <div
            className="mode-action btn-kenney success"
            style={{ textAlign: 'center', marginTop: 'auto' }}
          >
            Bekijk Trainers
          </div>
        </Link>

        <Link
          to="/single-battle"
          className="battle-mode-card quick-battle game-panel"
          style={{
            textDecoration: 'none',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div className="mode-icon" style={{ textAlign: 'center' }}>
            <img
              src={pokeballImage}
              alt="battle"
              className="mode-icon-img"
              style={{ width: '64px', imageRendering: 'pixelated' }}
            />
          </div>
          <div className="mode-content" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Snel Gevecht
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              Een snel gevecht tegen een willekeurige tegenstander.
            </p>
            <div
              className="mode-rewards"
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span className="reward-label" style={{ fontWeight: 'bold' }}>
                Beloning:
              </span>
              <span
                className="reward-value"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}
              >
                <img
                  src={bagIcon}
                  alt="coins"
                  className="coin-icon"
                  style={{ width: '16px', imageRendering: 'pixelated' }}
                />
                50
              </span>
            </div>
          </div>
          <div
            className="mode-action btn-kenney warning"
            style={{ textAlign: 'center', marginTop: 'auto' }}
          >
            Nu Vechten
          </div>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link
          to="/safari"
          className="btn-kenney neutral"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          ⬅️ Terug naar Wereld
        </Link>
      </div>
    </div>
  );
}

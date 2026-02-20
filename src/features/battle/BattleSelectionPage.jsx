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
        backgroundImage: 'url(/src/assets/kenney_tiny-town/Tiles/tile_0000.png)',
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
          Modos de Batalla
        </h1>
        <p
          style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fbbf24' }}
        >
          Elige tu desafío
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
              Torneo
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              Enfréntate a 8 entrenadores en un torneo de eliminación directa.
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
                Recompensa:
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
            Entrar al Torneo
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
              Entrenadores
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              Desafía a tus amigos y rivales en combates 1v1.
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
                Recompensa:
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
            Ver Entrenadores
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
              Batalla Rápida
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              Un combate rápido contra un oponente aleatorio.
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
                Recompensa:
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
            Luchar Ahora
          </div>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link
          to="/adventure"
          className="btn-kenney neutral"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          ⬅️ Volver al Mapa
        </Link>
      </div>
    </div>
  );
}

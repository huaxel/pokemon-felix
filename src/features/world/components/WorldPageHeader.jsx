import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import bagIcon from '../../../assets/items/bag_icon.png';
import './WorldPageHeader.css';

export function WorldPageHeader({ title, backPath = '/world', icon, onBack }) {
  const { coins } = usePokemonContext();

  return (
    <header className="world-page-header">
      <div className="header-left">
        {onBack ? (
          <button className="btn-kenney neutral header-back-btn" onClick={onBack}>
            ← Terug
          </button>
        ) : (
          <Link
            to={backPath}
            className="btn-kenney neutral header-back-btn"
            style={{ textDecoration: 'none' }}
          >
            ← Terug
          </Link>
        )}
      </div>

      <h1
        className="header-title"
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '1.2rem',
          textShadow: '2px 2px 0 #000',
        }}
      >
        {icon && (
          <span className="header-icon" style={{ marginRight: '0.5rem' }}>
            {icon}
          </span>
        )}
        {title}
      </h1>

      <div
        className="header-wallet game-panel"
        style={{
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          minWidth: '120px',
          justifyContent: 'center',
        }}
      >
        <img
          src={bagIcon}
          alt="coins"
          className="coin-icon"
          style={{ width: '20px', height: '20px', imageRendering: 'pixelated' }}
        />
        <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>{coins}</span>
      </div>
    </header>
  );
}

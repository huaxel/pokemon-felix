import { Link } from 'react-router-dom';
import bagIcon from '../../../assets/items/bag_icon.png';

export function GachaHeader({ coins }) {
  return (
    <div className="gacha-header">
      <Link
        to="/adventure"
        className="btn-kenney neutral back-hub-btn"
        style={{ textDecoration: 'none', display: 'inline-flex' }}
      >
        🌍 Wereld
      </Link>
      <h1
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '1.5rem',
          textShadow: '2px 2px 0 #000',
        }}
      >
        Poke-Gacha
      </h1>
      <div
        className="coin-balance game-panel"
        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <img
          src={bagIcon}
          alt="coins"
          className="coin-icon"
          style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }}
        />
        <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>{coins}</span>
      </div>
    </div>
  );
}

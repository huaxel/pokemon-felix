import { Link, useLocation } from 'react-router-dom';
import { Map, Library, Upload, Download } from 'lucide-react';
import { useEconomy } from '../contexts/DomainContexts';
import { usePlayer } from '../hooks/usePlayer';
import bagIcon from '../assets/items/bag_icon.png';
import './Navbar.css';

const AVATARS = [
  { id: 'boy_blue', emoji: '👦', color: '#3b82f6' },
  { id: 'girl_pink', emoji: '👧', color: '#ec4899' },
  { id: 'boy_green', emoji: '👦', color: '#22c55e' },
  { id: 'girl_yellow', emoji: '👧', color: '#eab308' },
  { id: 'ninja', emoji: '🥷', color: '#1e293b' },
  { id: 'scientist', emoji: '👨‍🔬', color: '#6366f1' },
  { id: 'explorer', emoji: '🤠', color: '#8b4513' },
  { id: 'superhero', emoji: '🦸‍♂️', color: '#ef4444' },
];

export function Navbar({ onExport, onImport }) {
  const location = useLocation();
  const { coins } = useEconomy();
  const { playerName, avatarId } = usePlayer();
  const playerAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  return (
    <nav className="navbar">
      <div className="nav-pill-container">
        <Link to="/profile" className="nav-brand-pill profile-link">
          <div className="nav-avatar-circle" style={{ backgroundColor: playerAvatar.color }}>
            {playerAvatar.emoji}
          </div>
          <div className="brand-text">
            <span className="brand-title">Pokédex</span>
            <span className="brand-subtitle">de {playerName}</span>
          </div>
        </Link>

        <div className="nav-navigation-pill">
          <Link
            to="/adventure"
            className={`nav-item ${location.pathname === '/adventure' ? 'active' : ''}`}
          >
            <Map size={18} className="nav-icon globe" />
            <span>Mundo</span>
          </Link>
          <Link
            to="/pokedex"
            className={`nav-item ${location.pathname === '/pokedex' ? 'active' : ''}`}
          >
            <Library size={18} className="nav-icon book" />
            <span>Pokedex</span>
          </Link>
        </div>
      </div>

      <div className="nav-right-side">
        <div className="nav-coins">
          <img src={bagIcon} alt="coins" className="coin-icon" />
          <span>{coins}</span>
        </div>

        <div className="navbar-actions">
          <button className="nav-btn" onClick={onImport} title="Importar favoritos">
            <Upload size={16} />
          </button>
          <button className="nav-btn" onClick={onExport} title="Exportar favoritos">
            <Download size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

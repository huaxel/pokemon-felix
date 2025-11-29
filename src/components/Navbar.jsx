import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Swords, Trophy, Gift } from 'lucide-react';
import { usePokemonContext } from '../contexts/PokemonContext';
import pokeballLogo from '../assets/pokeball_transparent.png';
import './Navbar.css';

export function Navbar({ onExport, onImport }) {
    const location = useLocation();
    const { coins } = usePokemonContext();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <img src={pokeballLogo} alt="Pokeball" className="nav-logo" />
                <h1>Pokédex de Félix</h1>
            </div>

            <div className="nav-controls">
                <div className="view-toggle">
                    <Link
                        to="/"
                        className={`toggle-btn ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        <Home size={20} />
                        <span>Inicio</span>
                    </Link>
                    <Link
                        to="/collection"
                        className={`toggle-btn ${location.pathname === '/collection' ? 'active' : ''}`}
                    >
                        <Library size={20} />
                        <span>Mi Colección</span>
                    </Link>
                    <Link
                        to="/squad"
                        className={`toggle-btn ${location.pathname === '/squad' ? 'active' : ''}`}
                    >
                        <Swords size={20} />
                        <span>Equipo</span>
                    </Link>
                    <Link
                        to="/battle"
                        className={`toggle-btn ${location.pathname === '/battle' ? 'active' : ''}`}
                    >
                        <Swords size={20} />
                        <span>Arena de Batalla</span>
                    </Link>
                    <Link
                        to="/tournament"
                        className={`toggle-btn ${location.pathname === '/tournament' ? 'active' : ''}`}
                    >
                        <Trophy size={20} />
                        <span>Torneo</span>
                    </Link>
                    <Link
                        to="/gacha"
                        className={`toggle-btn ${location.pathname === '/gacha' ? 'active' : ''}`}
                    >
                        <Gift size={20} />
                        <span>Gacha</span>
                    </Link>
                </div>

                <div className="nav-coins">
                    <span>🪙</span>
                    <span>{coins}</span>
                </div>

                <div className="navbar-actions">
                    <button className="nav-btn" onClick={onImport} title="Importar favoritos">
                        📥
                    </button>
                    <button className="nav-btn" onClick={onExport} title="Exportar favoritos">
                        📤
                    </button>
                </div>
            </div>
        </nav>
    );
}

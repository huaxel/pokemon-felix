import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export function Navbar({ onExport, onImport }) {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <img src="/pokeball.png" alt="Pokeball" className="nav-logo" />
                <h1>Pokédex de Félix</h1>
            </div>

            <div className="nav-controls">
                <div className="view-toggle">
                    <Link
                        to="/"
                        className={`toggle-btn ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/collection"
                        className={`toggle-btn ${location.pathname === '/collection' ? 'active' : ''}`}
                    >
                        Mi Colección
                    </Link>
                    <Link
                        to="/battle"
                        className={`toggle-btn ${location.pathname === '/battle' ? 'active' : ''}`}
                    >
                        Arena de Batalla
                    </Link>
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

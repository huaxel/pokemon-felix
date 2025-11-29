import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Swords, Trophy } from 'lucide-react';
import './Navbar.css';

export function Navbar() {
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
                </div>
            </div>
        </nav>
    );
}

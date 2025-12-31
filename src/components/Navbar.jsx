import { useLocation, Link } from 'react-router-dom';
import { Map, Library } from 'lucide-react';
import { usePokemonContext } from '../hooks/usePokemonContext';
import pokeballLogo from '../assets/items/pokeball.png';
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
                        to="/adventure"
                        className={`toggle - btn ${location.pathname === '/adventure' ? 'active' : ''} `}
                    >
                        <Map size={20} />
                        <span>Mundo</span>
                    </Link>
                    <Link
                        to="/pokedex"
                        className={`toggle - btn ${location.pathname === '/pokedex' ? 'active' : ''} `}
                    >
                        <Library size={20} />
                        <span>Pokedex</span>
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

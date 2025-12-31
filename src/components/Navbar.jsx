import { useLocation, Link } from 'react-router-dom';
import { Map, Library, Upload, Download } from 'lucide-react';
import { usePokemonContext } from '../hooks/usePokemonContext';
import pokeballLogo from '../assets/items/pokeball.png';
import bagIcon from '../assets/items/bag_icon.png';
import './Navbar.css';

export function Navbar({ onExport, onImport }) {
    const location = useLocation();
    const { coins } = usePokemonContext();

    return (
        <nav className="navbar">
            <div className="nav-pill-container">
                <div className="nav-brand-pill">
                    <img src={pokeballLogo} alt="Pokeball" className="nav-logo" />
                    <div className="brand-text">
                        <span className="brand-title">Pokédex</span>
                        <span className="brand-subtitle">de Félix</span>
                    </div>
                </div>

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

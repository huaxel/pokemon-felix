import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export function Navbar({ collectionCount, onExport, onImport }) {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    Pokémon Félix
                </Link>
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/collection"
                        className={`nav-link ${location.pathname === '/collection' ? 'active' : ''}`}
                    >
                        Mi Colección
                        {collectionCount > 0 && (
                            <span className="collection-badge">{collectionCount}</span>
                        )}
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

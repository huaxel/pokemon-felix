import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export function Navbar({ collectionCount }) {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    Pokemon Felix
                </Link>
                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/collection"
                        className={`nav-link ${location.pathname === '/collection' ? 'active' : ''}`}
                    >
                        My Collection
                        {collectionCount > 0 && (
                            <span className="collection-badge">{collectionCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

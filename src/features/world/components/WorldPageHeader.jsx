import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../../../hooks/usePokemonContext';
import { Coins, ChevronLeft } from 'lucide-react';
import './WorldPageHeader.css';

export function WorldPageHeader({ title, backPath = '/world', icon, onBack }) {
    const { coins } = usePokemonContext();

    return (
        <header className="world-page-header">
            {onBack ? (
                <button className="header-back-btn" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
            ) : (
                <Link to={backPath} className="header-back-btn">
                    <ChevronLeft size={24} />
                </Link>
            )}

            <h1 className="header-title">
                {icon && <span className="header-icon">{icon}</span>}
                {title}
            </h1>

            <div className="header-wallet">
                <Coins size={20} className="coin-icon" />
                <span>{coins}</span>
            </div>
        </header>
    );
}

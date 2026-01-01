import { Link } from 'react-router-dom';
import { Sparkles, Coins } from 'lucide-react';
import bagIcon from '../../../assets/items/bag_icon.png';

export function FountainHeader({ coins }) {
    return (
        <header className="fountain-header">
            <Link to="/world" className="back-button">
                <img src={bagIcon} alt="Back" />
            </Link>
            <h1>
                <Sparkles size={32} />
                Plaza de la Fuente
            </h1>
            <div className="coins-display">
                <Coins size={20} />
                <span>{coins}</span>
            </div>
        </header>
    );
}

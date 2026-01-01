import { Link } from 'react-router-dom';
import bagIcon from '../../../assets/items/bag_icon.png';

export function GachaHeader({ coins }) {
    return (
        <div className="gacha-header">
            <Link to="/adventure" className="back-hub-btn">Terug naar Wereld</Link>
            <h1>Poke-Gacha</h1>
            <div className="coin-balance">
                <img src={bagIcon} alt="coins" className="coin-icon" />
                <span>{coins}</span>
            </div>
        </div>
    );
}

import { Crown, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import bagIcon from '../../../assets/items/bag_icon.png';

export function PalaceLockedView({ ownedCount }) {
    return (
        <div className="palace-page locked">
            <header className="palace-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Back" />
                </Link>
                <h1>
                    <Crown size={32} />
                    Palacio del Campeón
                </h1>
            </header>

            <div className="locked-content">
                <Crown size={120} className="locked-icon" />
                <h2>Palacio Cerrado</h2>
                <p>Solo los campeones pueden entrar a este lugar sagrado.</p>
                <div className="requirement">
                    <Trophy size={24} />
                    <span>Captura al menos 50 Pokémon</span>
                </div>
                <div className="progress">
                    <span>{ownedCount} / 50</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(ownedCount / 50) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

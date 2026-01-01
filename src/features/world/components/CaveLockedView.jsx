import { Link } from 'react-router-dom';
import bagIcon from '../../../assets/items/bag_icon.png';

export function CaveLockedView() {
    return (
        <div className="cave-page locked">
            <header className="cave-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Back" />
                </Link>
                <h1>Cave Entrance</h1>
            </header>
            <div className="locked-content">
                <div className="cave-icon">🕳️</div>
                <h2>The cave entrance is blocked by thick vines...</h2>
                <p>Maybe you need a special item or to explore more of the world first?</p>
                <Link to="/world" className="return-btn">Return to World</Link>
            </div>
        </div>
    );
}

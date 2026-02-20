import { Link } from 'react-router-dom';
import bagIcon from '../../../assets/items/bag_icon.png';

export function PorygonHeader({ coins }) {
  return (
    <header className="lab-header">
      <Link to="/school" className="back-btn">
        Terug naar School
      </Link>
      <h1>🖥️ Laboratorio Porygon</h1>
      <div className="coin-display">
        <img src={bagIcon} alt="coins" />
        {coins}
      </div>
    </header>
  );
}

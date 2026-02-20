import { Link } from 'react-router-dom';

export function TournamentChampionView({ champion, onReset }) {
  if (!champion) return null;

  return (
    <div className="tournament-layout champion-view">
      <h1>¡Tenemos un Campeón!</h1>
      <div className="champion-card">
        <img src={champion.sprites.other['official-artwork'].front_default} alt={champion.name} />
        <h3>{champion.name}</h3>
        <div className="winner-badge">🏆</div>
        <p className="reward-text">💰 +200</p>
      </div>
      <div className="champion-actions">
        <Link to="/gacha" className="spend-btn">
          Gastar Ganancias
        </Link>
        <button className="reset-btn" onClick={onReset}>
          Nuevo Torneo
        </button>
      </div>
    </div>
  );
}

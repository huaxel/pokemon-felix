import './BattleRewardModal.css';

export function BattleRewardModal({ pokemon, onChoice }) {
  if (!pokemon) return null;

  return (
    <div className="reward-modal-overlay">
      <div className="reward-modal-content">
        <h2>¡Victoria! Elige tu recompensa</h2>
        <div className="reward-pokemon-preview">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>{pokemon.name}</p>
        </div>

        <div className="reward-options">
          <button className="reward-btn pokemon" onClick={() => onChoice('pokemon')}>
            <span className="icon">⚾</span>
            <div className="btn-text">
              <strong>Capturar Pokémon</strong>
              <span>Añádelo a tu colección</span>
            </div>
          </button>

          <button className="reward-btn money" onClick={() => onChoice('money')}>
            <span className="icon">💰</span>
            <div className="btn-text">
              <strong>Recibir Monedas</strong>
              <span>Gana 500 monedas</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

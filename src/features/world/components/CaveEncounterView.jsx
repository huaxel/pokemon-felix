export function CaveEncounterView({ pokemon, catching, catchMessage, onCatch, onFlee, onFight }) {
  if (!pokemon) return null;

  return (
    <div className="encounter-view">
      <div className={`pokemon-spotlight ${pokemon.isLegendary ? 'legendary' : ''}`}>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="encounter-pokemon" />
        <h3>{pokemon.name} appeared!</h3>
      </div>

      {catchMessage && <div className="catch-message">{catchMessage}</div>}

      <div className="encounter-actions">
        <button className="catch-btn" onClick={onCatch} disabled={catching}>
          {catching ? 'Throwing Ball...' : 'Throw PokeBall'}
        </button>
        <button className="flee-btn" onClick={onFlee} disabled={catching}>
          Flee
        </button>
        <button className="fight-btn" onClick={onFight} disabled={catching}>
          Fight
        </button>
      </div>
    </div>
  );
}

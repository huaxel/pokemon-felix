export function BattleControls({ moves, energy, turn, isBattling, onAttack, getTypeColor }) {
  const TYPE_TRANSLATIONS = {
    normal: 'Normaal',
    fire: 'Vuur',
    water: 'Water',
    electric: 'Elektrisch',
    grass: 'Gras',
    ice: 'IJs',
    fighting: 'Vecht',
    poison: 'Gif',
    ground: 'Grond',
    flying: 'Vlieg',
    psychic: 'Psychisch',
    bug: 'Insect',
    rock: 'Steen',
    ghost: 'Geest',
    dragon: 'Draak',
    steel: 'Staal',
    fairy: 'Fee',
  };

  return (
    <div className="battle-controls">
      {moves.map((move, i) => (
        <button
          key={i}
          className="move-btn btn-kenney neutral"
          style={{ '--type-color': getTypeColor(move.type) }}
          disabled={!isBattling || turn !== 'player' || move.cost > energy}
          onClick={() => onAttack(move)}
        >
          <div className="move-name">{move.name}</div>
          <div className="move-meta">
            <span className="move-type" style={{ backgroundColor: getTypeColor(move.type) }}>
              {TYPE_TRANSLATIONS[move.type.toLowerCase()] || move.type}
            </span>
            <span className="move-stat">⚔️ {move.power || 0}</span>
            <span className="move-stat">🎯 {move.accuracy || 100}%</span>
            <span className="move-cost">⚡ {move.cost}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

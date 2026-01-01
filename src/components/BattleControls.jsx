export function BattleControls({ moves, energy, turn, isBattling, onAttack, getTypeColor }) {
    return (
        <div className="battle-controls">
            {moves.map((move, i) => (
                <button
                    key={i}
                    className="move-btn"
                    style={{ '--type-color': getTypeColor(move.type) }}
                    disabled={!isBattling || turn !== 'player' || move.cost > energy}
                    onClick={() => onAttack(move)}
                >
                    <div className="move-name">{move.name}</div>
                    <div className="move-info">
                        <span className="move-cost">⚡ {move.cost}</span>
                        <span className="move-power">💥 {move.power}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}

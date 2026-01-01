export function PorygonBoard({ level, porygonState, message }) {
    if (!level) return null;

    const getRotation = (dir) => dir * 90;

    return (
        <div className="game-board">
            {level.grid.map((row, y) => (
                <div key={y} className="board-row">
                    {row.map((cell, x) => (
                        <div key={`${x}-${y}`} className={`board-cell type-${cell}`}>
                            {porygonState && porygonState.x === x && porygonState.y === y && (
                                <div
                                    className="porygon-sprite"
                                    style={{ transform: `rotate(${getRotation(porygonState.dir)}deg)` }}
                                >
                                    🦆
                                </div>
                            )}
                            {cell === 9 && <div className="target-flag">🏁</div>}
                        </div>
                    ))}
                </div>
            ))}
            {message && (
                <div className={`level-message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

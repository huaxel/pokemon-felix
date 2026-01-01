export function WorldTile({
    cell,
    x,
    y,
    playerPos,
    treasures,
    seasonStyle,
    getTileContent,
    handleTileClick
}) {
    const isPlayer = x === playerPos.x && y === playerPos.y;
    const hasTreasure = treasures.some(t => t.x === x && t.y === y);

    return (
        <div
            className={`grid-cell ${isPlayer ? 'active' : ''}`}
            style={seasonStyle}
            onClick={() => handleTileClick(x, y)}
        >
            {getTileContent(cell, x, y)}
            {hasTreasure && <div className="treasure-marker">💎</div>}
        </div>
    );
}

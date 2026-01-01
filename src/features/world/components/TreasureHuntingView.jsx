export function TreasureHuntingView({
    onBack,
    currentHunt,
    attempts,
    distance,
    message,
    playerGuess,
    setPlayerGuess,
    onGuess
}) {
    return (
        <div className="treasure-hunt-page hunting">
            <div className="hunt-header">
                <button className="exit-btn" onClick={onBack}>
                    ← Exit
                </button>
                <h2>Treasure Hunt #{currentHunt.id}</h2>
                <div className="difficulty-badge" data-difficulty={currentHunt.difficulty}>
                    {currentHunt.difficulty}
                </div>
            </div>

            <div className="hunt-content">
                <div className="clue-card">
                    <h3>🗺️ Clue:</h3>
                    <p className="clue-text">{currentHunt.clue}</p>
                </div>

                <div className="progress-stats">
                    <div className="stat">
                        <span className="stat-label">Attempts:</span>
                        <span className="stat-value">{attempts} / 10</span>
                    </div>
                    {distance !== null && (
                        <div className="stat">
                            <span className="stat-label">Distance:</span>
                            <span className="stat-value">{distance.toFixed(2)} units</span>
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`hunt-message ${message.includes('close') ? 'hot' :
                            message.includes('warmer') ? 'warm' : 'cold'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="coordinate-input">
                    <h3>📍 Enter Coordinates:</h3>
                    <div className="input-row">
                        <div className="input-group">
                            <label>X:</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={playerGuess.x}
                                onChange={(e) => setPlayerGuess(prev => ({ ...prev, x: e.target.value }))}
                                placeholder="0-9"
                            />
                        </div>
                        <div className="input-group">
                            <label>Y:</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={playerGuess.y}
                                onChange={(e) => setPlayerGuess(prev => ({ ...prev, y: e.target.value }))}
                                placeholder="0-9"
                            />
                        </div>
                    </div>
                    <button className="guess-btn" onClick={onGuess}>
                        🔍 Check Location
                    </button>
                </div>

                <div className="hunt-guide">
                    <h4>📚 Coordinate Guide:</h4>
                    <ul>
                        <li><strong>X = 0</strong>: Far West (left side)</li>
                        <li><strong>X = 9</strong>: Far East (right side)</li>
                        <li><strong>Y = 0</strong>: Far North (top)</li>
                        <li><strong>Y = 9</strong>: Far South (bottom)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

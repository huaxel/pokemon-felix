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
                <button className="exit-btn btn-kenney neutral" onClick={onBack}>
                    ← Verlaten
                </button>
                <h2>Schattenjacht #{currentHunt.id}</h2>
                <div className="difficulty-badge" data-difficulty={currentHunt.difficulty}>
                    {currentHunt.difficulty}
                </div>
            </div>

            <div className="hunt-content">
                <div className="clue-card">
                    <h3>🗺️ Aanwijzing:</h3>
                    <p className="clue-text">{currentHunt.clue}</p>
                </div>

                <div className="progress-stats">
                    <div className="stat">
                        <span className="stat-label">Pogingen:</span>
                        <span className="stat-value">{attempts} / 10</span>
                    </div>
                    {distance !== null && (
                        <div className="stat">
                            <span className="stat-label">Afstand:</span>
                            <span className="stat-value">{distance.toFixed(2)} eenheden</span>
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`hunt-message ${message.includes('dichtbij') ? 'hot' :
                            message.includes('warmer') ? 'warm' : 'cold'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="coordinate-input">
                    <h3>📍 Voer Coördinaten in:</h3>
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
                    <button className="guess-btn btn-kenney primary" onClick={onGuess}>
                        🔍 Controleer Locatie
                    </button>
                </div>

                <div className="hunt-guide">
                    <h4>📚 Coördinaten Gids:</h4>
                    <ul>
                        <li><strong>X = 0</strong>: Ver West (linkerkant)</li>
                        <li><strong>X = 9</strong>: Ver Oost (rechterkant)</li>
                        <li><strong>Y = 0</strong>: Ver Noord (bovenkant)</li>
                        <li><strong>Y = 9</strong>: Ver Zuid (onderkant)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

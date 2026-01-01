
export function MountainHikeView({
    altitude,
    tiredness,
    currentStage,
    foundPokemon,
    message,
    onExit,
    onClimb,
    onRest,
    onCatch,
    onPass
}) {
    const progressPercent = Math.min(100, (altitude / 2000) * 100);

    return (
        <div className="mountain-page hiking">
            <div className="hiking-header">
                <h2>⛰️ Mountain Climb</h2>
                <button className="exit-btn" onClick={onExit}>Exit</button>
            </div>

            <div className="climb-stats">
                <div className="stat">
                    <span>📍 Altitude</span>
                    <div className="altitude-display">{altitude}m</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                <div className="stat">
                    <span>😫 Tiredness</span>
                    <div className="tiredness-display">{tiredness}/100</div>
                    <div className="energy-bar">
                        <div
                            className="energy-fill"
                            style={{
                                width: `${tiredness}%`,
                                backgroundColor: tiredness > 70 ? '#ef4444' : tiredness > 40 ? '#f59e0b' : '#22c55e'
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {currentStage && (
                <div className="current-zone">
                    <h3>{currentStage.name}</h3>
                    <p>{currentStage.description}</p>
                </div>
            )}

            {foundPokemon ? (
                <div className="pokemon-encounter">
                    <h3>Encountered!</h3>
                    <img src={foundPokemon.sprites?.front_default} alt={foundPokemon.name} />
                    <h4>{foundPokemon.name}</h4>
                    <div className="encounter-buttons">
                        <button className="catch-btn" onClick={onCatch}>
                            🎯 Catch
                        </button>
                        <button className="pass-btn" onClick={onPass}>
                            👋 Pass
                        </button>
                    </div>
                </div>
            ) : (
                <div className="climb-actions">
                    <button
                        className="climb-btn"
                        onClick={onClimb}
                        disabled={tiredness >= 100}
                    >
                        ⬆️ Climb Higher
                    </button>
                    {tiredness > 20 && (
                        <button className="rest-btn" onClick={onRest}>
                            😴 Rest
                        </button>
                    )}
                </div>
            )}

            {message && <div className="message-box">{message}</div>}
        </div>
    );
}

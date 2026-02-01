
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
                <h2>⛰️ Berg Beklimmen</h2>
                <button className="exit-btn btn-kenney neutral" onClick={onExit}>Verlaten</button>
            </div>

            <div className="climb-stats">
                <div className="stat">
                    <span>📍 Hoogte</span>
                    <div className="altitude-display">{altitude}m</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                <div className="stat">
                    <span>😫 Vermoeidheid</span>
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
                    <h3>Ontmoeting!</h3>
                    <img src={foundPokemon.sprites?.front_default} alt={foundPokemon.name} style={{ imageRendering: 'pixelated' }} />
                    <h4>{foundPokemon.name}</h4>
                    <div className="encounter-buttons">
                        <button className="catch-btn btn-kenney primary" onClick={onCatch}>
                            🎯 Vangen
                        </button>
                        <button className="pass-btn btn-kenney neutral" onClick={onPass}>
                            👋 Overslaan
                        </button>
                    </div>
                </div>
            ) : (
                <div className="climb-actions">
                    <button
                        className="climb-btn btn-kenney primary"
                        onClick={onClimb}
                        disabled={tiredness >= 100}
                    >
                        ⬆️ Hoger Klimmen
                    </button>
                    {tiredness > 20 && (
                        <button className="rest-btn btn-kenney warning" onClick={onRest}>
                            😴 Rusten
                        </button>
                    )}
                </div>
            )}

            {message && <div className="message-box">{message}</div>}
        </div>
    );
}

export function TreasureFailedView({
    currentHunt,
    onRestart,
    onBack
}) {
    return (
        <div className="treasure-hunt-page failed">
            <div className="failed-content">
                <h1>😔 Hunt Failed</h1>
                <div className="failed-visual">🗺️</div>
                <div className="failed-info">
                    <p>Out of attempts! The treasure was hidden at:</p>
                    <h2>({currentHunt.target.x}, {currentHunt.target.y})</h2>
                    <p>Better luck next time, explorer!</p>
                </div>
                <div className="failed-actions">
                    <button className="restart-btn" onClick={onRestart}>
                        Try Again
                    </button>
                    <button className="exit-btn" onClick={onBack}>
                        Leave Cave
                    </button>
                </div>
            </div>
        </div>
    );
}

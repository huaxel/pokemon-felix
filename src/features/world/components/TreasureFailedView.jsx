export function TreasureFailedView({
    currentHunt,
    onRestart,
    onBack
}) {
    return (
        <div className="treasure-hunt-page failed">
            <div className="failed-content">
                <h1>😔 Jacht Mislukt</h1>
                <div className="failed-visual">🗺️</div>
                <div className="failed-info">
                    <p>Geen pogingen meer! De schat was verborgen op:</p>
                    <h2>({currentHunt.target.x}, {currentHunt.target.y})</h2>
                    <p>Volgende keer beter, ontdekker!</p>
                </div>
                <div className="failed-actions">
                    <button className="restart-btn btn-kenney primary" onClick={onRestart}>
                        Opnieuw Proberen
                    </button>
                    <button className="exit-btn btn-kenney neutral" onClick={onBack}>
                        Verlaten
                    </button>
                </div>
            </div>
        </div>
    );
}

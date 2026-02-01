

export function TreasureTutorial({ huntsCompleted, totalHunts, onStart, onBack }) {
    return (
        <div className="treasure-hunt-page tutorial">
            <div className="tutorial-content">
                <h1>🗺️ GPS Schattenjacht</h1>

                <div className="tutorial-info">
                    <div className="coordinates-lesson">
                        <h2>📍 Coördinaten Begrijpen</h2>
                        <div className="grid-example">
                            <div className="axis-label y-axis">Y ↑</div>
                            <div className="mini-grid">
                                {[...Array(5)].map((_, y) => (
                                    <div key={y} className="mini-row">
                                        {[...Array(5)].map((_, x) => (
                                            <div key={x} className="mini-cell">
                                                {x === 2 && y === 2 ? '🎁' : ''}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="axis-label x-axis">X →</div>
                        </div>
                        <p className="example-text">
                            De schat 🎁 hierboven bevindt zich op coördinaten <strong>(X: 2, Y: 2)</strong>
                        </p>
                    </div>

                    <div className="rules">
                        <h3>📜 Hoe te spelen:</h3>
                        <ul>
                            <li>🧭 Lees de aanwijzing over waar de schat verborgen is</li>
                            <li>📐 Voer X en Y coördinaten in (0-9 voor elk)</li>
                            <li>🎯 Je hebt 10 pogingen om het te vinden</li>
                            <li>🔥 Afstandstips helpen je (Heet/Koud)</li>
                            <li>💰 Vind schatten om munten + Pokémon te verdienen!</li>
                        </ul>
                    </div>

                    <div className="rewards-preview">
                        <h3>🏆 Beloningen:</h3>
                        <p>Voltooi schattenjachten om te verdienen:</p>
                        <ul>
                            <li>💰 300-1500 munten per jacht</li>
                            <li>✨ Speciale Pokémon beloningen</li>
                            <li>🎓 Kaartleesvaardigheden</li>
                        </ul>
                    </div>

                    <div className="progress-info">
                        <p>Voltooide Jachten: <strong>{huntsCompleted} / {totalHunts}</strong></p>
                    </div>
                </div>

                <div className="tutorial-actions">
                    <button className="start-hunt-btn btn-kenney primary" onClick={onStart}>
                        🗺️ Start Schattenjacht
                    </button>
                    <button className="back-btn btn-kenney neutral" onClick={onBack}>
                        ← Terug naar de Wereld
                    </button>
                </div>
            </div>
        </div>
    );
}

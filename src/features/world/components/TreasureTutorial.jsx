import React from 'react';

export function TreasureTutorial({ huntsCompleted, totalHunts, onStart, onBack }) {
    return (
        <div className="treasure-hunt-page tutorial">
            <div className="tutorial-content">
                <h1>🗺️ GPS Treasure Hunt</h1>

                <div className="tutorial-info">
                    <div className="coordinates-lesson">
                        <h2>📍 Understanding Coordinates</h2>
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
                            The treasure 🎁 above is at coordinates <strong>(X: 2, Y: 2)</strong>
                        </p>
                    </div>

                    <div className="rules">
                        <h3>📜 How to Play:</h3>
                        <ul>
                            <li>🧭 Read the clue about where treasure is hidden</li>
                            <li>📐 Enter X and Y coordinates (0-9 for each)</li>
                            <li>🎯 You have 10 attempts to find it</li>
                            <li>🔥 Distance hints will guide you (Hot/Cold)</li>
                            <li>💰 Find treasure to earn coins + Pokemon!</li>
                        </ul>
                    </div>

                    <div className="rewards-preview">
                        <h3>🏆 Rewards:</h3>
                        <p>Complete treasure hunts to earn:</p>
                        <ul>
                            <li>💰 300-1500 coins per hunt</li>
                            <li>✨ Special Pokemon rewards</li>
                            <li>🎓 Map reading skills</li>
                        </ul>
                    </div>

                    <div className="progress-info">
                        <p>Hunts Completed: <strong>{huntsCompleted} / {totalHunts}</strong></p>
                    </div>
                </div>

                <div className="tutorial-actions">
                    <button className="start-hunt-btn" onClick={onStart}>
                        🗺️ Start Treasure Hunt
                    </button>
                    <button className="back-btn" onClick={onBack}>
                        ← Back to World
                    </button>
                </div>
            </div>
        </div>
    );
}

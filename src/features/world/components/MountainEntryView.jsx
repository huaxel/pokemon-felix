import React from 'react';

export function MountainEntryView({ hasBoots, zones, onStartHike }) {
    return (
        <div className="mountain-page">
            <div className="mountain-header">
                <h1>⛰️ Mystic Mountain</h1>
                <p>A legendary peak said to be home to rare Pokemon</p>
            </div>

            {!hasBoots ? (
                <div className="mountain-warning">
                    <h2>🚫 You Need Hiking Boots!</h2>
                    <p>You must find and collect hiking boots before you can climb the mountain.</p>
                    <p className="tip">💡 Hiking boots might be found in special locations or bought from the shop.</p>
                </div>
            ) : (
                <div className="mountain-intro">
                    <h2>Ready to Climb?</h2>
                    <p>
                        The mountain has 4 altitude zones. Each zone is harder but has rarer Pokemon!
                    </p>

                    <div className="altitude-zones">
                        {zones.map((zone, idx) => (
                            <div key={idx} className="zone-card">
                                <h3>{zone.name}</h3>
                                <p>{zone.description}</p>
                                <div className="zone-stats">
                                    <span>Danger: {zone.danger}</span>
                                    <span className="pokemon-preview">
                                        {zone.pokemon.slice(0, 2).map(p => `${p} `)}
                                        {zone.pokemon.length > 2 && `+ ${zone.pokemon.length - 2} more`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mountain-tips">
                        <h3>📚 Before You Go:</h3>
                        <ul>
                            <li>🥾 You have hiking boots equipped</li>
                            <li>⛅ The mountain is harder the higher you climb</li>
                            <li>😴 Rest when tired to continue climbing</li>
                            <li>💰 Reach the summit for 1000 coins!</li>
                            <li>🔔 Catch Pokemon at each altitude</li>
                        </ul>
                    </div>

                    <button className="start-hike-btn" onClick={onStartHike}>
                        🥾 Start Climbing
                    </button>
                </div>
            )}
        </div>
    );
}

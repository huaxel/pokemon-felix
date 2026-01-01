import React from 'react';

export function SeasonHUD({ seasonIndex, seasons, onNext, onPrev }) {
    const currentSeason = seasons[seasonIndex]; // This might be just an index or object depending on usage
    // Based on WorldPage usage: SEASONS = ['Lente', 'Zomer', 'Herfst', 'Winter']
    // SEASON_ICONS = ['🌸', '☀️', '🍂', '❄️']
    // In WorldPage code it was SEASONS and SEASON_ICONS arrays locally defined.
    // Let's assume we pass the arrays or just the current name/icon data.

    // Better: Allow WorldPage to pass the specific data
    const SEASON_ICONS = ['🌸', '☀️', '🍂', '❄️'];
    const SEASON_NAMES = ['Lente', 'Zomer', 'Herfst', 'Winter'];

    return (
        <div className="season-hud">
            <button className="arrow-btn" onClick={onPrev}>⬅️</button>
            <div className="season-display">
                <span className="season-icon">{SEASON_ICONS[seasonIndex]}</span>
                <span className="season-name">{SEASON_NAMES[seasonIndex]}</span>
            </div>
            <button className="arrow-btn" onClick={onNext}>➡️</button>
        </div>
    );
}

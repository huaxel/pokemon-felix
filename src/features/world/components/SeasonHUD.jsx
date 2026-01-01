

export function SeasonHUD({ seasonIndex, onNext, onPrev }) {
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

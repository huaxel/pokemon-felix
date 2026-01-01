export function BattleHeader({ fighter1, fighter2, f1HP, f1MaxHP, f2HP, f2MaxHP, f1Energy, f2Energy }) {
    if (!fighter1 || !fighter2) return null;

    const hpPercent = (hp, max) => (hp / max) * 100;

    return (
        <div className="battle-header-hud">
            <div className="fighter-hud player">
                <div className="fighter-name">{fighter1.name}</div>
                <div className="hp-bar-bg">
                    <div className="hp-bar-fill" style={{ width: `${hpPercent(f1HP, f1MaxHP)}%` }}></div>
                </div>
                <div className="hp-text">{f1HP} / {f1MaxHP}</div>
                <div className="energy-dots">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className={`energy-dot ${i < f1Energy ? 'filled' : ''}`}></div>
                    ))}
                </div>
            </div>

            <div className="vs-badge">VS</div>

            <div className="fighter-hud enemy">
                <div className="fighter-name">{fighter2.name}</div>
                <div className="hp-bar-bg">
                    <div className="hp-bar-fill" style={{ width: `${hpPercent(f2HP, f2MaxHP)}%` }}></div>
                </div>
                <div className="hp-text">{f2HP} / {f2MaxHP}</div>
                <div className="energy-dots">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className={`energy-dot ${i < f2Energy ? 'filled' : ''}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

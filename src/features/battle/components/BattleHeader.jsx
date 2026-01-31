export function BattleHeader({ fighter1, fighter2, f1HP, f1MaxHP, f2HP, f2MaxHP, f1Energy, f2Energy, f1Weakened, f2Weakened }) {
    if (!fighter1 || !fighter2) return null;

    const hpPercent = (hp, max) => Math.max(0, (hp / max) * 100);

    const getHPColor = (hp, max) => {
        const percent = hpPercent(hp, max);
        if (percent > 50) return 'var(--health-good)';
        if (percent > 20) return 'var(--health-warning)';
        return 'var(--health-critical)';
    };

    return (
        <div className="battle-header-hud">
            <div className={`fighter-hud player ${f1Weakened ? 'hud-weakened' : ''}`}>
                <div className="fighter-meta">
                    <span className="fighter-name">{fighter1.name}</span>
                    <span className="fighter-level">Lvl 12</span>
                </div>
                {f1Weakened && <div className="weakened-tag">😵 DEBILITADO</div>}
                <div className="hp-container">
                    <div className="hp-label">HP</div>
                    <div className="hp-bar-bg">
                        <div
                            className="hp-bar-fill"
                            style={{
                                width: `${hpPercent(f1HP, f1MaxHP)}%`,
                                backgroundColor: getHPColor(f1HP, f1MaxHP)
                            }}
                        ></div>
                    </div>
                </div>
                <div className="hp-text">{f1HP} / {f1MaxHP}</div>
                <div className="energy-meter">
                    <div className="energy-label">ENERGY</div>
                    <div className="energy-dots">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className={`energy-dot ${i < f1Energy ? 'filled' : ''}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="vs-badge-container">
                <div className="vs-badge">VS</div>
            </div>

            <div className={`fighter-hud enemy ${f2Weakened ? 'hud-weakened' : ''}`}>
                <div className="fighter-meta">
                    <span className="fighter-name">{fighter2.name}</span>
                    <span className="fighter-level">Lvl 12</span>
                </div>
                {f2Weakened && <div className="weakened-tag">😵 DEBILITADO</div>}
                <div className="hp-container">
                    <div className="hp-label">HP</div>
                    <div className="hp-bar-bg">
                        <div
                            className="hp-bar-fill"
                            style={{
                                width: `${hpPercent(f2HP, f2MaxHP)}%`,
                                backgroundColor: getHPColor(f2HP, f2MaxHP)
                            }}
                        ></div>
                    </div>
                </div>
                <div className="hp-text">{f2HP} / {f2MaxHP}</div>
                <div className="energy-meter">
                    <div className="energy-label">ENERGY</div>
                    <div className="energy-dots">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className={`energy-dot ${i < f2Energy ? 'filled' : ''}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

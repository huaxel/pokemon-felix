export function BattleHeader({
  fighter1,
  fighter2,
  f1HP,
  f1MaxHP,
  f2HP,
  f2MaxHP,
  f1Energy,
  f2Energy,
  f1Weakened,
  f2Weakened,
  f1Status,
  f2Status,
}) {
  if (!fighter1 || !fighter2) return null;

  const hpPercent = (hp, max) => Math.max(0, (hp / max) * 100);

  const getStatusIcon = s => {
    const map = { burn: '🔥', paralysis: '⚡', freeze: '❄️', poison: '☠️', sleep: '💤' };
    return map[s] || s;
  };

  return (
    <div className="battle-header-hud">
      <div className={`fighter-hud player ${f1Weakened ? 'hud-weakened' : ''}`}>
        <div className="fighter-meta">
          <span className="fighter-name">{fighter1.name}</span>
          <span className="fighter-level">Lvl 12</span>
        </div>
        <div className="status-row">
          {f1Weakened && <div className="weakened-tag">😵 DEBILITADO</div>}
          {f1Status && (
            <div className="status-tag">
              {getStatusIcon(f1Status)} {f1Status.toUpperCase()}
            </div>
          )}
        </div>
        <div className="hp-container">
          <div className="hp-label">HP</div>
          <div className="stat-bar-pixel" style={{ width: '100%', height: '16px' }}>
            <div
              className={`stat-bar-pixel-fill ${hpPercent(f1HP, f1MaxHP) <= 20 ? 'critical' : hpPercent(f1HP, f1MaxHP) <= 50 ? 'warning' : ''}`}
              style={{
                width: `${hpPercent(f1HP, f1MaxHP)}%`,
              }}
            ></div>
            <span className="stat-value">
              {f1HP}/{f1MaxHP}
            </span>
          </div>
        </div>
        <div className="energy-meter">
          <div className="energy-label">ENERGY</div>
          <div className="energy-dots">
            {Array(5)
              .fill(0)
              .map((_, i) => (
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
        <div className="status-row">
          {f2Weakened && <div className="weakened-tag">😵 DEBILITADO</div>}
          {f2Status && (
            <div className="status-tag">
              {getStatusIcon(f2Status)} {f2Status.toUpperCase()}
            </div>
          )}
        </div>
        <div className="hp-container">
          <div className="hp-label">HP</div>
          <div className="stat-bar-pixel" style={{ width: '100%', height: '16px' }}>
            <div
              className={`stat-bar-pixel-fill ${hpPercent(f2HP, f2MaxHP) <= 20 ? 'critical' : hpPercent(f2HP, f2MaxHP) <= 50 ? 'warning' : ''}`}
              style={{
                width: `${hpPercent(f2HP, f2MaxHP)}%`,
              }}
            ></div>
            <span className="stat-value">
              {f2HP}/{f2MaxHP}
            </span>
          </div>
        </div>
        <div className="energy-meter">
          <div className="energy-label">ENERGY</div>
          <div className="energy-dots">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={`energy-dot ${i < f2Energy ? 'filled' : ''}`}></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

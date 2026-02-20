export function SeasonHUD({ seasonIndex, onNext, onPrev }) {
  const SEASON_ICONS = ['🌸', '☀️', '🍂', '❄️'];
  const SEASON_NAMES = ['Lente', 'Zomer', 'Herfst', 'Winter'];

  return (
    <div className="season-hud">
      <button
        className="btn-kenney"
        style={{ padding: '0.4rem 0.8rem', minWidth: 'auto' }}
        onClick={onPrev}
      >
        ◀
      </button>
      <div className="season-display">
        <span className="season-icon">{SEASON_ICONS[seasonIndex]}</span>
        <span className="season-name">{SEASON_NAMES[seasonIndex]}</span>
      </div>
      <button
        className="btn-kenney"
        style={{ padding: '0.4rem 0.8rem', minWidth: 'auto' }}
        onClick={onNext}
      >
        ▶
      </button>
    </div>
  );
}

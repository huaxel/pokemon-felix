import { bagIcon } from '../worldAssets';

export function GymCard({ gym, isBeaten, isLocked, onSelect }) {
  return (
    <div
      className={`gym-card game-panel ${isBeaten ? 'beaten' : ''}`}
      style={{ borderColor: gym.color, borderWidth: '4px', borderStyle: 'solid' }}
    >
      <div
        className="gym-type"
        style={{
          color: gym.color,
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '0.7rem',
          marginBottom: '0.5rem',
        }}
      >
        {gym.type}
      </div>
      <h3
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
        }}
      >
        {gym.name}
      </h3>
      <p
        className="gym-desc"
        style={{ fontSize: '0.8rem', marginBottom: '1rem', minHeight: '40px' }}
      >
        {gym.description}
      </p>

      <div
        className="gym-rewards"
        style={{
          marginBottom: '1rem',
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '0.7rem',
        }}
      >
        <span
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          Beloning:{' '}
          <img
            src={bagIcon}
            alt="coins"
            className="coin-icon-inline"
            style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
          />{' '}
          {gym.reward}
        </span>
      </div>

      {isBeaten ? (
        <button
          className="btn-kenney neutral"
          disabled
          style={{ width: '100%', fontSize: '0.7rem', opacity: 0.7 }}
        >
          ✅ Badge Verdiend!
        </button>
      ) : (
        <button
          className="btn-kenney primary"
          style={{ backgroundColor: gym.color, borderColor: '#000' }}
          disabled={isLocked}
          onClick={() => onSelect(gym)}
        >
          {isLocked ? '🔒 Vergrendeld' : '⚔️ Uitdagen'}
        </button>
      )}
    </div>
  );
}

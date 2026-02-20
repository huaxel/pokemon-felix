export function GymBadgeDisplay({ badges, gymLeaders }) {
  const badgeCount = Object.values(badges).filter(Boolean).length;

  return (
    <div
      className="badge-display game-panel-dark"
      style={{ padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center' }}
    >
      <h2
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '1rem',
          color: '#fff',
          marginBottom: '1rem',
        }}
      >
        Jouw Badges: {badgeCount}/8
      </h2>
      <div
        className="badge-showcase"
        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {gymLeaders.map(gym => (
          <div
            key={gym.id}
            className={`badge-icon ${badges[gym.id] ? 'earned' : 'locked'}`}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '2px solid #000',
              backgroundColor: badges[gym.id] ? gym.color : '#334155',
              opacity: badges[gym.id] ? 1 : 0.5,
              boxShadow: badges[gym.id] ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
            }}
            title={gym.name}
          >
            {badges[gym.id] ? '⭐' : '🔒'}
          </div>
        ))}
      </div>
    </div>
  );
}

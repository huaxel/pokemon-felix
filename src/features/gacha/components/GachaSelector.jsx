import bagIcon from '../../../assets/items/bag_icon.png';

export function GachaSelector({
  category,
  selectedBall,
  setSelectedBall,
  tiers,
  onSummon,
  currentTier,
}) {
  return (
    <>
      <div className="ball-selector">
        {Object.values(tiers)
          .filter(t => t.type === category)
          .map(tier => (
            <div
              key={tier.id}
              className={`ball-option ${selectedBall === tier.id ? 'selected' : ''}`}
              onClick={() => setSelectedBall(tier.id)}
            >
              {typeof tier.image === 'string' && tier.image.length < 4 ? (
                <div className="item-emoji" style={{ fontSize: '2rem' }}>
                  {tier.image}
                </div>
              ) : (
                <img src={tier.image} alt={tier.name} />
              )}
              <div className="ball-info">
                <span className="ball-name">{tier.name}</span>
                <span className="ball-cost">
                  <img
                    src={bagIcon}
                    alt="coins"
                    className="coin-icon"
                    style={{ width: '12px', height: '12px' }}
                  />
                  {tier.cost}
                </span>
              </div>
            </div>
          ))}
      </div>

      <div className="summon-container">
        <img
          src={currentTier.image}
          alt="Summon"
          className="summon-pokeball"
          onClick={onSummon}
          style={{ imageRendering: 'pixelated' }}
        />
        <p
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '0.7rem',
            color: '#fbbf24',
            textShadow: '1px 1px 0 #000',
          }}
        >
          Tik op de {currentTier.name} om te kopen
        </p>
        <button className="summon-btn btn-kenney warning" onClick={onSummon}>
          Kopen (
          <img
            src={bagIcon}
            alt="coins"
            className="coin-icon-inline"
            style={{ width: '16px', verticalAlign: 'middle' }}
          />{' '}
          {currentTier.cost})
        </button>
      </div>
    </>
  );
}

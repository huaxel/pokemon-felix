export function TreasureSuccessView({ currentHunt, attempts, rewardPokemon, onNext }) {
  return (
    <div className="treasure-hunt-page success">
      <div className="success-content">
        <h1>🎉 Schat Gevonden!</h1>

        <div className="treasure-chest">
          <div className="chest-animation">🎁</div>
        </div>

        <div className="success-message">
          <p>Je hebt de schat gevonden op coördinaten:</p>
          <h2>
            ({currentHunt.target.x}, {currentHunt.target.y})
          </h2>
          <p className="attempts-text">In {attempts} pogingen!</p>
        </div>

        <div className="rewards-earned">
          <h3>🏆 Beloningen:</h3>
          <div className="reward-coins">💰 +{currentHunt.reward} munten</div>
          {rewardPokemon && (
            <div className="reward-pokemon">
              <img
                src={rewardPokemon.sprites.front_default}
                alt={rewardPokemon.name}
                className="reward-pokemon-img"
                style={{ imageRendering: 'pixelated' }}
              />
              <p className="pokemon-name">{rewardPokemon.name}</p>
              <p className="pokemon-added">✨ Toegevoegd aan collectie!</p>
            </div>
          )}
        </div>

        <button className="next-hunt-btn btn-kenney primary" onClick={onNext}>
          Volgende Queeste →
        </button>
      </div>
    </div>
  );
}

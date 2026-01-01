export function TreasureSuccessView({
    currentHunt,
    attempts,
    rewardPokemon,
    onNext
}) {
    return (
        <div className="treasure-hunt-page success">
            <div className="success-content">
                <h1>🎉 Treasure Found!</h1>

                <div className="treasure-chest">
                    <div className="chest-animation">🎁</div>
                </div>

                <div className="success-message">
                    <p>You found the treasure at coordinates:</p>
                    <h2>({currentHunt.target.x}, {currentHunt.target.y})</h2>
                    <p className="attempts-text">In {attempts} attempts!</p>
                </div>

                <div className="rewards-earned">
                    <h3>🏆 Rewards:</h3>
                    <div className="reward-coins">
                        💰 +{currentHunt.reward} coins
                    </div>
                    {rewardPokemon && (
                        <div className="reward-pokemon">
                            <img
                                src={rewardPokemon.sprites.front_default}
                                alt={rewardPokemon.name}
                                className="reward-pokemon-img"
                            />
                            <p className="pokemon-name">{rewardPokemon.name}</p>
                            <p className="pokemon-added">✨ Added to collection!</p>
                        </div>
                    )}
                </div>

                <button className="next-hunt-btn" onClick={onNext}>
                    Next Quest →
                </button>
            </div>
        </div>
    );
}

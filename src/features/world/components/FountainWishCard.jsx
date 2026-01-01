import { Coins, Zap } from 'lucide-react';

export function FountainWishCard({
    wish,
    showProbability,
    onWish,
    isWishing,
    canAfford
}) {
    return (
        <div className={`wish-card ${wish.id}`}>
            <div className="wish-icon">{wish.icon}</div>
            <h3>{wish.name}</h3>
            <p className="wish-description">{wish.description}</p>

            {showProbability && (
                <div className="probability-list">
                    <strong>Posibles recompensas:</strong>
                    {wish.rewards.map((reward, idx) => (
                        <div key={idx} className="probability-item">
                            <span>{(reward.chance * 100).toFixed(0)}%</span>
                            <span className="reward-desc">
                                {reward.type === 'coins' && `${reward.amount} monedas`}
                                {reward.type === 'item' && reward.item}
                                {reward.type === 'heal' && 'Curación total'}
                                {reward.type === 'lucky' && '¡Día de suerte!'}
                                {reward.type === 'nothing' && 'Nada'}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <button
                className="wish-button"
                onClick={() => onWish(wish.id)}
                disabled={isWishing || !canAfford}
            >
                {isWishing ? (
                    <>
                        <Zap size={20} className="spinning" />
                        Deseando...
                    </>
                ) : (
                    <>
                        <Coins size={20} />
                        {wish.cost} monedas
                    </>
                )}
            </button>
        </div>
    );
}

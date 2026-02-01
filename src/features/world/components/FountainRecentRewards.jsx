import { Gift } from 'lucide-react';

export function FountainRecentRewards({ recentRewards, getMessageColor }) {
    if (recentRewards.length === 0) return null;

    return (
        <div className="recent-rewards">
            <h3>
                <Gift size={20} />
                Recente Beloningen
            </h3>
            <div className="rewards-list">
                {recentRewards.map((reward, idx) => (
                    <div
                        key={idx}
                        className="reward-item"
                        style={{ borderLeftColor: getMessageColor(reward.type) }}
                    >
                        <span className="reward-wish">{reward.wish}</span>
                        <span className="reward-result">{reward.reward}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

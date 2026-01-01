import React from 'react';
import bagIcon from '../../../assets/items/bag_icon.png';

export function GymCard({ gym, isBeaten, isLocked, onChallenge }) {
    return (
        <div
            className={`gym-card ${isBeaten ? 'beaten' : ''}`}
            style={{ borderColor: gym.color }}
        >
            <div className="gym-type" style={{ color: gym.color }}>
                {gym.type}
            </div>
            <h3>{gym.name}</h3>
            <p className="gym-desc">{gym.description}</p>

            <div className="gym-rewards">
                <span>Reward: <img src={bagIcon} alt="coins" className="coin-icon-inline" /> {gym.reward}</span>
            </div>

            {isBeaten ? (
                <button className="gym-btn beaten" disabled>
                    ✅ Badge Earned!
                </button>
            ) : (
                <button
                    className="gym-btn challenge"
                    style={{ backgroundColor: gym.color }}
                    disabled={isLocked}
                    onClick={() => onChallenge(gym)}
                >
                    {isLocked ? '🔒 Locked' : '⚔️ Challenge'}
                </button>
            )}
        </div>
    );
}

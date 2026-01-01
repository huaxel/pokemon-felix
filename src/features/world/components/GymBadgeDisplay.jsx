import React from 'react';

export function GymBadgeDisplay({ badges, gymLeaders }) {
    const badgeCount = Object.values(badges).filter(Boolean).length;

    return (
        <div className="badge-display">
            <h2>Your Badges: {badgeCount}/8</h2>
            <div className="badge-showcase">
                {gymLeaders.map(gym => (
                    <div
                        key={gym.id}
                        className={`badge-icon ${badges[gym.id] ? 'earned' : 'locked'}`}
                        style={badges[gym.id] ? { backgroundColor: gym.color } : {}}
                        title={gym.name}
                    >
                        {badges[gym.id] ? '⭐' : '🔒'}
                    </div>
                ))}
            </div>
        </div>
    );
}

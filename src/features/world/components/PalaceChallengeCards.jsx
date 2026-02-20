import { Trophy, Coins, Zap } from 'lucide-react';

export function PalaceChallengeCards({ challenges, completedChallenges, onStartChallenge }) {
  return (
    <div className="challenges-grid">
      {challenges.map(challenge => (
        <div
          key={challenge.id}
          className={`challenge-card ${challenge.difficulty} ${completedChallenges.includes(challenge.id) ? 'completed' : ''}`}
        >
          <div className="challenge-icon">{challenge.icon}</div>
          <h3>{challenge.name}</h3>
          <p className="challenge-description">{challenge.description}</p>

          <div className="challenge-rewards">
            <strong>Beloningen:</strong>
            <div className="reward-list">
              <span>💰 {challenge.reward.coins} munten</span>
              {challenge.reward.item && <span>🎁 {challenge.reward.item}</span>}
              {challenge.reward.legendary && <span>✨ Legendarische Pokémon</span>}
            </div>
          </div>

          {completedChallenges.includes(challenge.id) ? (
            <button className="challenge-button completed" disabled>
              <Trophy size={20} />
              Voltooid
            </button>
          ) : (
            <button className="challenge-button" onClick={() => onStartChallenge(challenge.id)}>
              {challenge.cost > 0 ? (
                <>
                  <Coins size={20} />
                  {challenge.cost} munten
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Starten
                </>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

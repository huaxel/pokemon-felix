import React from 'react';
import './RelationshipBar.css';

export function RelationshipBar({ relationship }) {
  if (!relationship) return null;

  const { friendship_score, rivalry_score, relationship_type } = relationship;

  return (
    <div className="relationship-container">
      <div className="relationship-header">
        <span className="relationship-type">{relationship_type}</span>
      </div>

      <div className="score-row">
        <span className="score-label">VRIEND</span>
        <div className="score-bar-bg">
          <div className="score-bar-fill friendship" style={{ width: `${friendship_score}%` }} />
        </div>
        <span className="score-value">{friendship_score}</span>
      </div>

      <div className="score-row">
        <span className="score-label">RIVAAL</span>
        <div className="score-bar-bg">
          <div className="score-bar-fill rivalry" style={{ width: `${rivalry_score}%` }} />
        </div>
        <span className="score-value">{rivalry_score}</span>
      </div>
    </div>
  );
}

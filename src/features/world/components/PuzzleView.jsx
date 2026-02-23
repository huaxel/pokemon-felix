import React from 'react';

export function PuzzleView({ puzzle, puzzleState, onAction, onNext, floor }) {
  return (
    <div
      className="puzzle-container game-panel-dark"
      style={{
        border: '4px solid #4b5563',
        backgroundColor: '#1f2937',
        padding: '1rem',
        color: '#fff',
      }}
    >
      <h2
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '1rem',
          marginBottom: '1rem',
          color: '#fbbf24',
        }}
      >
        {puzzle.description}
      </h2>

      {puzzle.type === 'push' && (
        <div className="push-puzzle">
          <div className="puzzle-grid" style={{ marginBottom: '1rem' }}>
            <div className="block" style={{ fontSize: '2rem' }}>
              📦
            </div>
            <div className="target" style={{ fontSize: '2rem' }}>
              ❌
            </div>
          </div>
          <div
            className="puzzle-progress"
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}
          >
            Zetten: {puzzleState.progress}/{puzzle.solution.length}
          </div>
          <button className="btn-kenney primary" onClick={onAction}>
            Blok Duwen
          </button>
        </div>
      )}

      {puzzle.type === 'switch' && (
        <div className="switch-puzzle">
          <div
            className="switches"
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}
          >
            {Array.from({ length: puzzle.switches }).map((_, i) => (
              <div
                key={i}
                className={`switch ${i < puzzleState.progress ? 'active' : ''}`}
                style={{ fontSize: '2rem' }}
              >
                {i < puzzleState.progress ? '🟢' : '🔴'}
              </div>
            ))}
          </div>
          <button className="btn-kenney primary" onClick={onAction}>
            Schakelaar Activeren
          </button>
        </div>
      )}

      {puzzle.type === 'dark' && (
        <div className="dark-puzzle">
          <div className="dark-room" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            🌑
          </div>
          <div
            className="puzzle-progress"
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}
          >
            Stappen: {puzzleState.progress}/{puzzle.moves}
          </div>
          <button className="btn-kenney primary" onClick={onAction}>
            Vooruit in het donker
          </button>
        </div>
      )}

      {puzzle.type === 'ice' && (
        <div className="ice-puzzle">
          <div className="ice-floor" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            🧊
          </div>
          <div
            className="puzzle-progress"
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}
          >
            Glijbewegingen: {puzzleState.progress}/{puzzle.slides}
          </div>
          <button className="btn-kenney primary" onClick={onAction}>
            Glijden
          </button>
        </div>
      )}

      {puzzleState.completed && (
        <button
          className="btn-kenney success"
          onClick={onNext}
          style={{ marginTop: '1.5rem', width: '100%' }}
        >
          {floor < 5 ? '⬇️ Volgende Verdieping' : '🏆 Kerker Voltooien'}
        </button>
      )}
    </div>
  );
}

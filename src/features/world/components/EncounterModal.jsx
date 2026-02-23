import React from 'react';
import { BattleArena } from '../../battle/components/BattleArena';
import { BattleRewardModal } from './BattleRewardModal';

export function EncounterModal({
  encounter,
  showReward,
  battleMode,
  isBoss,
  catching,
  catchMessage,
  onRewardChoice,
  onBattleEnd,
  onCatch,
  onFight,
  onFlee,
  pokemonList,
  squadIds,
}) {
  return (
    <div
      className="encounter-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <div
        className="encounter-content game-panel"
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          border: '4px solid #4b5563',
          maxWidth: '90%',
        }}
      >
        {showReward ? (
          <BattleRewardModal pokemon={encounter} onChoice={onRewardChoice} />
        ) : battleMode ? (
          <BattleArena
            initialFighter1={pokemonList.find(p => p.id === squadIds[0])}
            initialFighter2={encounter}
            onBattleEnd={onBattleEnd}
          />
        ) : (
          <>
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              {isBoss ? '👑 Eindbaas!' : 'Wilde Pokémon!'}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <img
                src={encounter.image || encounter.sprites?.front_default}
                alt={encounter.name}
                style={{ imageRendering: 'pixelated', width: '128px', height: '128px' }}
              />
            </div>
            <h3
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.8rem',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              {encounter.name}
            </h3>

            {catchMessage && (
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '0.7rem',
                  color: '#10b981',
                }}
              >
                {catchMessage}
              </div>
            )}

            <div
              className="encounter-actions"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <button className="btn-kenney success" onClick={onCatch} disabled={catching}>
                {catching ? '...' : '⚾ Vangen'}
              </button>
              <button className="btn-kenney danger" onClick={onFight} disabled={catching}>
                ⚔️ Vechten
              </button>
              <button className="btn-kenney neutral" onClick={onFlee} disabled={catching}>
                🏃 Vluchten
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

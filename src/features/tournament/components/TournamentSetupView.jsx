export function TournamentSetupView({
  allPokemon,
  participants,
  onAutoFill,
  onStart,
  story,
  onContinueStory,
}) {
  return (
    <div className="tournament-layout">
      {story && (
        <div className="story-overlay">
          <div className="story-modal">
            <p>{story.text}</p>
            <button onClick={onContinueStory}>Continuar</button>
          </div>
        </div>
      )}
      <h1>Torneo Pokémon</h1>
      <div className="setup-controls">
        <button
          className="autofill-btn"
          onClick={onAutoFill}
          disabled={!allPokemon || allPokemon.length === 0}
        >
          {!allPokemon || allPokemon.length === 0 ? 'Cargando...' : 'Entrar con Equipo + Rellenar'}
        </button>
        <button className="start-btn" disabled={participants.length !== 8} onClick={onStart}>
          Comenzar Torneo
        </button>
      </div>
      <div className="participants-grid">
        {participants.map(p => (
          <div key={p.id} className="participant-card">
            <img src={p.sprites.front_default} alt={p.name} />
            <span>{p.name}</span>
          </div>
        ))}
        {[...Array(8 - participants.length)].map((_, i) => (
          <div key={`empty-${i}`} className="participant-card empty">
            ?
          </div>
        ))}
      </div>
    </div>
  );
}

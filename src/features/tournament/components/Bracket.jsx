import './Bracket.css';

export function Bracket({ rounds, currentMatch }) {
  return (
    <div className="bracket-container">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="bracket-round">
          <h3>{round.name}</h3>
          <div className="matches-column">
            {round.matches.map((match, matchIndex) => {
              const isCurrent =
                currentMatch &&
                currentMatch.roundIndex === roundIndex &&
                currentMatch.matchIndex === matchIndex;

              return (
                <div
                  key={matchIndex}
                  className={`bracket-match ${isCurrent ? 'active-match' : ''}`}
                >
                  <div className={`match-participant ${match.winner === match.p1 ? 'winner' : ''}`}>
                    {match.p1 && (
                      <img
                        src={match.p1.sprites.front_default}
                        alt={match.p1.name}
                        className="bracket-icon"
                      />
                    )}
                    <span>{match.p1 ? match.p1.name : '???'}</span>
                  </div>
                  <div className={`match-participant ${match.winner === match.p2 ? 'winner' : ''}`}>
                    {match.p2 && (
                      <img
                        src={match.p2.sprites.front_default}
                        alt={match.p2.name}
                        className="bracket-icon"
                      />
                    )}
                    <span>{match.p2 ? match.p2.name : '???'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

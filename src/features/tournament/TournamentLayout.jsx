import React, { useState } from 'react';
import { Bracket } from './components/Bracket';
import { TournamentBattle } from './components/TournamentBattle';
import './TournamentLayout.css';

export function TournamentLayout({ allPokemon }) {
    const [participants, setParticipants] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null); // { roundIndex, matchIndex }
    const [champion, setChampion] = useState(null);
    const [view, setView] = useState('setup'); // setup, bracket, battle, champion

    const startTournament = () => {
        if (participants.length !== 8) return;

        // Create Quarter Finals
        const quarterFinals = [];
        for (let i = 0; i < 8; i += 2) {
            quarterFinals.push({
                p1: participants[i],
                p2: participants[i + 1],
                winner: null
            });
        }

        const initialRounds = [
            { name: 'Cuartos de Final', matches: quarterFinals },
            { name: 'Semifinales', matches: Array(2).fill({ p1: null, p2: null, winner: null }) },
            { name: 'Final', matches: Array(1).fill({ p1: null, p2: null, winner: null }) }
        ];

        setRounds(initialRounds);
        setView('bracket');
        setCurrentMatch({ roundIndex: 0, matchIndex: 0 });
    };

    const autoFill = () => {
        if (!allPokemon || allPokemon.length === 0) return;
        const shuffled = [...allPokemon].sort(() => 0.5 - Math.random());
        setParticipants(shuffled.slice(0, 8));
    };

    const startNextMatch = () => {
        setView('battle');
    };

    const handleMatchEnd = (winner) => {
        const { roundIndex, matchIndex } = currentMatch;
        const newRounds = [...rounds];

        // Update current match winner
        newRounds[roundIndex].matches[matchIndex].winner = winner;

        // Advance winner to next round
        if (roundIndex < 2) {
            const nextRoundMatchIndex = Math.floor(matchIndex / 2);
            const isPlayer1 = matchIndex % 2 === 0;

            const nextMatch = { ...newRounds[roundIndex + 1].matches[nextRoundMatchIndex] };
            if (isPlayer1) {
                nextMatch.p1 = winner;
            } else {
                nextMatch.p2 = winner;
            }
            newRounds[roundIndex + 1].matches[nextRoundMatchIndex] = nextMatch;
        } else {
            // Champion!
            setChampion(winner);
            setView('champion');
            return;
        }

        setRounds(newRounds);

        // Determine next match
        let nextMatchIndex = matchIndex + 1;
        let nextRoundIndex = roundIndex;

        if (nextMatchIndex >= newRounds[roundIndex].matches.length) {
            nextRoundIndex++;
            nextMatchIndex = 0;
        }

        if (nextRoundIndex > 2) {
            // Should be caught by champion check, but just in case
            setView('champion');
        } else {
            setCurrentMatch({ roundIndex: nextRoundIndex, matchIndex: nextMatchIndex });
            setView('bracket');
        }
    };

    if (view === 'setup') {
        return (
            <div className="tournament-layout">
                <h1>Torneo Pokémon</h1>
                <div className="setup-controls">
                    <button className="autofill-btn" onClick={autoFill} disabled={!allPokemon || allPokemon.length === 0}>
                        {(!allPokemon || allPokemon.length === 0) ? 'Cargando...' : 'Relleno Automático (8)'}
                    </button>
                    <button
                        className="start-btn"
                        disabled={participants.length !== 8}
                        onClick={startTournament}
                    >
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

    if (view === 'champion') {
        return (
            <div className="tournament-layout champion-view">
                <h1>¡Tenemos un Campeón!</h1>
                <div className="champion-display">
                    <img src={champion.sprites.front_default} alt={champion.name} className="champion-img" />
                    <h2>{champion.name}</h2>
                </div>
                <button className="reset-btn" onClick={() => {
                    setParticipants([]);
                    setChampion(null);
                    setView('setup');
                }}>Nuevo Torneo</button>
            </div>
        );
    }

    if (view === 'battle') {
        const match = rounds[currentMatch.roundIndex].matches[currentMatch.matchIndex];
        return (
            <div className="tournament-layout">
                <h2>Partido {currentMatch.matchIndex + 1} - {rounds[currentMatch.roundIndex].name}</h2>
                <TournamentBattle
                    fighter1={match.p1}
                    fighter2={match.p2}
                    onBattleEnd={handleMatchEnd}
                />
            </div>
        );
    }

    // Bracket View
    return (
        <div className="tournament-layout">
            <h1>Torneo en Progreso</h1>
            <Bracket rounds={rounds} currentMatch={currentMatch} />
            <div className="action-area">
                <button className="next-match-btn" onClick={startNextMatch}>
                    Jugar Siguiente Partido
                </button>
            </div>
        </div>
    );
}

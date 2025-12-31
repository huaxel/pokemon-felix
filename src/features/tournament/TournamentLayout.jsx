import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Bracket } from './components/Bracket';
import { TournamentBattle } from './components/TournamentBattle';
import './TournamentLayout.css';

export function TournamentLayout({ allPokemon }) {
    const { addCoins, squadIds } = usePokemonContext();
    const [participants, setParticipants] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null); // { roundIndex, matchIndex }
    const [champion, setChampion] = useState(null);
    const [view, setView] = useState('setup'); // setup, bracket, battle, champion

    const [story, setStory] = useState(null); // { text: "...", onContinue: () => {} }

    const showStoryModal = (text, onContinue) => {
        setStory({ text, onContinue });
    };

    const handleStoryContinue = () => {
        const onContinue = story.onContinue;
        setStory(null);
        if (onContinue) onContinue();
    };

    const startTournament = () => {
        if (participants.length !== 8) return;

        showStoryModal("¡Bienvenidos a la Liga Félix! 8 entrenadores, 1 campeón. ¿Tienes lo que se necesita?", () => {
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
        });
    };

    const autoFill = () => {
        if (!allPokemon || allPokemon.length === 0) return;

        // Get user's squad
        const userSquad = allPokemon.filter(p => squadIds.includes(p.id));

        // Get random opponents (excluding squad)
        const opponents = allPokemon
            .filter(p => !squadIds.includes(p.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 8 - userSquad.length);

        // Combine squad + opponents
        // If squad is empty, it will just be randoms
        // If squad has 4, we add 4 randoms
        const tournamentParticipants = [...userSquad, ...opponents];

        // Shuffle positions so user isn't always first
        setParticipants(tournamentParticipants.sort(() => 0.5 - Math.random()));
    };

    const startNextMatch = () => {
        const roundName = rounds[currentMatch.roundIndex].name;
        let msg = `¡Es hora del duelo! ${roundName}`;

        if (currentMatch.roundIndex === 1 && currentMatch.matchIndex === 0) {
            msg = "¡Las Semifinales! Solo los mejores permanecen.";
        } else if (currentMatch.roundIndex === 2) {
            msg = "¡La Gran Final! El destino te espera.";
        }

        showStoryModal(msg, () => {
            setView('battle');
        });
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
            addCoins(200);
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
                {story && (
                    <div className="story-overlay">
                        <div className="story-modal">
                            <p>{story.text}</p>
                            <button onClick={handleStoryContinue}>Continuar</button>
                        </div>
                    </div>
                )}
                <h1>Torneo Pokémon</h1>
                <div className="setup-controls">
                    <button className="autofill-btn" onClick={autoFill} disabled={!allPokemon || allPokemon.length === 0}>
                        {(!allPokemon || allPokemon.length === 0) ? 'Cargando...' : 'Entrar con Equipo + Rellenar'}
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
                <div className="champion-card">
                    <img src={champion.sprites.other['official-artwork'].front_default} alt={champion.name} />
                    <h3>{champion.name}</h3>
                    <div className="winner-badge">🏆 Ganador 🏆</div>
                    <p className="reward-text">+200 Monedas</p>
                </div>
                <div className="champion-actions">
                    <Link to="/gacha" className="spend-btn">
                        🎁 Gastar Ganancias
                    </Link>
                    <button className="reset-btn" onClick={() => {
                        setParticipants([]);
                        setChampion(null);
                        setView('setup');
                    }}>Nuevo Torneo</button>
                </div>
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
            {story && (
                <div className="story-overlay">
                    <div className="story-modal">
                        <p>{story.text}</p>
                        <button onClick={handleStoryContinue}>Continuar</button>
                    </div>
                </div>
            )}
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

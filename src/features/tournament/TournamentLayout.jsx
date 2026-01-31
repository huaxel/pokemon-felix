import { useState } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Bracket } from './components/Bracket';
import { BattleArena } from '../battle/components/BattleArena';
import { TournamentSetupView } from './components/TournamentSetupView';
import { TournamentChampionView } from './components/TournamentChampionView';
import './TournamentLayout.css';

export function TournamentLayout({ allPokemon }) {
    const { addCoins, squadIds } = usePokemonContext();
    const [participants, setParticipants] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [champion, setChampion] = useState(null);
    const [view, setView] = useState('setup');
    const [story, setStory] = useState(null);

    const startTournament = () => {
        if (participants.length !== 8) return;
        setStory({
            text: "¡Bienvenidos a la Liga Félix! 8 entrenadores, 1 campeón. ¿Tienes lo que se necesita?",
            onContinue: () => {
                const quarterFinals = [];
                for (let i = 0; i < 8; i += 2) {
                    quarterFinals.push({ p1: participants[i], p2: participants[i + 1], winner: null });
                }
                setRounds([
                    { name: 'Cuartos de Final', matches: quarterFinals },
                    { name: 'Semifinales', matches: Array(2).fill({ p1: null, p2: null, winner: null }) },
                    { name: 'Final', matches: Array(1).fill({ p1: null, p2: null, winner: null }) }
                ]);
                setView('bracket');
                setCurrentMatch({ roundIndex: 0, matchIndex: 0 });
            }
        });
    };

    const autoFill = () => {
        if (!allPokemon?.length) return;
        const userSquad = allPokemon.filter(p => squadIds.includes(p.id));
        const opponents = allPokemon
            .filter(p => !squadIds.includes(p.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 8 - userSquad.length);
        setParticipants([...userSquad, ...opponents].sort(() => 0.5 - Math.random()));
    };

    const handleMatchEnd = (winner) => {
        const { roundIndex, matchIndex } = currentMatch;
        const newRounds = [...rounds];
        newRounds[roundIndex].matches[matchIndex].winner = winner;

        if (roundIndex < 2) {
            const nextIdx = Math.floor(matchIndex / 2);
            const match = { ...newRounds[roundIndex + 1].matches[nextIdx] };
            if (matchIndex % 2 === 0) match.p1 = winner; else match.p2 = winner;
            newRounds[roundIndex + 1].matches[nextIdx] = match;
            setRounds(newRounds);
            let nmi = matchIndex + 1, nri = roundIndex;
            if (nmi >= newRounds[roundIndex].matches.length) { nri++; nmi = 0; }
            setCurrentMatch({ roundIndex: nri, matchIndex: nmi });
            setView('bracket');
        } else {
            setChampion(winner); addCoins(200); setView('champion');
        }
    };

    if (view === 'setup') return <TournamentSetupView allPokemon={allPokemon} participants={participants} onAutoFill={autoFill} onStart={startTournament} story={story} onContinueStory={() => { const cb = story.onContinue; setStory(null); cb(); }} />;
    if (view === 'champion') return <TournamentChampionView champion={champion} onReset={() => { setParticipants([]); setChampion(null); setView('setup'); }} />;
    if (view === 'battle') {
        const match = rounds[currentMatch.roundIndex].matches[currentMatch.matchIndex];
        return (
            <div className="tournament-layout">
                <h2>{rounds[currentMatch.roundIndex].name} - Partido {currentMatch.matchIndex + 1}</h2>
                <BattleArena key={`${match.p1.id}-${match.p2.id}`} initialFighter1={match.p1} initialFighter2={match.p2} onBattleEnd={handleMatchEnd} />
            </div>
        );
    }

    return (
        <div className="tournament-layout">
            {story && <div className="story-overlay"><div className="story-modal"><p>{story.text}</p><button onClick={() => { const cb = story.onContinue; setStory(null); cb(); }}>Continuar</button></div></div>}
            <h1>Torneo en Progreso</h1>
            <Bracket rounds={rounds} currentMatch={currentMatch} />
            <div className="action-area">
                <button className="next-match-btn" onClick={() => {
                    const r = rounds[currentMatch.roundIndex];
                    let m = `¡Es hora del duelo! ${r.name}`;
                    if (currentMatch.roundIndex === 1 && currentMatch.matchIndex === 0) m = "¡Las Semifinales! Solo los mejores permanecen.";
                    else if (currentMatch.roundIndex === 2) m = "¡La Gran Final! El destino te espera.";
                    setStory({ text: m, onContinue: () => setView('battle') });
                }}>Jugar Siguiente Partido</button>
            </div>
        </div>
    );
}

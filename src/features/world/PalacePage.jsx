import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Trophy, Gift, Coins } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import { PalaceLockedView } from './components/PalaceLockedView';
import { PalaceChallengeCards } from './components/PalaceChallengeCards';
import { PalaceWisdomView } from './components/PalaceWisdomView';
import { PalaceStrengthView } from './components/PalaceStrengthView';
import { PalaceLuckView } from './components/PalaceLuckView';
import { PALACE_CHALLENGES, TRIVIA_QUESTIONS } from './palaceConfig';
import './PalacePage.css';

export function PalacePage() {
    const { coins, addCoins, spendCoins, addItem, ownedIds } = usePokemonContext();
    const [isChampion, setIsChampion] = useState(false);
    const [message, setMessage] = useState(null);
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [playerHP, setPlayerHP] = useState(100);
    const [legendaryHP, setLegendaryHP] = useState(100);
    const [diceRolling, setDiceRolling] = useState(false);
    const [diceResult, setDiceResult] = useState(null);

    useEffect(() => {
        const champ = ownedIds.length >= 50;
        setIsChampion(champ);
        if (!champ) showMsg('⛔ Solo los campeones pueden entrar al palacio.', 'error');
    }, [ownedIds]);

    const showMsg = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const startChallenge = (id) => {
        const c = PALACE_CHALLENGES.find(x => x.id === id);
        if (completedChallenges.includes(id)) return showMsg('Ya completaste este desafío hoy.', 'error');
        if (c.cost > 0 && !spendCoins(c.cost)) return showMsg('No tienes suficientes monedas.', 'error');
        setActiveChallenge(id);
        if (id === 'wisdom') { setCurrentQuestion(TRIVIA_QUESTIONS[0]); setScore(0); setQuestionsAnswered(0); }
        else if (id === 'strength') { setPlayerHP(100); setLegendaryHP(100); }
    };

    const handleChallengeWin = (id) => {
        const c = PALACE_CHALLENGES.find(x => x.id === id);
        setCompletedChallenges(p => [...p, id]);
        addCoins(c.reward.coins);
        if (c.reward.item) addItem(c.reward.item);
        showMsg(`🏆 ¡Desafío completado! +${c.reward.coins}`, 'jackpot');
        setActiveChallenge(null);
    };

    if (!isChampion) return <PalaceLockedView ownedCount={ownedIds.length} />;

    return (
        <div className="palace-page">
            <header className="palace-header"><Link to="/world"><img src={bagIcon} alt="Back" /></Link><h1>👑 Palacio</h1><div className="coins-display"><Coins size={20} /><span>{coins}</span></div></header>
            {message && <div className={`palace-message ${message.type}`}>{message.text}</div>}
            {!activeChallenge ? (
                <>
                    <div className="welcome-text"><h2>Bienvenido, Campeón</h2></div>
                    <PalaceChallengeCards challenges={PALACE_CHALLENGES} completedChallenges={completedChallenges} onStartChallenge={startChallenge} />
                    <div className="palace-stats">
                        <div className="stat-box"><Trophy size={24} /><span>{completedChallenges.length}</span></div>
                        <div className="stat-box"><Gift size={24} /><span>{ownedIds.length}</span></div>
                    </div>
                </>
            ) : (
                <div className="active-challenge">
                    {activeChallenge === 'wisdom' && <PalaceWisdomView currentQuestion={currentQuestion} questionsAnswered={questionsAnswered} score={score} onAnswer={(idx) => {
                        const correct = idx === currentQuestion.answer;
                        if (correct) setScore(s => s + 1);
                        if (questionsAnswered + 1 >= 3) { if (score + (correct ? 1 : 0) >= 2) handleChallengeWin('wisdom'); else setActiveChallenge(null); }
                        else { setQuestionsAnswered(q => q + 1); setCurrentQuestion(TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)]); }
                    }} />}
                    {activeChallenge === 'strength' && <PalaceStrengthView playerHP={playerHP} legendaryHP={legendaryHP} onAttack={() => {
                        const dmg = 20; const nHP = Math.max(0, legendaryHP - dmg); setLegendaryHP(nHP);
                        if (nHP === 0) handleChallengeWin('strength');
                        else setPlayerHP(h => Math.max(0, h - 15));
                    }} />}
                    {activeChallenge === 'luck' && <PalaceLuckView diceRolling={diceRolling} diceResult={diceResult} onRoll={() => {
                        setDiceRolling(true);
                        setTimeout(() => { const r = 6; setDiceResult(r); setDiceRolling(false); handleChallengeWin('luck'); }, 1000);
                    }} />}
                </div>
            )}
        </div>
    );
}

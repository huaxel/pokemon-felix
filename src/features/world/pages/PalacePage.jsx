import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { Trophy, Gift, Coins } from 'lucide-react';
import bagIcon from '../../../assets/items/bag_icon.png';
import { PalaceLockedView } from '../components/PalaceLockedView';
import { PalaceChallengeCards } from '../components/PalaceChallengeCards';
import { PalaceWisdomView } from '../components/PalaceWisdomView';
import { PalaceStrengthView } from '../components/PalaceStrengthView';
import { PalaceLuckView } from '../components/PalaceLuckView';
import { PALACE_CHALLENGES, TRIVIA_QUESTIONS } from '../palaceConfig';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile } from '../worldAssets';
import './PalacePage.css';

export function PalacePage() {
  const { coins, addCoins, spendCoins, addItem, ownedIds } = usePokemonContext();
  const [isChampion, setIsChampion] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [legendaryHP, setLegendaryHP] = useState(100);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const { showError, showCoins } = useToast();

  useEffect(() => {
    const champ = ownedIds.length >= 50;
    setIsChampion(champ);
    if (!champ) showError('⛔ Alleen kampioenen mogen het paleis betreden.');
  }, [ownedIds, showError]);

  const startChallenge = id => {
    const c = PALACE_CHALLENGES.find(x => x.id === id);
    if (completedChallenges.includes(id))
      return showError('Je hebt deze uitdaging vandaag al voltooid.');
    if (c.cost > 0 && !spendCoins(c.cost)) return showError('Niet genoeg munten.');
    setActiveChallenge(id);
    if (id === 'wisdom') {
      setCurrentQuestion(TRIVIA_QUESTIONS[0]);
      setScore(0);
      setQuestionsAnswered(0);
    } else if (id === 'strength') {
      setPlayerHP(100);
      setLegendaryHP(100);
    }
  };

  const handleChallengeWin = id => {
    const c = PALACE_CHALLENGES.find(x => x.id === id);
    setCompletedChallenges(p => [...p, id]);
    addCoins(c.reward.coins);
    if (c.reward.item) addItem(c.reward.item);
    showCoins(`🏆 Uitdaging voltooid! +${c.reward.coins}`);
    setActiveChallenge(null);
  };

  if (!isChampion) return <PalaceLockedView ownedCount={ownedIds.length} />;

  return (
    <div
      className="palace-page"
      style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
    >
      <WorldPageHeader title="Paleis van de Kampioen" icon="👑" />
      {!activeChallenge ? (
        <>
          <div className="welcome-text">
            <h2>Welkom, Kampioen</h2>
          </div>
          <PalaceChallengeCards
            challenges={PALACE_CHALLENGES}
            completedChallenges={completedChallenges}
            onStartChallenge={startChallenge}
          />
          <div className="palace-stats">
            <div className="stat-box">
              <Trophy size={24} />
              <span>{completedChallenges.length}</span>
            </div>
            <div className="stat-box">
              <Gift size={24} />
              <span>{ownedIds.length}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="active-challenge">
          {activeChallenge === 'wisdom' && (
            <PalaceWisdomView
              currentQuestion={currentQuestion}
              questionsAnswered={questionsAnswered}
              score={score}
              onAnswer={idx => {
                const correct = idx === currentQuestion.answer;
                if (correct) setScore(s => s + 1);
                if (questionsAnswered + 1 >= 3) {
                  if (score + (correct ? 1 : 0) >= 2) handleChallengeWin('wisdom');
                  else setActiveChallenge(null);
                } else {
                  setQuestionsAnswered(q => q + 1);
                  setCurrentQuestion(
                    TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)]
                  );
                }
              }}
            />
          )}
          {activeChallenge === 'strength' && (
            <PalaceStrengthView
              playerHP={playerHP}
              legendaryHP={legendaryHP}
              onAttack={() => {
                const dmg = 20;
                const nHP = Math.max(0, legendaryHP - dmg);
                setLegendaryHP(nHP);
                if (nHP === 0) handleChallengeWin('strength');
                else setPlayerHP(h => Math.max(0, h - 15));
              }}
            />
          )}
          {activeChallenge === 'luck' && (
            <PalaceLuckView
              diceRolling={diceRolling}
              diceResult={diceResult}
              onRoll={() => {
                setDiceRolling(true);
                setTimeout(() => {
                  const r = 6;
                  setDiceResult(r);
                  setDiceRolling(false);
                  handleChallengeWin('luck');
                }, 1000);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

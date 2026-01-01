import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Crown, Trophy, Sparkles, Star, Gift, Coins, Zap } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import { PalaceLockedView } from './components/PalaceLockedView';
import { PalaceChallengeCards } from './components/PalaceChallengeCards';
import { PalaceWisdomView } from './components/PalaceWisdomView';
import { PalaceStrengthView } from './components/PalaceStrengthView';
import { PalaceLuckView } from './components/PalaceLuckView';
import './PalacePage.css';

const PALACE_CHALLENGES = [
    {
        id: 'wisdom',
        name: 'Prueba de Sabiduría',
        icon: '🧠',
        description: 'Responde correctamente trivia de Pokémon',
        cost: 0,
        reward: { coins: 200, item: 'rare_candy' },
        difficulty: 'medium'
    },
    {
        id: 'strength',
        name: 'Prueba de Fuerza',
        icon: '💪',
        description: 'Derrota a un Pokémon legendario',
        cost: 100,
        reward: { coins: 500, legendary: true },
        difficulty: 'hard'
    },
    {
        id: 'luck',
        name: 'Prueba de Suerte',
        icon: '🎲',
        description: 'Lanza los dados reales del campeón',
        cost: 50,
        reward: { coins: 300, item: 'mystery_box' },
        difficulty: 'easy'
    }
];

const TRIVIA_QUESTIONS = [
    { question: '¿Qué tipo es Pikachu?', options: ['Eléctrico', 'Fuego', 'Agua', 'Planta'], answer: 0 },
    { question: '¿Cuántos tipos de Pokémon existen?', options: ['16', '17', '18', '19'], answer: 2 },
    { question: '¿Qué Pokémon es conocido como el Pokémon Legendario del Fuego?', options: ['Articuno', 'Zapdos', 'Moltres', 'Mewtwo'], answer: 2 },
    { question: '¿En qué se convierte Eevee con una Piedra Agua?', options: ['Vaporeon', 'Jolteon', 'Flareon', 'Espeon'], answer: 0 },
    { question: '¿Cuál es el Pokémon inicial de tipo Planta en Kanto?', options: ['Charmander', 'Squirtle', 'Bulbasaur', 'Pikachu'], answer: 2 },
    { question: '¿Qué movimiento tiene 100% de precisión y nunca falla?', options: ['Rayo', 'Impactrueno', 'Ataque Rápido', 'Hidrobomba'], answer: 2 },
    { question: '¿Cuál es el Pokémon con el número 001 en la Pokédex?', options: ['Pikachu', 'Mew', 'Bulbasaur', 'Charizard'], answer: 2 },
    { question: '¿Qué tipo es súper efectivo contra Dragón?', options: ['Fuego', 'Agua', 'Hielo', 'Eléctrico'], answer: 2 },
];

export function PalacePage() {
    const navigate = useNavigate();
    const { coins, addCoins, spendCoins, addItem, ownedIds } = usePokemonContext();
    const [isChampion, setIsChampion] = useState(false);
    const [message, setMessage] = useState(null);
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [activeChallenge, setActiveChallenge] = useState(null);

    // Wisdom Challenge State
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);

    // Strength Challenge State
    const [battlePhase, setBattlePhase] = useState('intro');
    const [playerHP, setPlayerHP] = useState(100);
    const [legendaryHP, setLegendaryHP] = useState(100);

    // Luck Challenge State
    const [diceRolling, setDiceRolling] = useState(false);
    const [diceResult, setDiceResult] = useState(null);

    useEffect(() => {
        const champion = ownedIds.length >= 50;
        setIsChampion(champion);

        if (!champion) {
            showMessage('⛔ Solo los campeones pueden entrar al palacio. Captura 50+ Pokémon primero.', 'error', 5000);
        } else {
            showMessage('👑 ¡Bienvenido al Palacio, Campeón!', 'success', 3000);
        }
    }, [ownedIds]);

    const showMessage = (text, type = 'info', duration = 3000) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), duration);
    };

    const startChallenge = (challengeId) => {
        const challenge = PALACE_CHALLENGES.find(c => c.id === challengeId);

        if (completedChallenges.includes(challengeId)) {
            showMessage('Ya completaste este desafío hoy. Regresa mañana.', 'error');
            return;
        }

        if (challenge.cost > 0 && !spendCoins(challenge.cost)) {
            showMessage('No tienes suficientes monedas para este desafío.', 'error');
            return;
        }

        setActiveChallenge(challengeId);

        if (challengeId === 'wisdom') {
            const randomQuestion = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
            setCurrentQuestion(randomQuestion);
            setScore(0);
            setQuestionsAnswered(0);
        } else if (challengeId === 'strength') {
            setBattlePhase('battle');
            setPlayerHP(100);
            setLegendaryHP(100);
        } else if (challengeId === 'luck') {
            setDiceResult(null);
        }
    };

    const answerQuestion = (optionIndex) => {
        if (optionIndex === currentQuestion.answer) {
            setScore(prev => prev + 1);
            showMessage('¡Correcto! 🎉', 'success', 1500);
        } else {
            showMessage('Incorrecto... La respuesta era: ' + currentQuestion.options[currentQuestion.answer], 'error', 2000);
        }

        setQuestionsAnswered(prev => prev + 1);

        if (questionsAnswered + 1 >= 3) {
            setTimeout(() => {
                if (score >= 2) {
                    completeChallenge('wisdom');
                } else {
                    showMessage('Necesitas al menos 2/3 correctas. Inténtalo de nuevo.', 'error');
                    setActiveChallenge(null);
                }
            }, 2000);
        } else {
            setTimeout(() => {
                const randomQuestion = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
                setCurrentQuestion(randomQuestion);
            }, 2000);
        }
    };

    const attackLegendary = () => {
        const damage = Math.floor(Math.random() * 25) + 15;
        const newHP = Math.max(0, legendaryHP - damage);
        setLegendaryHP(newHP);

        if (newHP === 0) {
            showMessage('¡Victoria! Has derrotado al Pokémon Legendario!', 'success');
            setTimeout(() => completeChallenge('strength'), 2000);
            return;
        }

        setTimeout(() => {
            const counterDamage = Math.floor(Math.random() * 30) + 10;
            const newPlayerHP = Math.max(0, playerHP - counterDamage);
            setPlayerHP(newPlayerHP);

            if (newPlayerHP === 0) {
                showMessage('Has sido derrotado... Inténtalo de nuevo.', 'error');
                setTimeout(() => {
                    setActiveChallenge(null);
                    setBattlePhase('intro');
                }, 2000);
            }
        }, 1000);
    };

    const rollDice = () => {
        setDiceRolling(true);
        setDiceResult(null);

        setTimeout(() => {
            const result = Math.floor(Math.random() * 6) + 1;
            setDiceResult(result);
            setDiceRolling(false);

            if (result >= 4) {
                showMessage(`¡Sacaste un ${result}! ¡Ganaste!`, 'success');
                setTimeout(() => completeChallenge('luck'), 2000);
            } else {
                showMessage(`Sacaste un ${result}. Necesitas 4 o más. Inténtalo de nuevo.`, 'error');
                setTimeout(() => setActiveChallenge(null), 2500);
            }
        }, 2000);
    };

    const completeChallenge = (challengeId) => {
        const challenge = PALACE_CHALLENGES.find(c => c.id === challengeId);
        setCompletedChallenges(prev => [...prev, challengeId]);

        addCoins(challenge.reward.coins);
        if (challenge.reward.item) {
            addItem(challenge.reward.item);
        }

        showMessage(`🏆 ¡Desafío completado! +${challenge.reward.coins} monedas`, 'jackpot', 4000);
        setActiveChallenge(null);

        setCurrentQuestion(null);
        setScore(0);
        setQuestionsAnswered(0);
        setBattlePhase('intro');
        setDiceResult(null);
    };

    if (!isChampion) {
        return <PalaceLockedView ownedCount={ownedIds.length} />;
    }

    return (
        <div className="palace-page">
            <header className="palace-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Back" />
                </Link>
                <h1>
                    <Crown size={32} />
                    Palacio del Campeón
                </h1>
                <div className="coins-display">
                    <Coins size={20} />
                    <span>{coins}</span>
                </div>
            </header>

            {message && (
                <div className={`palace-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="throne-room">
                <div className="throne">👑</div>
                <div className="sparkles">
                    <Sparkles className="sparkle-1" />
                    <Sparkles className="sparkle-2" />
                    <Star className="sparkle-3" />
                </div>
            </div>

            {!activeChallenge && (
                <>
                    <div className="welcome-text">
                        <h2>Bienvenido, Campeón {ownedIds.length >= 100 ? 'Maestro' : ''}</h2>
                        <p>Aquí los mejores entrenadores prueban su valía</p>
                    </div>

                    <PalaceChallengeCards
                        challenges={PALACE_CHALLENGES}
                        completedChallenges={completedChallenges}
                        onStartChallenge={startChallenge}
                    />
                </>
            )}

            {activeChallenge === 'wisdom' && (
                <PalaceWisdomView
                    currentQuestion={currentQuestion}
                    questionsAnswered={questionsAnswered}
                    score={score}
                    onAnswer={answerQuestion}
                />
            )}

            {activeChallenge === 'strength' && battlePhase === 'battle' && (
                <PalaceStrengthView
                    playerHP={playerHP}
                    legendaryHP={legendaryHP}
                    onAttack={attackLegendary}
                />
            )}

            {activeChallenge === 'luck' && (
                <PalaceLuckView
                    diceRolling={diceRolling}
                    diceResult={diceResult}
                    onRoll={rollDice}
                />
            )}

            <div className="palace-stats">
                <div className="stat-box">
                    <Trophy size={24} />
                    <span className="stat-value">{completedChallenges.length}</span>
                    <span className="stat-label">Desafíos Completados</span>
                </div>
                <div className="stat-box">
                    <Gift size={24} />
                    <span className="stat-value">{ownedIds.length}</span>
                    <span className="stat-label">Pokémon Capturados</span>
                </div>
            </div>
        </div>
    );
}

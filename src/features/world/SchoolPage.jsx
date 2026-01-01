import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { STORAGE_KEYS } from '../../lib/constants';
import { GraduationCap, BookOpen, Brain } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import { SchoolQuizCard } from './components/SchoolQuizCard';
import { SchoolQuizView } from './components/SchoolQuizView';
import { SchoolResultView } from './components/SchoolResultView';
import { SchoolCertificate } from './components/SchoolCertificate';
import './SchoolPage.css';

const QUIZZES = [
    {
        id: 'types',
        title: 'Experto en Tipos',
        description: '¿Qué tipo es efectivo contra qué?',
        icon: 'brain',
        questions: [
            { question: 'Fuego es súper efectivo contra...', options: ['Agua', 'Planta', 'Roca'], answer: 1 },
            { question: 'Agua es débil ante...', options: ['Planta', 'Fuego', 'Tierra'], answer: 0 },
            { question: 'Planta es súper efectivo contra...', options: ['Fuego', 'Hielo', 'Agua'], answer: 2 },
            { question: '¿Qué color representa al tipo Eléctrico?', options: ['Azul', 'Amarillo', 'Rojo'], answer: 1 }
        ]
    },
    {
        id: 'math',
        title: 'Maestro de Cálculos',
        description: '¡Las matemáticas nos ayudan en batalla!',
        icon: 'trophy',
        questions: [
            { question: 'Si haces 5 de daño y luego 3 de daño, ¿cuánto daño total haces?', options: ['7', '8', '9'], answer: 1 },
            { question: 'Tienes 10 de vida y te quitan 4. ¿Cuánta vida te queda?', options: ['5', '6', '7'], answer: 1 },
            { question: 'Un ataque cuesta 2 de energía. Si tienes 5, ¿cuánta energía te queda?', options: ['2', '3', '4'], answer: 1 },
            { question: 'Si un ataque que hace 2 de daño es súper efectivo (+1), ¿cuánto daño hace?', options: ['2', '3', '4'], answer: 1 }
        ]
    },
    {
        id: 'geography',
        title: 'Explorador del Mundo',
        description: '¿Dónde viven los Pokémon?',
        icon: 'map',
        questions: [
            { question: '¿Dónde es más probable encontrar un Geodude?', options: ['En el mar', 'En una cueva', 'En el cielo'], answer: 1 },
            { question: 'Los Pokémon de tipo Agua viven en...', options: ['Montañas', 'Ríos y lagos', 'Desiertos'], answer: 1 },
            { question: '¿Qué Pokémon encontrarías volando en el cielo?', options: ['Magikarp', 'Pidgey', 'Diglett'], answer: 1 },
            { question: 'Los Pokémon de tipo Planta prefieren...', options: ['Bosques', 'Volcanes', 'Cuevas'], answer: 0 }
        ]
    },
    {
        id: 'evolution',
        title: 'Maestro de Evolución',
        description: '¿Conoces las evoluciones?',
        icon: 'star',
        questions: [
            { question: 'Charmander evoluciona a...', options: ['Charizard', 'Charmeleon', 'Pikachu'], answer: 1 },
            { question: 'Pikachu evoluciona de...', options: ['Pichu', 'Raichu', 'Eevee'], answer: 0 },
            { question: '¿Cuántas evoluciones tiene Eevee?', options: ['3', '5', '8'], answer: 2 },
            { question: 'Squirtle NO evoluciona a...', options: ['Wartortle', 'Blastoise', 'Gyarados'], answer: 2 }
        ]
    },
    {
        id: 'reading',
        title: 'Lectura Pokémon',
        description: 'Lee y comprende historias',
        icon: 'book',
        questions: [
            { question: 'Pikachu es un Pokémon eléctrico amarillo. Le encanta el ketchup y es muy rápido. ¿De qué color es Pikachu?', options: ['Rojo', 'Amarillo', 'Azul'], answer: 1 },
            { question: 'Bulbasaur tiene una semilla en su espalda que crece con él. Es de tipo Planta. ¿Qué tiene en su espalda?', options: ['Una flor', 'Una semilla', 'Una roca'], answer: 1 },
            { question: 'Charizard puede volar alto en el cielo y lanzar fuego. Es muy fuerte. ¿Qué puede hacer Charizard?', options: ['Nadar', 'Volar', 'Cavar'], answer: 1 },
            { question: 'Snorlax duerme mucho y bloquea caminos. Es muy pesado y le gusta comer. ¿Qué hace Snorlax mucho?', options: ['Correr', 'Dormir', 'Bailar'], answer: 1 }
        ]
    },
    {
        id: 'coding_basics',
        title: 'Básicos de Código',
        description: 'Variables, bucles y lógica.',
        icon: 'brain',
        questions: [
            { question: 'Una variable es como...', options: ['Una caja para guardar datos', 'Un tipo de Pokémon', 'Un error'], answer: 0 },
            { question: '¿Qué hace un bucle (loop)?', options: ['Rompe el juego', 'Repite acciones', 'Borra datos'], answer: 1 },
            { question: 'if (tengoHambre) { comer() } significa...', options: ['Siempre como', 'Como si tengo hambre', 'Nunca como'], answer: 1 },
            { question: 'El operador == sirve para...', options: ['Asignar valor', 'Comparar igualdad', 'Sumar'], answer: 1 }
        ]
    }
];

export function SchoolPage() {
    const { addCoins, coins, updateQuestProgress } = usePokemonContext();
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [completedQuizzes, setCompletedQuizzes] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_QUIZZES);
        return saved ? JSON.parse(saved) : [];
    });
    const [showCertificate, setShowCertificate] = useState(false);
    const [view, setView] = useState('menu');
    const [feedback, setFeedback] = useState(null);

    const startQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setCurrentQuestion(0);
        setScore(0);
        setView('quiz');
        setFeedback(null);
    };

    const handleAnswer = (index) => {
        if (feedback) return;
        const isCorrect = index === selectedQuiz.questions[currentQuestion].answer;
        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback({ isCorrect: true, message: '¡Correcto! ✨' });
        } else {
            setFeedback({ isCorrect: false, message: '¡Ups! Inténtalo de nuevo. 💡' });
        }
        setTimeout(() => {
            setFeedback(null);
            if (currentQuestion + 1 < selectedQuiz.questions.length) setCurrentQuestion(prev => prev + 1);
            else setView('result');
        }, 1500);
    };

    const finishQuiz = () => {
        addCoins(score * 50);
        if (score >= selectedQuiz.questions.length / 2) updateQuestProgress('school');
        if (!completedQuizzes.includes(selectedQuiz.id)) {
            const newCompleted = [...completedQuizzes, selectedQuiz.id];
            setCompletedQuizzes(newCompleted);
            localStorage.setItem(STORAGE_KEYS.COMPLETED_QUIZZES, JSON.stringify(newCompleted));
            setShowCertificate(true);
        } else {
            setView('menu');
            setSelectedQuiz(null);
        }
    };

    const closeCertificate = () => {
        setShowCertificate(false);
        setView('menu');
        setSelectedQuiz(null);
    };

    return (
        <div className="school-page">
            <header className="school-header">
                <Link to="/adventure" className="back-btn">Terug naar Wereld</Link>
                <h1><GraduationCap /> Colegio Pokémon</h1>
                <div className="coin-display"><img src={bagIcon} alt="coins" /> {coins}</div>
            </header>

            {view === 'menu' && (
                <div className="school-menu">
                    <div className="school-intro">
                        <BookOpen size={48} className="intro-icon" />
                        <h2>¡Hola Felix! Bienvenido a clase.</h2>
                        <p>Aprende sobre tus Pokémon y resuelve problemas para ganar monedas.</p>
                    </div>
                    <div className="quiz-grid">
                        {QUIZZES.map(quiz => (
                            <SchoolQuizCard key={quiz.id} quiz={quiz} isCompleted={completedQuizzes.includes(quiz.id)} onStart={startQuiz} />
                        ))}
                    </div>
                    <div className="advanced-section">
                        <h3>🎓 Clases Avanzadas</h3>
                        <div className="quiz-grid">
                            <div className="quiz-card porygon-card" onClick={() => window.location.href = '/porygon-lab'}>
                                <div className="quiz-icon"><Brain color="#ec4899" /></div>
                                <div className="quiz-info">
                                    <h3>Laboratorio Porygon</h3>
                                    <p>Aprende algoritmos programando a Porygon.</p>
                                </div>
                                <button className="start-quiz-btn">Entrar al Lab</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 'quiz' && selectedQuiz && (
                <SchoolQuizView quiz={selectedQuiz} currentQuestion={currentQuestion} feedback={feedback} onAnswer={handleAnswer} />
            )}

            {view === 'result' && (
                <SchoolResultView score={score} total={selectedQuiz.questions.length} onFinish={finishQuiz} />
            )}

            {showCertificate && (
                <SchoolCertificate quiz={selectedQuiz} score={score} onClose={closeCertificate} />
            )}
        </div>
    );
}

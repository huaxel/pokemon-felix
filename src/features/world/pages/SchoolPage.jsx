import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { STORAGE_KEYS } from '../../../lib/constants';
import { GraduationCap, BookOpen, Brain } from 'lucide-react';
import bagIcon from '../../../assets/items/bag_icon.png';
import { grassTile } from '../worldAssets';
import { SchoolQuizCard } from '../components/SchoolQuizCard';
import { SchoolQuizView } from '../components/SchoolQuizView';
import { SchoolResultView } from '../components/SchoolResultView';
import { SchoolCertificate } from '../components/SchoolCertificate';
import './SchoolPage.css';

const QUIZZES = [
  {
    id: 'types',
    title: 'Type Expert',
    description: 'Welk type is effectief waartegen?',
    icon: 'brain',
    questions: [
      {
        question: 'Vuur is super effectief tegen...',
        options: ['Water', 'Gras', 'Steen'],
        answer: 1,
      },
      { question: 'Water is zwak tegen...', options: ['Gras', 'Vuur', 'Grond'], answer: 0 },
      {
        question: 'Gras is super effectief tegen...',
        options: ['Vuur', 'IJs', 'Water'],
        answer: 2,
      },
      {
        question: 'Welke kleur staat voor het type Elektrisch?',
        options: ['Blauw', 'Geel', 'Rood'],
        answer: 1,
      },
    ],
  },
  {
    id: 'math',
    title: 'Rekenmeester',
    description: 'Wiskunde helpt ons in gevechten!',
    icon: 'trophy',
    questions: [
      {
        question: 'Als je 5 schade doet en daarna 3, hoeveel schade doe je totaal?',
        options: ['7', '8', '9'],
        answer: 1,
      },
      {
        question: 'Je hebt 10 levenspunten en verliest er 4. Hoeveel heb je er over?',
        options: ['5', '6', '7'],
        answer: 1,
      },
      {
        question: 'Een aanval kost 2 energie. Als je er 5 hebt, hoeveel energie heb je over?',
        options: ['2', '3', '4'],
        answer: 1,
      },
      {
        question:
          'Als een aanval van 2 schade super effectief is (+1), hoeveel schade doet hij dan?',
        options: ['2', '3', '4'],
        answer: 1,
      },
    ],
  },
  {
    id: 'geography',
    title: 'Wereldverkenner',
    description: 'Waar leven Pokémon?',
    icon: 'map',
    questions: [
      {
        question: 'Waar vind je waarschijnlijk een Geodude?',
        options: ['In de zee', 'In een grot', 'In de lucht'],
        answer: 1,
      },
      {
        question: 'Pokémon van het type Water leven in...',
        options: ['Bergen', 'Rivieren en meren', 'Woestijnen'],
        answer: 1,
      },
      {
        question: 'Welke Pokémon zou je in de lucht zien vliegen?',
        options: ['Magikarp', 'Pidgey', 'Diglett'],
        answer: 1,
      },
      {
        question: 'Pokémon van het type Gras geven de voorkeur aan...',
        options: ['Bossen', 'Vulkanen', 'Grotten'],
        answer: 0,
      },
    ],
  },
  {
    id: 'evolution',
    title: 'Evolutie Meester',
    description: 'Ken jij de evoluties?',
    icon: 'star',
    questions: [
      {
        question: 'Charmander evolueert in...',
        options: ['Charizard', 'Charmeleon', 'Pikachu'],
        answer: 1,
      },
      { question: 'Pikachu evolueert van...', options: ['Pichu', 'Raichu', 'Eevee'], answer: 0 },
      { question: 'Hoeveel evoluties heeft Eevee?', options: ['3', '5', '8'], answer: 2 },
      {
        question: 'Squirtle evolueert NIET in...',
        options: ['Wartortle', 'Blastoise', 'Gyarados'],
        answer: 2,
      },
    ],
  },
  {
    id: 'reading',
    title: 'Pokémon Lezen',
    description: 'Lees en begrijp verhalen',
    icon: 'book',
    questions: [
      {
        question:
          'Pikachu is een gele elektrische Pokémon. Hij houdt van ketchup en is erg snel. Welke kleur heeft Pikachu?',
        options: ['Rood', 'Geel', 'Blauw'],
        answer: 1,
      },
      {
        question:
          'Bulbasaur heeft een zaadje op zijn rug dat met hem meegroeit. Hij is van het type Gras. Wat heeft hij op zijn rug?',
        options: ['Een bloem', 'Een zaadje', 'Een steen'],
        answer: 1,
      },
      {
        question:
          'Charizard kan hoog in de lucht vliegen en vuur spuwen. Hij is erg sterk. Wat kan Charizard doen?',
        options: ['Zwemmen', 'Vliegen', 'Graven'],
        answer: 1,
      },
      {
        question:
          'Snorlax slaapt veel en blokkeert wegen. Hij is erg zwaar en houdt van eten. Wat doet Snorlax veel?',
        options: ['Rennen', 'Slapen', 'Dansen'],
        answer: 1,
      },
    ],
  },
  {
    id: 'coding_basics',
    title: 'Code Basis',
    description: 'Variabelen, lussen en logica.',
    icon: 'brain',
    questions: [
      {
        question: 'Een variabele is als...',
        options: ['Een doos om gegevens in te bewaren', 'Een type Pokémon', 'Een fout'],
        answer: 0,
      },
      {
        question: 'Wat doet een lus (loop)?',
        options: ['Maakt het spel kapot', 'Herhaalt acties', 'Wist gegevens'],
        answer: 1,
      },
      {
        question: 'if (hebHonger) { eten() } betekent...',
        options: ['Ik eet altijd', 'Ik eet als ik honger heb', 'Ik eet nooit'],
        answer: 1,
      },
      {
        question: 'De operator == dient voor...',
        options: ['Waarde toewijzen', 'Gelijkheid vergelijken', 'Optellen'],
        answer: 1,
      },
    ],
  },
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

  const startQuiz = quiz => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setView('quiz');
    setFeedback(null);
  };

  const handleAnswer = index => {
    if (feedback) return;
    const isCorrect = index === selectedQuiz.questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ isCorrect: true, message: 'Correct! ✨' });
    } else {
      setFeedback({ isCorrect: false, message: 'Oeps! Probeer het opnieuw. 💡' });
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
    <div
      className="school-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <header className="school-header">
        <Link to="/adventure" className="btn-adventure back-btn">
          Terug naar Wereld
        </Link>
        <h1 style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '2px 2px 0 #000' }}>
          <GraduationCap /> Pokémon School
        </h1>
        <div className="coin-display" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          <img
            src={bagIcon}
            alt="coins"
            style={{ imageRendering: 'pixelated', width: '24px', height: '24px' }}
          />{' '}
          {coins}
        </div>
      </header>

      {view === 'menu' && (
        <div className="school-menu">
          <div
            className="school-intro-container"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '1rem',
              borderRadius: '8px',
              border: '4px solid #8b5cf6',
            }}
          >
            <img
              src={professorTile}
              alt="Professor"
              className="school-npc"
              style={{ imageRendering: 'pixelated', width: '96px', height: '96px' }}
            />
            <div className="school-intro">
              <BookOpen size={48} className="intro-icon" color="#fbbf24" />
              <h2
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  color: '#fbbf24',
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                }}
              >
                Hallo Felix! Welkom in de klas.
              </h2>
              <p style={{ color: '#fff' }}>
                Leer over je Pokémon en los problemen op om munten te verdienen.
              </p>
            </div>
          </div>
          <div className="quiz-grid">
            {QUIZZES.map(quiz => (
              <SchoolQuizCard
                key={quiz.id}
                quiz={quiz}
                isCompleted={completedQuizzes.includes(quiz.id)}
                onStart={startQuiz}
              />
            ))}
          </div>
          <div className="advanced-section">
            <h3
              style={{
                fontFamily: '"Press Start 2P", cursive',
                color: '#fff',
                textShadow: '2px 2px 0 #000',
              }}
            >
              🎓 Geavanceerde Lessen
            </h3>
            <div className="quiz-grid">
              <div
                className="quiz-card porygon-card"
                onClick={() => (window.location.href = '/porygon-lab')}
                style={{ cursor: 'pointer', border: '4px solid #ec4899', backgroundColor: '#fff' }}
              >
                <div className="quiz-icon">
                  <Brain color="#ec4899" />
                </div>
                <div className="quiz-info">
                  <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem' }}>
                    Porygon Laboratorium
                  </h3>
                  <p>Leer algoritmen door Porygon te programmeren.</p>
                </div>
                <button className="start-quiz-btn btn-kenney primary">Naar het Lab</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'quiz' && selectedQuiz && (
        <SchoolQuizView
          quiz={selectedQuiz}
          currentQuestion={currentQuestion}
          feedback={feedback}
          onAnswer={handleAnswer}
        />
      )}

      {view === 'result' && (
        <SchoolResultView
          score={score}
          total={selectedQuiz.questions.length}
          onFinish={finishQuiz}
        />
      )}

      {showCertificate && (
        <SchoolCertificate quiz={selectedQuiz} score={score} onClose={closeCertificate} />
      )}
    </div>
  );
}

import { Brain, Trophy, Map, Star, Book } from 'lucide-react';

export function SchoolQuizCard({ quiz, isCompleted, onStart }) {
  const getQuizIcon = iconName => {
    const icons = { brain: Brain, trophy: Trophy, map: Map, star: Star, book: Book };
    const IconComponent = icons[iconName] || Brain;
    return <IconComponent color="#3b82f6" />;
  };

  return (
    <div className={`quiz-card ${isCompleted ? 'completed' : ''}`} onClick={() => onStart(quiz)}>
      <div className="quiz-icon">{getQuizIcon(quiz.icon)}</div>
      <div className="quiz-info">
        <h3>
          {quiz.title} {isCompleted && '✅'}
        </h3>
        <p>{quiz.description}</p>
      </div>
      <button className="start-quiz-btn">{isCompleted ? 'Opnieuw' : 'Start'}</button>
    </div>
  );
}

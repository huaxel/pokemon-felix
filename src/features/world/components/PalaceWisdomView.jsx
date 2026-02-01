export function PalaceWisdomView({
    currentQuestion,
    questionsAnswered,
    score,
    onAnswer
}) {
    if (!currentQuestion) return null;

    return (
        <div className="challenge-active wisdom">
            <h2>Test van Wijsheid 🧠</h2>
            <div className="score-display">
                Vraag {questionsAnswered + 1}/3 | Correct: {score}
            </div>
            <div className="question-box">
                <h3>{currentQuestion.question}</h3>
                <div className="options-grid">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            className="option-button"
                            onClick={() => onAnswer(idx)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

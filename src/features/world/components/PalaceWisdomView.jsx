export function PalaceWisdomView({
    currentQuestion,
    questionsAnswered,
    score,
    onAnswer
}) {
    if (!currentQuestion) return null;

    return (
        <div className="challenge-active wisdom">
            <h2>Prueba de Sabiduría 🧠</h2>
            <div className="score-display">
                Pregunta {questionsAnswered + 1}/3 | Correctas: {score}
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

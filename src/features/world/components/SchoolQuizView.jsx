export function SchoolQuizView({
    quiz,
    currentQuestion,
    feedback,
    onAnswer
}) {
    if (!quiz) return null;
    const question = quiz.questions[currentQuestion];

    return (
        <div className="quiz-container">
            <div className="quiz-progress">
                Pregunta {currentQuestion + 1} de {quiz.questions.length}
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentQuestion) / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="question-box">
                <h2>{question.question}</h2>

                <div className="options-grid">
                    {question.options.map((option, i) => (
                        <button
                            key={i}
                            className={`option-btn ${feedback?.isCorrect && question.answer === i ? 'correct' : ''}`}
                            onClick={() => onAnswer(i)}
                            disabled={!!feedback}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {feedback && (
                <div className={`quiz-feedback ${feedback.isCorrect ? 'positive' : 'negative'}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
}

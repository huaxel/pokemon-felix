export function PalaceLuckView({
    diceRolling,
    diceResult,
    onRoll
}) {
    return (
        <div className="challenge-active luck">
            <h2>Prueba de Suerte 🎲</h2>
            <p>Lanza el dado. Necesitas 4 o más para ganar.</p>
            <div className="dice-container">
                <div className={`dice ${diceRolling ? 'rolling' : ''}`}>
                    {diceResult ? diceResult : '?'}
                </div>
            </div>
            {!diceResult && (
                <button
                    className="roll-button"
                    onClick={onRoll}
                    disabled={diceRolling}
                >
                    {diceRolling ? '🎲 Rodando...' : '🎲 Lanzar Dado'}
                </button>
            )}
        </div>
    );
}

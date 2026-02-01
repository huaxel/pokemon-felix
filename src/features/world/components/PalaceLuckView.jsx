export function PalaceLuckView({
    diceRolling,
    diceResult,
    onRoll
}) {
    return (
        <div className="challenge-active luck">
            <h2>Test van Geluk 🎲</h2>
            <p>Rol de dobbelsteen. Je hebt 4 of hoger nodig om te winnen.</p>
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
                    {diceRolling ? '🎲 Rollen...' : '🎲 Gooi Dobbelsteen'}
                </button>
            )}
        </div>
    );
}

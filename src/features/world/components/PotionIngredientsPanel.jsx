
export function PotionIngredientsPanel({ availableIngredients, selectedCount, maxCount, onAdd }) {

    // Helper to get color for difficulty based borders, but we pass raw ingredients here.
    // In original code, ingredients had a color prop.

    return (
        <div className="ingredients-panel">
            <h3>Ingredientes Disponibles</h3>
            <div className="ingredients-grid">
                {availableIngredients.map(ingredient => (
                    <button
                        key={ingredient.id}
                        className="ingredient-card"
                        onClick={() => onAdd(ingredient)}
                        style={{ borderColor: ingredient.color }}
                        disabled={selectedCount >= maxCount}
                    >
                        <div className="ingredient-emoji-large">{ingredient.emoji}</div>
                        <div className="ingredient-details">
                            <span className="ingredient-name">{ingredient.name}</span>
                            <span className={`ingredient-value ${ingredient.value > 0 ? 'positive' : 'negative'}`}>
                                {ingredient.value > 0 ? '+' : ''}{ingredient.value}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

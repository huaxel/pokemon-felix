
import { Droplet, RotateCcw, Sparkles, Plus, Minus } from 'lucide-react';

export function PotionBrewingStation({
    targetValue,
    currentValue,
    selectedIngredients,
    difficultyColor,
    onRemoveLast,
    onClear
}) {
    return (
        <div className="brewing-station">
            <div className="target-display">
                <h2>Objetivo</h2>
                <div className="target-value" style={{ color: difficultyColor }}>
                    {targetValue}
                </div>
                <p>Alcanza este número exacto</p>
            </div>

            {/* Current Potion */}
            <div className="potion-flask">
                <Droplet size={80} className="flask-icon" />
                <div className="current-value">
                    <span className={currentValue === targetValue ? 'perfect' : currentValue > targetValue ? 'over' : 'under'}>
                        {currentValue}
                    </span>
                </div>
                {currentValue === targetValue && currentValue > 0 && (
                    <div className="perfect-indicator">
                        <Sparkles size={24} />
                        ¡Perfecto!
                    </div>
                )}
            </div>

            {/* Selected Ingredients */}
            <div className="selected-ingredients">
                <h3>Ingredientes Mezclados</h3>
                <div className="ingredients-list">
                    {selectedIngredients.length === 0 ? (
                        <p className="empty-state">Ninguno todavía...</p>
                    ) : (
                        selectedIngredients.map((ing, idx) => (
                            <div key={ing.id} className="selected-ingredient" style={{ borderColor: ing.color }}>
                                <span className="ingredient-emoji">{ing.emoji}</span>
                                <div className="ingredient-info">
                                    <span className="ingredient-name">{ing.name}</span>
                                    <span className={`ingredient-value ${ing.value > 0 ? 'positive' : 'negative'}`}>
                                        {ing.value > 0 ? '+' : ''}{ing.value}
                                    </span>
                                </div>
                                {idx < selectedIngredients.length - 1 && (
                                    <span className="math-operator">
                                        {selectedIngredients[idx + 1].value > 0 ? <Plus size={16} /> : <Minus size={16} />}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="ingredient-actions">
                    <button onClick={onRemoveLast} disabled={selectedIngredients.length === 0}>
                        Quitar Último
                    </button>
                    <button onClick={onClear} disabled={selectedIngredients.length === 0}>
                        <RotateCcw size={16} />
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Brew Button moved inside station context usually, or kept separate. 
                In original design, it was separate section. We can leave it outside in Page or move it here.
                Let's leave it outside to keep this component focused on the station status. 
            */}
        </div>
    );
}

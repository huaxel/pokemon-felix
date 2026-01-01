import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Droplet, Trophy, RotateCcw, Sparkles, Plus, Minus } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import './PotionLabPage.css';

const INGREDIENTS = [
    { id: 'oran', name: 'Baya Aranja', value: 5, color: '#3b82f6', emoji: '🔵' },
    { id: 'sitrus', name: 'Baya Sitrus', value: 10, color: '#eab308', emoji: '🟡' },
    { id: 'pecha', name: 'Baya Meloc', value: 3, color: '#ec4899', emoji: '🟣' },
    { id: 'rawst', name: 'Raíz Amarga', value: -4, color: '#8b5cf6', emoji: '🟤' },
    { id: 'cheri', name: 'Baya Zreza', value: 8, color: '#ef4444', emoji: '🔴' },
    { id: 'aspear', name: 'Baya Safre', value: -2, color: '#06b6d4', emoji: '⚪' },
];

const DIFFICULTIES = {
    EASY: { name: 'Fácil', range: [10, 30], ingredients: 3, reward: 50 },
    MEDIUM: { name: 'Medio', range: [20, 50], ingredients: 4, reward: 100 },
    HARD: { name: 'Difícil', range: [30, 80], ingredients: 5, reward: 200 },
};

export function PotionLabPage() {
    const { addCoins, coins } = usePokemonContext();
    const [difficulty, setDifficulty] = useState('EASY');
    const [targetValue, setTargetValue] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [message, setMessage] = useState(null);
    const [completedPotions, setCompletedPotions] = useState(0);
    const [showTutorial, setShowTutorial] = useState(true);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        generateNewChallenge();
    }, [difficulty]);

    useEffect(() => {
        const total = selectedIngredients.reduce((sum, ing) => sum + ing.value, 0);
        setCurrentValue(total);
    }, [selectedIngredients]);

    const generateNewChallenge = () => {
        const config = DIFFICULTIES[difficulty];
        const min = config.range[0];
        const max = config.range[1];
        const target = Math.floor(Math.random() * (max - min + 1)) + min;
        setTargetValue(target);
        setSelectedIngredients([]);
        setMessage(null);
    };

    const showMessage = (text, type = 'info', duration = 3000) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), duration);
    };

    const addIngredient = (ingredient) => {
        const config = DIFFICULTIES[difficulty];
        if (selectedIngredients.length >= config.ingredients) {
            showMessage('¡Máximo de ingredientes alcanzado!', 'warning');
            return;
        }
        setSelectedIngredients([...selectedIngredients, { ...ingredient, id: Math.random() }]);
    };

    const removeLastIngredient = () => {
        if (selectedIngredients.length > 0) {
            setSelectedIngredients(selectedIngredients.slice(0, -1));
        }
    };

    const clearIngredients = () => {
        setSelectedIngredients([]);
    };

    const brewPotion = () => {
        if (selectedIngredients.length === 0) {
            showMessage('¡Añade algunos ingredientes primero!', 'warning');
            return;
        }

        if (currentValue === targetValue) {
            const config = DIFFICULTIES[difficulty];
            const reward = config.reward + (streak * 10);
            addCoins(reward);
            setCompletedPotions(prev => prev + 1);
            setStreak(prev => prev + 1);
            showMessage(`¡Perfecto! +${reward} monedas 🎉`, 'success');
            setTimeout(() => generateNewChallenge(), 2000);
        } else {
            const diff = Math.abs(currentValue - targetValue);
            setStreak(0);
            if (diff <= 2) {
                showMessage(`¡Muy cerca! Solo ${diff} de diferencia. Intenta de nuevo.`, 'warning');
            } else {
                showMessage(`No es correcto. Tienes ${currentValue}, necesitas ${targetValue}`, 'error');
            }
        }
    };

    const getDifficultyColor = () => {
        switch(difficulty) {
            case 'EASY': return '#10b981';
            case 'MEDIUM': return '#f59e0b';
            case 'HARD': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    return (
        <div className="potion-lab-page">
            <header className="lab-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Back" />
                </Link>
                <h1>
                    <Droplet size={32} />
                    Laboratorio de Pociones
                </h1>
                <div className="coins-display">
                    <span>{coins}</span> 💰
                </div>
            </header>

            {message && (
                <div className={`lab-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {showTutorial && (
                <div className="tutorial-box">
                    <button 
                        className="close-tutorial"
                        onClick={() => setShowTutorial(false)}
                    >
                        ✕
                    </button>
                    <h3>🧪 ¿Cómo jugar?</h3>
                    <p>1. Elige una dificultad</p>
                    <p>2. Mezcla ingredientes para alcanzar el número objetivo</p>
                    <p>3. Los números positivos suman (+), los negativos restan (-)</p>
                    <p>4. ¡Crea la poción perfecta y gana monedas!</p>
                </div>
            )}

            {/* Stats Bar */}
            <div className="stats-bar">
                <div className="stat-item">
                    <Trophy size={20} />
                    <span>{completedPotions}</span>
                    <small>Pociones</small>
                </div>
                <div className="stat-item">
                    <Sparkles size={20} />
                    <span>{streak}</span>
                    <small>Racha</small>
                </div>
            </div>

            {/* Difficulty Selector */}
            <div className="difficulty-selector">
                {Object.entries(DIFFICULTIES).map(([key, config]) => (
                    <button
                        key={key}
                        className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                        onClick={() => setDifficulty(key)}
                        style={{ 
                            borderColor: difficulty === key ? getDifficultyColor() : 'transparent',
                            background: difficulty === key ? `${getDifficultyColor()}33` : 'rgba(255,255,255,0.1)'
                        }}
                    >
                        {config.name}
                        <small>{config.reward} 💰</small>
                    </button>
                ))}
            </div>

            {/* Brewing Station */}
            <div className="brewing-station">
                <div className="target-display">
                    <h2>Objetivo</h2>
                    <div className="target-value" style={{ color: getDifficultyColor() }}>
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
                        <button onClick={removeLastIngredient} disabled={selectedIngredients.length === 0}>
                            Quitar Último
                        </button>
                        <button onClick={clearIngredients} disabled={selectedIngredients.length === 0}>
                            <RotateCcw size={16} />
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Available Ingredients */}
            <div className="ingredients-panel">
                <h3>Ingredientes Disponibles</h3>
                <div className="ingredients-grid">
                    {INGREDIENTS.map(ingredient => (
                        <button
                            key={ingredient.id}
                            className="ingredient-card"
                            onClick={() => addIngredient(ingredient)}
                            style={{ borderColor: ingredient.color }}
                            disabled={selectedIngredients.length >= DIFFICULTIES[difficulty].ingredients}
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

            {/* Brew Button */}
            <div className="brew-section">
                <button 
                    className="brew-button"
                    onClick={brewPotion}
                    disabled={selectedIngredients.length === 0}
                    style={{ background: selectedIngredients.length > 0 ? getDifficultyColor() : '#6b7280' }}
                >
                    <Droplet size={24} />
                    {currentValue === targetValue && currentValue > 0 ? '¡Crear Poción Perfecta!' : 'Verificar Poción'}
                </button>
                <button className="new-challenge-button" onClick={generateNewChallenge}>
                    <RotateCcw size={20} />
                    Nuevo Desafío
                </button>
            </div>
        </div>
    );
}

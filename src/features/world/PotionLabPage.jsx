import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Droplet, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import { PotionIngredientsPanel } from './components/PotionIngredientsPanel';
import { PotionBrewingStation } from './components/PotionBrewingStation';
import { INGREDIENTS, DIFFICULTIES } from './potionConfig';
import './PotionLabPage.css';

export function PotionLabPage() {
    const { addCoins, coins } = usePokemonContext();
    const [difficulty, setDifficulty] = useState('EASY');
    const [targetValue, setTargetValue] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [message, setMessage] = useState(null);
    const [completedPotions, setCompletedPotions] = useState(0);
    const [streak, setStreak] = useState(0);

    const generateNewChallenge = useCallback(() => {
        const c = DIFFICULTIES[difficulty];
        setTargetValue(Math.floor(Math.random() * (c.range[1] - c.range[0] + 1)) + c.range[0]);
        setSelectedIngredients([]); setMessage(null);
    }, [difficulty]);

    useEffect(() => { setCurrentValue(selectedIngredients.reduce((s, i) => s + i.value, 0)); }, [selectedIngredients]);
    useEffect(() => { generateNewChallenge(); }, [generateNewChallenge]);

    const showMsg = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 3000); };

    const brewPotion = () => {
        if (currentValue === targetValue) {
            const reward = DIFFICULTIES[difficulty].reward + (streak * 10);
            addCoins(reward); setCompletedPotions(p => p + 1); setStreak(s => s + 1);
            showMsg(`¡Perfecto! +${reward} 💰`, 'success'); setTimeout(generateNewChallenge, 2000);
        } else { setStreak(0); showMsg(`Error: tienes ${currentValue}, necesitas ${targetValue}`, 'error'); }
    };

    const diffColor = () => difficulty === 'EASY' ? '#10b981' : difficulty === 'MEDIUM' ? '#f59e0b' : '#ef4444';

    return (
        <div className="potion-lab-page">
            <header className="lab-header"><Link to="/world"><img src={bagIcon} alt="Back" /></Link><h1>🧪 Lab</h1><div className="coins-display">{coins} 💰</div></header>
            {message && <div className={`lab-message ${message.type}`}>{message.text}</div>}
            <div className="stats-bar"><div className="stat-item"><Trophy size={20} /><span>{completedPotions}</span></div><div className="stat-item"><Sparkles size={20} /><span>{streak}</span></div></div>
            <div className="difficulty-selector">
                {Object.entries(DIFFICULTIES).map(([k, v]) => <button key={k} className={difficulty === k ? 'active' : ''} onClick={() => setDifficulty(k)} style={{ background: difficulty === k ? `${diffColor()}33` : 'rgba(255,255,255,0.1)' }}>{v.name}</button>)}
            </div>
            <PotionBrewingStation targetValue={targetValue} currentValue={currentValue} selectedIngredients={selectedIngredients} difficultyColor={diffColor()} onRemoveLast={() => setSelectedIngredients(s => s.slice(0, -1))} onClear={() => setSelectedIngredients([])} />
            <PotionIngredientsPanel availableIngredients={INGREDIENTS} selectedCount={selectedIngredients.length} maxCount={DIFFICULTIES[difficulty].ingredients} onAdd={(i) => setSelectedIngredients(s => [...s, { ...i, id: Math.random() }])} />
            <div className="brew-section"><button className="brew-button" onClick={brewPotion} style={{ background: diffColor() }}>¡Crear!</button><button onClick={generateNewChallenge}><RotateCcw size={20} /></button></div>
        </div>
    );
}

import { useState, useEffect, useCallback } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { PotionIngredientsPanel } from '../components/PotionIngredientsPanel';
import { PotionBrewingStation } from '../components/PotionBrewingStation';
import { INGREDIENTS, DIFFICULTIES } from '../potionConfig';
import './PotionLabPage.css';

export function PotionLabPage() {
    const { addCoins } = usePokemonContext();
    const [difficulty, setDifficulty] = useState('EASY');
    const [targetValue, setTargetValue] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [currentValue, setCurrentValue] = useState(0);
    const [completedPotions, setCompletedPotions] = useState(0);
    const [streak, setStreak] = useState(0);
    const { showSuccess, showError } = useToast();

    const generateNewChallenge = useCallback(() => {
        const c = DIFFICULTIES[difficulty];
        setTargetValue(Math.floor(Math.random() * (c.range[1] - c.range[0] + 1)) + c.range[0]);
        setSelectedIngredients([]);
    }, [difficulty]);

    useEffect(() => { setCurrentValue(selectedIngredients.reduce((s, i) => s + i.value, 0)); }, [selectedIngredients]);
    useEffect(() => { generateNewChallenge(); }, [generateNewChallenge]);

    const brewPotion = () => {
        if (currentValue === targetValue) {
            const reward = DIFFICULTIES[difficulty].reward + (streak * 10);
            addCoins(reward); setCompletedPotions(p => p + 1); setStreak(s => s + 1);
            showSuccess(`¡Perfecto! +${reward} 💰`, 'success'); setTimeout(generateNewChallenge, 2000);
        } else { setStreak(0); showError(`Error: tienes ${currentValue}, necesitas ${targetValue}`, 'error'); }
    };

    const diffColor = () => difficulty === 'EASY' ? '#10b981' : difficulty === 'MEDIUM' ? '#f59e0b' : '#ef4444';

    return (
        <div className="potion-lab-page">
            <WorldPageHeader title="Lab" icon="🧪" />
            <div className="stats-bar"><div className="stat-item"><Trophy size={20} /><span>{completedPotions}</span></div><div className="stat-item"><Sparkles size={20} /><span>{streak}</span></div></div>
            <div className="difficulty-selector">
                {Object.entries(DIFFICULTIES).map(([k, v]) => <button key={k} className={difficulty === k ? 'active' : ''} onClick={() => setDifficulty(k)} style={{ background: difficulty === k ? `${diffColor()}33` : 'rgba(255,255,255,0.1)' }}>{v.name}</button>)}
            </div>
            <div className="lab-intro">
                <img src="/src/assets/kenney_tiny-town/Tiles/tile_0102.png" alt="Scientist" className="lab-npc" style={{ imageRendering: 'pixelated', width: '96px', height: '96px' }} />
                <div className="lab-dialog">
                    <p>¡Bienvenido al Laboratorio! Tu reto hoy es crear una poción con valor <strong>{targetValue}</strong>.</p>
                </div>
            </div>

            <PotionBrewingStation targetValue={targetValue} currentValue={currentValue} selectedIngredients={selectedIngredients} difficultyColor={diffColor()} onRemoveLast={() => setSelectedIngredients(s => s.slice(0, -1))} onClear={() => setSelectedIngredients([])} />
            <PotionIngredientsPanel availableIngredients={INGREDIENTS} selectedCount={selectedIngredients.length} maxCount={DIFFICULTIES[difficulty].ingredients} onAdd={(i) => setSelectedIngredients(s => [...s, { ...i, id: Math.random() }])} />

            <div className="brew-section">
                <button className="btn-adventure primary brew-button" onClick={brewPotion}>¡Crear Poción!</button>
                <button className="btn-adventure" onClick={generateNewChallenge}>
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
}

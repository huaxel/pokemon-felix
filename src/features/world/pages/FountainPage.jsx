import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { Star } from 'lucide-react';
import { FountainHeader } from '../components/FountainHeader';
import { FountainVisual } from '../components/FountainVisual';
import { FountainWishCard } from '../components/FountainWishCard';
import { FountainRecentRewards } from '../components/FountainRecentRewards';
import './FountainPage.css';

const WISHES = [
    {
        id: 'small',
        name: 'Deseo Pequeño',
        cost: 20,
        icon: '💫',
        description: 'Una pequeña esperanza',
        rewards: [
            { type: 'coins', amount: 10, chance: 0.3, message: '¡Encontraste 10 monedas!' },
            { type: 'coins', amount: 30, chance: 0.2, message: '¡Encontraste 30 monedas!' },
            { type: 'item', item: 'pokeball', chance: 0.25, message: '¡Recibiste una Pokéball!' },
            { type: 'nothing', chance: 0.25, message: 'El eco de tus esperanzas...' }
        ]
    },
    {
        id: 'medium',
        name: 'Deseo Normal',
        cost: 50,
        icon: '✨',
        description: 'Un deseo del corazón',
        rewards: [
            { type: 'coins', amount: 40, chance: 0.25, message: '¡La fuente te bendice con 40 monedas!' },
            { type: 'coins', amount: 80, chance: 0.15, message: '¡Increíble! ¡80 monedas!' },
            { type: 'item', item: 'greatball', chance: 0.2, message: '¡Una Gran Ball apareció!' },
            { type: 'item', item: 'potion', amount: 3, chance: 0.2, message: '¡3 Pociones aparecieron!' },
            { type: 'heal', chance: 0.1, message: '✨ Un aura curativa envuelve a tus Pokémon' },
            { type: 'nothing', chance: 0.1, message: 'Las aguas permanecen en silencio...' }
        ]
    },
    {
        id: 'big',
        name: 'Deseo Grande',
        cost: 100,
        icon: '🌟',
        description: '¡Un deseo poderoso!',
        rewards: [
            { type: 'coins', amount: 150, chance: 0.2, message: '¡JACKPOT! ¡150 monedas!' },
            { type: 'coins', amount: 80, chance: 0.25, message: 'La fuente te recompensa con 80 monedas' },
            { type: 'item', item: 'ultraball', chance: 0.15, message: '¡Una Ultra Ball mágica!' },
            { type: 'item', item: 'rare_candy', chance: 0.1, message: '¡Un Caramelo Raro legendario!' },
            { type: 'item', item: 'mystery_box', chance: 0.08, message: '¡Una Caja Misteriosa!' },
            { type: 'heal', chance: 0.15, message: '💎 Energía mágica restaura a todos tus Pokémon' },
            { type: 'lucky', chance: 0.05, message: '🍀 ¡DÍA DE SUERTE! ¡Doble recompensa!' },
            { type: 'nothing', chance: 0.02, message: 'La magia se resiste hoy...' }
        ]
    }
];

export function FountainPage() {
    const { coins, addCoins, spendCoins, addItem, healAll } = usePokemonContext();
    const [fountainAnimation, setFountainAnimation] = useState(false);
    const { showSuccess, showError, showCoins, showInfo } = useToast();

    const makeWish = async (wishType) => {
        const wish = WISHES.find(w => w.id === wishType);

        if (!spendCoins(wish.cost)) {
            showError('¡No tienes suficientes monedas!');
            return;
        }

        setIsWishing(true);
        setFountainAnimation(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const roll = Math.random();
        let cumulativeChance = 0;
        let selectedReward = null;

        for (const reward of wish.rewards) {
            cumulativeChance += reward.chance;
            if (roll <= cumulativeChance) {
                selectedReward = reward;
                break;
            }
        }

        let rewardType = 'info';
        if (selectedReward.type === 'coins') {
            addCoins(selectedReward.amount);
            showCoins(selectedReward.message);
        } else if (selectedReward.type === 'item') {
            const amount = selectedReward.amount || 1;
            for (let i = 0; i < amount; i++) addItem(selectedReward.item);
            showSuccess(selectedReward.message);
        } else if (selectedReward.type === 'heal') {
            healAll();
            showSuccess(selectedReward.message);
        } else if (selectedReward.type === 'lucky') {
            addCoins(wish.cost * 3);
            showCoins(selectedReward.message);
        } else if (selectedReward.type === 'nothing') {
            showInfo(selectedReward.message);
        }

        setTotalWishes(prev => prev + 1);
        setRecentRewards(prev => [
            { wish: wish.name, reward: selectedReward.message, type: rewardType },
            ...prev.slice(0, 4)
        ]);

        setIsWishing(false);
        setFountainAnimation(false);
    };

    const getMessageColor = (type) => {
        switch (type) {
            case 'success': return '#10b981';
            case 'jackpot': return '#f59e0b';
            case 'nothing': return '#6b7280';
            default: return '#3b82f6';
        }
    };

    return (
        <div className="fountain-page">
            <FountainHeader coins={coins} />


            <FountainVisual animation={fountainAnimation} />

            <div className="fountain-stats">
                <div className="stat-box">
                    <Star size={24} />
                    <span className="stat-value">{totalWishes}</span>
                    <span className="stat-label">Deseos</span>
                </div>
            </div>

            <div className="wishes-container">
                <div className="wishes-header">
                    <h2>Tipos de Deseos</h2>
                    <button className="probability-btn" onClick={() => setShowProbability(!showProbability)}>
                        {showProbability ? '🎲 Ocultar' : '🎲 Ver Chances'}
                    </button>
                </div>

                <div className="wishes-grid">
                    {WISHES.map(wish => (
                        <FountainWishCard
                            key={wish.id}
                            wish={wish}
                            showProbability={showProbability}
                            onWish={makeWish}
                            isWishing={isWishing}
                            canAfford={coins >= wish.cost}
                        />
                    ))}
                </div>
            </div>

            <FountainRecentRewards recentRewards={recentRewards} getMessageColor={getMessageColor} />

            <div className="fountain-info">
                <h3>💡 Sobre la Probabilidad</h3>
                <div className="info-grid">
                    <div className="info-card"><span>🎲</span><p>Cada deseo tiene diferentes probabilidades</p></div>
                    <div className="info-card"><span>📊</span><p>Deseos más caros tienen mejores premios</p></div>
                    <div className="info-card"><span>🍀</span><p>A veces la suerte te da recompensas extra</p></div>
                </div>
            </div>
        </div>
    );
}

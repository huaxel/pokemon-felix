import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Sparkles, Coins, Star, Gift, Zap } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
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
    const [message, setMessage] = useState(null);
    const [isWishing, setIsWishing] = useState(false);
    const [totalWishes, setTotalWishes] = useState(0);
    const [recentRewards, setRecentRewards] = useState([]);
    const [showProbability, setShowProbability] = useState(false);
    const [fountainAnimation, setFountainAnimation] = useState(false);

    const showMessage = (text, type = 'info', duration = 3000) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), duration);
    };

    const makeWish = async (wishType) => {
        const wish = WISHES.find(w => w.id === wishType);
        
        if (!spendCoins(wish.cost)) {
            showMessage('¡No tienes suficientes monedas!', 'error');
            return;
        }

        setIsWishing(true);
        setFountainAnimation(true);

        // Animate the wish
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Select reward based on probability
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

        // Apply reward
        let finalMessage = selectedReward.message;
        let rewardType = 'info';

        if (selectedReward.type === 'coins') {
            addCoins(selectedReward.amount);
            rewardType = 'success';
        } else if (selectedReward.type === 'item') {
            const amount = selectedReward.amount || 1;
            for (let i = 0; i < amount; i++) {
                addItem(selectedReward.item);
            }
            rewardType = 'success';
        } else if (selectedReward.type === 'heal') {
            healAll();
            rewardType = 'success';
        } else if (selectedReward.type === 'lucky') {
            // Lucky day - give double coins
            addCoins(wish.cost * 3);
            rewardType = 'jackpot';
        } else if (selectedReward.type === 'nothing') {
            rewardType = 'nothing';
        }

        setTotalWishes(prev => prev + 1);
        setRecentRewards(prev => [
            { wish: wish.name, reward: selectedReward.message, type: rewardType },
            ...prev.slice(0, 4)
        ]);

        showMessage(finalMessage, rewardType, 4000);
        setIsWishing(false);
        setFountainAnimation(false);
    };

    const getMessageColor = (type) => {
        switch(type) {
            case 'success': return '#10b981';
            case 'jackpot': return '#f59e0b';
            case 'nothing': return '#6b7280';
            default: return '#3b82f6';
        }
    };

    return (
        <div className="fountain-page">
            <header className="fountain-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Back" />
                </Link>
                <h1>
                    <Sparkles size={32} />
                    Plaza de la Fuente
                </h1>
                <div className="coins-display">
                    <Coins size={20} />
                    <span>{coins}</span>
                </div>
            </header>

            {message && (
                <div 
                    className={`fountain-message ${message.type}`}
                    style={{ borderColor: getMessageColor(message.type) }}
                >
                    {message.text}
                </div>
            )}

            {/* Fountain Visual */}
            <div className={`fountain-visual ${fountainAnimation ? 'wishing' : ''}`}>
                <div className="fountain-base">
                    <div className="water-surface"></div>
                    <div className="fountain-sparkle sparkle-1">✨</div>
                    <div className="fountain-sparkle sparkle-2">💫</div>
                    <div className="fountain-sparkle sparkle-3">⭐</div>
                </div>
                <p className="fountain-legend">
                    Arroja una moneda y pide un deseo...
                </p>
            </div>

            {/* Stats */}
            <div className="fountain-stats">
                <div className="stat-box">
                    <Star size={24} />
                    <span className="stat-value">{totalWishes}</span>
                    <span className="stat-label">Deseos</span>
                </div>
            </div>

            {/* Wish Options */}
            <div className="wishes-container">
                <div className="wishes-header">
                    <h2>Tipos de Deseos</h2>
                    <button 
                        className="probability-btn"
                        onClick={() => setShowProbability(!showProbability)}
                    >
                        {showProbability ? '🎲 Ocultar' : '🎲 Ver Chances'}
                    </button>
                </div>

                <div className="wishes-grid">
                    {WISHES.map(wish => (
                        <div key={wish.id} className={`wish-card ${wish.id}`}>
                            <div className="wish-icon">{wish.icon}</div>
                            <h3>{wish.name}</h3>
                            <p className="wish-description">{wish.description}</p>
                            
                            {showProbability && (
                                <div className="probability-list">
                                    <strong>Posibles recompensas:</strong>
                                    {wish.rewards.map((reward, idx) => (
                                        <div key={idx} className="probability-item">
                                            <span>{(reward.chance * 100).toFixed(0)}%</span>
                                            <span className="reward-desc">
                                                {reward.type === 'coins' && `${reward.amount} monedas`}
                                                {reward.type === 'item' && reward.item}
                                                {reward.type === 'heal' && 'Curación total'}
                                                {reward.type === 'lucky' && '¡Día de suerte!'}
                                                {reward.type === 'nothing' && 'Nada'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                className="wish-button"
                                onClick={() => makeWish(wish.id)}
                                disabled={isWishing || coins < wish.cost}
                            >
                                {isWishing ? (
                                    <>
                                        <Zap size={20} className="spinning" />
                                        Deseando...
                                    </>
                                ) : (
                                    <>
                                        <Coins size={20} />
                                        {wish.cost} monedas
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Rewards */}
            {recentRewards.length > 0 && (
                <div className="recent-rewards">
                    <h3>
                        <Gift size={20} />
                        Recompensas Recientes
                    </h3>
                    <div className="rewards-list">
                        {recentRewards.map((reward, idx) => (
                            <div 
                                key={idx} 
                                className="reward-item"
                                style={{ borderLeftColor: getMessageColor(reward.type) }}
                            >
                                <span className="reward-wish">{reward.wish}</span>
                                <span className="reward-result">{reward.reward}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Educational Info */}
            <div className="fountain-info">
                <h3>💡 Sobre la Probabilidad</h3>
                <div className="info-grid">
                    <div className="info-card">
                        <span className="info-icon">🎲</span>
                        <p>Cada deseo tiene diferentes probabilidades de recompensa</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">📊</span>
                        <p>Deseos más caros tienen mejores chances de grandes premios</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">🍀</span>
                        <p>A veces la suerte te sonríe con recompensas extra</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">⚖️</span>
                        <p>No siempre ganas, pero la esperanza es parte de la diversión</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useEconomy, useCare } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { Star } from 'lucide-react';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { FountainVisual } from '../components/FountainVisual';
import { FountainWishCard } from '../components/FountainWishCard';
import { FountainRecentRewards } from '../components/FountainRecentRewards';
import { grassTile } from '../worldAssets';
import './FountainPage.css';

const WISHES = [
  {
    id: 'small',
    name: 'Kleine Wens',
    cost: 20,
    icon: '💫',
    description: 'Een kleine hoop',
    rewards: [
      { type: 'coins', amount: 10, chance: 0.3, message: 'Je hebt 10 munten gevonden!' },
      { type: 'coins', amount: 30, chance: 0.2, message: 'Je hebt 30 munten gevonden!' },
      { type: 'item', item: 'pokeball', chance: 0.25, message: 'Je hebt een Pokéball ontvangen!' },
      { type: 'nothing', chance: 0.25, message: 'De echo van je hoop...' },
    ],
  },
  {
    id: 'medium',
    name: 'Normale Wens',
    cost: 50,
    icon: '✨',
    description: 'Een wens uit het hart',
    rewards: [
      { type: 'coins', amount: 40, chance: 0.25, message: 'De fontein zegent je met 40 munten!' },
      { type: 'coins', amount: 80, chance: 0.15, message: 'Ongelooflijk! 80 munten!' },
      { type: 'item', item: 'greatball', chance: 0.2, message: 'Er verscheen een Great Ball!' },
      { type: 'item', item: 'potion', amount: 3, chance: 0.2, message: 'Er verschenen 3 Potions!' },
      { type: 'heal', chance: 0.1, message: '✨ Een helend aura omringt je Pokémon' },
      { type: 'nothing', chance: 0.1, message: 'Het water blijft stil...' },
    ],
  },
  {
    id: 'big',
    name: 'Grote Wens',
    cost: 100,
    icon: '🌟',
    description: 'Een krachtige wens!',
    rewards: [
      { type: 'coins', amount: 150, chance: 0.2, message: 'JACKPOT! 150 munten!' },
      { type: 'coins', amount: 80, chance: 0.25, message: 'De fontein beloont je met 80 munten' },
      { type: 'item', item: 'ultraball', chance: 0.15, message: 'Een magische Ultra Ball!' },
      { type: 'item', item: 'rare_candy', chance: 0.1, message: 'Een legendarische Rare Candy!' },
      { type: 'item', item: 'mystery_box', chance: 0.08, message: 'Een Mysterieuze Doos!' },
      { type: 'heal', chance: 0.15, message: '💎 Magische energie herstelt al je Pokémon' },
      { type: 'lucky', chance: 0.05, message: '🍀 GELUKSDAG! Dubbele beloning!' },
      { type: 'nothing', chance: 0.02, message: 'De magie verzet zich vandaag...' },
    ],
  },
];

export function FountainPage() {
  const { coins, addCoins, spendCoins, addItem } = useEconomy();
  const { healAll } = useCare();
  const [fountainAnimation, setFountainAnimation] = useState(false);
  const [isWishing, setIsWishing] = useState(false);
  const [totalWishes, setTotalWishes] = useState(0);
  const [recentRewards, setRecentRewards] = useState([]);
  const [showProbability, setShowProbability] = useState(false);
  const { showSuccess, showError, showCoins, showInfo } = useToast();

  const makeWish = async wishType => {
    const wish = WISHES.find(w => w.id === wishType);

    if (!spendCoins(wish.cost)) {
      showError('Niet genoeg munten!');
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

    const rewardType = 'info';
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
      ...prev.slice(0, 4),
    ]);

    setIsWishing(false);
    setFountainAnimation(false);
  };

  const getMessageColor = type => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'jackpot':
        return '#f59e0b';
      case 'nothing':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div
      className="fountain-page"
      style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
    >
      <WorldPageHeader title="Fonteinplein" icon="✨" />

      <FountainVisual animation={fountainAnimation} />

      <div className="fountain-stats">
        <div className="stat-box">
          <Star size={24} />
          <span className="stat-value">{totalWishes}</span>
          <span className="stat-label">Wensen</span>
        </div>
      </div>

      <div className="wishes-container">
        <div className="wishes-header">
          <h2>Soorten Wensen</h2>
          <button
            className="probability-btn btn-kenney"
            onClick={() => setShowProbability(!showProbability)}
          >
            {showProbability ? '🎲 Verbergen' : '🎲 Kansen Bekijken'}
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
        <h3>💡 Over de Kans</h3>
        <div className="info-grid">
          <div className="info-card">
            <span>🎲</span>
            <p>Elke wens heeft verschillende kansen</p>
          </div>
          <div className="info-card">
            <span>📊</span>
            <p>Duurdere wensen hebben betere prijzen</p>
          </div>
          <div className="info-card">
            <span>🍀</span>
            <p>Soms geeft geluk je extra beloningen</p>
          </div>
        </div>
      </div>
    </div>
  );
}

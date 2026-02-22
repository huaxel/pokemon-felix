import { useState } from 'react';
import { X, Heart, Utensils } from 'lucide-react';
import { useEconomy } from '../../../contexts/DomainContexts';
import { useCareContext } from '../../../hooks/useCareContext';
import bagIcon from '../../../assets/items/bag_icon.png';
import './MemberDetailModal.css';

const DEFAULT_CARE_STATS = { hp: 100, hunger: 0, happiness: 70 };
const DEFAULT_XP_STATS = { level: 5, xp: 0, toNextLevel: 500 };
const BERRY_TYPES = [
  { key: 'berry', label: 'Oran', icon: '🫐', className: 'oran' },
  { key: 'sitrus-berry', label: 'Zidra', icon: '🍋', className: 'sitrus' },
  { key: 'razz-berry', label: 'Frambu', icon: '🍓', className: 'razz' },
];

function MemberHeader({ pokemon, level }) {
  return (
    <div className="member-header">
      <h2>
        {pokemon.name} <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>Lvl. {level}</span>
      </h2>
      <span className="id-badge">#{String(pokemon.id).padStart(3, '0')}</span>
    </div>
  );
}

function MemberImage({ pokemon }) {
  return (
    <div className="member-image">
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="bounce-in"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

function StatRow({ label, width, valueText, barClass, barStyle }) {
  return (
    <div className="stat-row">
      <label>{label}</label>
      <div className="stat-bar-pixel">
        <div
          className={`stat - bar - pixel - fill ${barClass} `}
          style={{ width: `${width}% `, ...barStyle }}
        ></div>
        <span className="stat-value">{valueText}</span>
      </div>
    </div>
  );
}

function ActionButtons({ onHeal, onFeed }) {
  return (
    <div className="action-buttons">
      <button className="btn-kenney danger" onClick={onHeal} style={{ width: '100%' }}>
        <Heart size={20} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>Genezen</span>
          <span className="cost">
            50 <img src={bagIcon} alt="coins" style={{ width: '12px', verticalAlign: 'middle' }} />
          </span>
        </div>
      </button>
      <button className="btn-kenney warning" onClick={onFeed} style={{ width: '100%' }}>
        <Utensils size={20} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>Voeren</span>
          <span className="cost">
            20 <img src={bagIcon} alt="coins" style={{ width: '12px', verticalAlign: 'middle' }} />
          </span>
        </div>
      </button>
    </div>
  );
}

function BerrySection({ inventory, onUseBerry }) {
  const hasAny = BERRY_TYPES.some(type => (inventory?.[type.key] || 0) > 0);

  return (
    <div
      className="berry-section"
      style={{ marginTop: '1rem', borderTop: '4px solid #4a3b32', paddingTop: '1rem' }}
    >
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#fbbf24' }}>Bessen</h4>
      <div className="action-buttons" style={{ marginTop: '0.5rem' }}>
        {BERRY_TYPES.map(type => {
          const count = inventory?.[type.key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={type.key}
              className={`btn - kenney neutral`}
              onClick={() => onUseBerry(type.key)}
              style={{ width: '100%' }}
            >
              <span style={{ fontSize: '1.2rem' }}>{type.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{type.label}</span>
                <span className="cost">x{count}</span>
              </div>
            </button>
          );
        })}
        {!hasAny && (
          <div
            style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.7rem',
            }}
          >
            Geen bessen
          </div>
        )}
      </div>
    </div>
  );
}

export function MemberDetailModal({ pokemon, onClose }) {
  const { coins, spendCoins, inventory, removeItem } = useEconomy();
  const { careStats, updateCareStats } = useCareContext();
  const stats = careStats?.[pokemon.id] || DEFAULT_CARE_STATS;
  const xpStats = pokemon.xpStats || DEFAULT_XP_STATS; // Fallback
  const [message, setMessage] = useState(null);

  // ... (logic remains mostly same, just text updates if any inside functions)

  const handleHeal = () => {
    if (stats.hp >= 100) {
      setMessage('HP is al vol!');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    if (coins < 50) {
      setMessage('Niet genoeg munten!');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    spendCoins(50);
    updateCareStats(pokemon.id, { hp: Math.min(100, stats.hp + 50) });
    setMessage('Genezen!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleFeed = () => {
    if (stats.hunger >= 100) {
      setMessage('Geen honger!');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    if (coins < 20) {
      setMessage('Niet genoeg munten!');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    spendCoins(20);
    updateCareStats(pokemon.id, {
      hunger: Math.min(100, stats.hunger + 30),
      happiness: Math.min(100, stats.happiness + 5),
    });
    setMessage('Gevoerd!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleUseBerry = berryKey => {
    // ... implementation
    removeItem(berryKey, 1);
    updateCareStats(pokemon.id, {
      hp: Math.min(100, stats.hp + 20),
      happiness: Math.min(100, stats.happiness + 10),
    });
    setMessage('Bes gebruikt!');
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="member-modal-overlay" onClick={onClose}>
      <div className="member-modal-content game-panel-dark" onClick={e => e.stopPropagation()}>
        <button className="close-btn btn-kenney danger" onClick={onClose}>
          <X size={20} />
        </button>

        <MemberHeader pokemon={pokemon} level={xpStats.level} />

        <div className="member-body">
          <MemberImage pokemon={pokemon} />

          {message && (
            <div
              className="message-toast"
              style={{
                background: '#fbbf24',
                color: '#000',
                padding: '0.5rem',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.7rem',
                border: '2px solid #b45309',
              }}
            >
              {message}
            </div>
          )}

          <div className="member-stats-panel">
            <StatRow
              label="HP"
              width={stats.hp}
              valueText={`${stats.hp}/100`}
              barClass={stats.hp < 30 ? 'critical' : stats.hp < 60 ? 'warning' : 'success'}
            />
            <StatRow
              label="Honger"
              width={stats.hunger}
              valueText={`${stats.hunger}%`}
              barClass="warning"
              barStyle={{ backgroundColor: '#f97316' }}
            />
            <StatRow
              label="Blijheid"
              width={stats.happiness}
              valueText={`${stats.happiness}%`}
              barClass="success"
              barStyle={{ backgroundColor: '#ec4899' }}
            />
            <StatRow
              label="XP"
              width={(xpStats.xp / xpStats.toNextLevel) * 100}
              valueText={`${xpStats.xp}/${xpStats.toNextLevel}`}
              barClass="info"
              barStyle={{ backgroundColor: '#3b82f6' }}
            />
          </div >

          <ActionButtons onHeal={handleHeal} onFeed={handleFeed} />

          <BerrySection inventory={inventory} onUseBerry={handleUseBerry} />
        </div >
      </div >
    </div >
  );
}

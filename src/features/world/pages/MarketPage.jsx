import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDomainCollection, useData, useEconomy } from '../../../contexts/DomainContexts';
import { useGlobalActions } from '../../../hooks/useGlobalActions';
import { useToast } from '../../../hooks/useToast';
import { useOutfitEffects } from '../../../hooks/useOutfitEffects';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { TILE_TYPES } from '../worldConstants';
import {
  grassTile,
  marketImage,
  bagIcon,
} from '../worldAssets';
import { SHOP_ITEMS, ECONOMICS_TIPS } from '../marketConfig';
import './MarketPage.css';

const MARKET_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.GRASS;
    if (y === 3 && xIndex === 4) return TILE_TYPES.MARKET;
    if (y === 4 && xIndex === 4) return TILE_TYPES.MARKET;
    if (xIndex === 4) return TILE_TYPES.PATH;
    if (y === 5 && (xIndex === 2 || xIndex === 6)) return TILE_TYPES.TREE;
    return TILE_TYPES.GRASS;
  }),
);

const calculatePokemonValue = pokemon => {
  if (!pokemon || !pokemon.stats || !Array.isArray(pokemon.stats)) {
    return 50;
  }

  const bst = pokemon.stats.reduce((sum, s) => sum + (s.base_stat || 0), 0);
  const baseValue = Math.floor(bst / 10);
  const rarityBonus = pokemon.id > 130 ? 100 : 0;
  const evolutionBonus = pokemon.id > 100 ? 20 : 0;
  return Math.max(50, baseValue + rarityBonus + evolutionBonus);
};

function CategoryTabs({ category, setCategory }) {
  return (
    <div className="category-tabs">
      <button
        className={`category-btn btn-kenney ${category === 'pokeballs' ? 'primary' : 'neutral'}`}
        onClick={() => setCategory('pokeballs')}
      >
        ⚾ Poké Balls
      </button>
      <button
        className={`category-btn btn-kenney ${category === 'potions' ? 'primary' : 'neutral'}`}
        onClick={() => setCategory('potions')}
      >
        🧪 Drankjes
      </button>
      <button
        className={`category-btn btn-kenney ${category === 'berries' ? 'primary' : 'neutral'}`}
        onClick={() => setCategory('berries')}
      >
        🍒 Bessen
      </button>
      <button
        className={`category-btn btn-kenney ${category === 'special' ? 'primary' : 'neutral'}`}
        onClick={() => setCategory('special')}
      >
        ✨ Speciaal
      </button>
    </div>
  );
}

function ShopSection({ category, setCategory, items, onBuy, discount, getPrice }) {
  return (
    <div className="shop-section">
      <CategoryTabs category={category} setCategory={setCategory} />
      <div className="items-grid">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-icon-circle">
              <img
                src={item.image}
                alt={item.name}
                className="shop-item-img"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <h3>{item.name}</h3>
            <p className="item-desc">{item.description}</p>
            <button className="buy-btn btn-kenney primary" onClick={() => onBuy(item)}>
              Kopen{' '}
              <img
                src={bagIcon}
                alt="coins"
                className="coin-icon-inline"
                style={{ imageRendering: 'pixelated' }}
              />
              {discount > 0 ? (
                <span>
                  <s style={{ opacity: 0.6 }}>{item.price}</s> <b>{getPrice(item.price)}</b>
                </span>
              ) : (
                item.price
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SellSection({ sellablePokemon, onSell }) {
  return (
    <>
      <div className="market-intro">
        <img src={marketImage} className="market-promo-img" alt="Market" />
        <p>
          Verkoop je extra Pokémon! De prijs hangt af van hun kracht. Pokémon in je team kunnen niet
          worden verkocht.
        </p>
      </div>

      <div className="pokemon-grid">
        {sellablePokemon.length === 0 ? (
          <p className="empty-msg">Je hebt geen extra Pokémon om te verkopen...</p>
        ) : (
          sellablePokemon.map(pokemon => {
            const value = calculatePokemonValue(pokemon);
            const bst =
              pokemon.stats && Array.isArray(pokemon.stats)
                ? pokemon.stats.reduce((sum, s) => sum + (s.base_stat || 0), 0)
                : 0;
            return (
              <div key={pokemon.id} className="market-card">
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <h3>{pokemon.name}</h3>
                <div className="pokemon-value-info">
                  <span className="stat-label">Kracht: {bst}</span>
                  {pokemon.id > 130 && <span className="legendary-badge">⭐ Legendarisch</span>}
                </div>
                <button className="sell-btn" onClick={() => onSell(pokemon)}>
                  Verkopen voor <img src={bagIcon} alt="coins" className="coin-icon-inline" />{' '}
                  {value}
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export function MarketPage() {
  const { showSuccess, showError } = useToast();
  const { ownedIds, squadIds } = useDomainCollection();
  const { pokemonList } = useData();
  const { sellPokemon } = useGlobalActions();
  const { coins, spendCoins, addItem, addCoins } = useEconomy();
  const [tab, setTab] = useState('buy');
  const [category, setCategory] = useState('pokeballs');
  const [showTip, setShowTip] = useState(true);

  const { getDiscount, activeEffect } = useOutfitEffects();
  const discount = getDiscount();

  const getPrice = basePrice => Math.floor(basePrice * (1 - discount));

  const handleBuyItem = item => {
    const finalPrice = getPrice(item.price);
    if (coins >= finalPrice) {
      if (spendCoins(finalPrice)) {
        addItem(item.id, 1);
        showSuccess(`✅ Je hebt 1 ${item.name} gekocht!`);
      }
    } else {
      showError('❌ Je hebt niet genoeg munten.');
    }
  };

  const sellablePokemon = pokemonList.filter(
    p => ownedIds.includes(p.id) && !squadIds.includes(p.id)
  );

  const handleSell = async pokemon => {
    const value = calculatePokemonValue(pokemon);
    const success = await sellPokemon(pokemon.id);
    if (success) {
      addCoins(value - 50); // sellPokemon already adds 50, so add the difference
      showSuccess(`✅ Je hebt ${pokemon.name} verkocht voor ${value} munten!`);
    }
  };

  return (
    <div
      className="market-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
        minHeight: '100vh',
      }}
    >
      <WorldPageHeader title="Pokémon Markt" icon="🏪" />

      <div className="market-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={MARKET_GRID}
            onObjectClick={undefined}
            isNight={false}
            enableSky={false}
          />
        </Canvas>
      </div>

      {activeEffect.discount > 0 && (
        <div className="market-discount-banner">
          ✨ Korting van {activeEffect.discount * 100}% actief dankzij je outfit!
        </div>
      )}

      {showTip && (
        <div className="market-tip">
          {ECONOMICS_TIPS[Math.floor(Math.random() * ECONOMICS_TIPS.length)]}
          <button className="tip-close" onClick={() => setShowTip(false)}>
            ✕
          </button>
        </div>
      )}

      <div className="market-tabs">
        <button
          className={`tab-btn ${tab === 'buy' ? 'active' : ''}`}
          onClick={() => setTab('buy')}
        >
          🛒 Kopen
        </button>
        <button
          className={`tab-btn ${tab === 'sell' ? 'active' : ''}`}
          onClick={() => setTab('sell')}
        >
          💰 Verkopen
        </button>
      </div>

      {tab === 'buy' ? (
        <ShopSection
          category={category}
          setCategory={setCategory}
          items={SHOP_ITEMS[category]}
          onBuy={handleBuyItem}
          discount={discount}
          getPrice={getPrice}
        />
      ) : (
        <SellSection sellablePokemon={sellablePokemon} onSell={handleSell} />
      )}
    </div>
  );
}

import { useState } from 'react';
import { useEconomy, useDomainCollection, useData } from '../../contexts/DomainContexts';
import gachaImage from '../../assets/buildings/gacha_machine.png';
import pokeballImage from '../../assets/items/pokeball.png';
import greatballImage from '../../assets/items/greatball.png';
import ultraballImage from '../../assets/items/ultraball.png';
import candyImage from '../../assets/items/rare_candy.png';
import mysteryImage from '../../assets/items/mystery_box.png';
import { GachaHeader } from './components/GachaHeader';
import { GachaSelector } from './components/GachaSelector';
import { GachaResult } from './components/GachaResult';
import './GachaPage.css';

const GACHA_TIERS = {
  pokeball: {
    id: 'pokeball',
    name: 'Poké Ball',
    cost: 100,
    image: pokeballImage,
    rates: { common: 0.6, rare: 0.3, epic: 0.09, legendary: 0.01 },
    color: '#ef4444',
    type: 'catch',
  },
  greatball: {
    id: 'greatball',
    name: 'Super Ball',
    cost: 300,
    image: greatballImage,
    rates: { common: 0.3, rare: 0.5, epic: 0.18, legendary: 0.02 },
    color: '#3b82f6',
    type: 'catch',
  },
  ultraball: {
    id: 'ultraball',
    name: 'Ultra Ball',
    cost: 1000,
    image: ultraballImage,
    rates: { common: 0, rare: 0.4, epic: 0.5, legendary: 0.1 },
    color: '#eab308',
    type: 'catch',
  },
  mystery: {
    id: 'mystery',
    name: 'Mysterieuze Doos',
    cost: 500,
    image: mysteryImage,
    color: '#8b5cf6',
    type: 'mystery',
  },
  candy: {
    id: 'candy',
    name: 'Zeldzaam Snoepje',
    cost: 200,
    image: candyImage,
    color: '#f472b6',
    type: 'mystery',
  },
};

export function GachaPage() {
  const { coins, spendCoins, addItem } = useEconomy();
  const { setOwnedIds, addToSquad, squadIds } = useDomainCollection();
  const { pokemonList } = useData();
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [autoEquipped, setAutoEquipped] = useState(false);
  const [selectedBall, setSelectedBall] = useState('pokeball');
  const [category, setCategory] = useState('catch');

  const currentTier = GACHA_TIERS[selectedBall];

  const determineRarity = () => {
    const rand = Math.random();
    const rates = currentTier.rates;
    let cumulative = 0;
    cumulative += rates.legendary;
    if (rand < cumulative) return 'legendary';
    cumulative += rates.epic;
    if (rand < cumulative) return 'epic';
    cumulative += rates.rare;
    if (rand < cumulative) return 'rare';
    return 'common';
  };

  const getBST = pokemon => {
    if (!pokemon || !pokemon.stats || !Array.isArray(pokemon.stats)) {
      return 0;
    }
    return pokemon.stats.reduce((total, stat) => total + (stat.base_stat || 0), 0);
  };

  const getRandomPokemon = async rarity => {
    const candidates = pokemonList.filter(p => {
      const bst = getBST(p);
      if (rarity === 'legendary') return bst >= 580;
      if (rarity === 'epic') return bst >= 500 && bst < 580;
      if (rarity === 'rare') return bst >= 400 && bst < 500;
      return bst < 400;
    });
    if (candidates.length === 0) return pokemonList[Math.floor(Math.random() * pokemonList.length)];
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const summon = async () => {
    if (coins < currentTier.cost) {
      setError(`Je hebt ${currentTier.cost} PokeCoins nodig!`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (spendCoins(currentTier.cost)) {
      setIsAnimating(true);
      setResult(null);
      setAutoEquipped(false);
      const isShiny = Math.random() < 0.01;

      if (currentTier.id === 'candy') {
        setTimeout(() => {
          addItem('rare-candy', 1);
          setResult({
            name: 'Zeldzaam Snoepje',
            type: 'item',
            id: 'rare-candy',
            description: 'Toegevoegd aan je rugzak!',
            image: candyImage,
          });
          setIsAnimating(false);
        }, 1500);
        return;
      }

      if (currentTier.id === 'mystery') {
        setTimeout(() => {
          addItem('mystery-box', 1);
          setResult({
            name: 'Mysterieuze Doos',
            type: 'item',
            id: 'mystery-box',
            description: 'Wat zou erin zitten?',
            image: mysteryImage,
          });
          setIsAnimating(false);
        }, 1500);
        return;
      }

      setTimeout(async () => {
        const rarity = determineRarity();
        const pokemon = await getRandomPokemon(rarity);

        if (pokemon) {
          setOwnedIds(prev => [...prev, pokemon.id]);
          if (squadIds.length < 4) {
            addToSquad(pokemon.id);
            setAutoEquipped(true);
          }
          setResult({ ...pokemon, rarity, isShiny });
        } else {
          setError('Er is een fout opgetreden bij het ophalen van de Pokémon.');
        }
        setIsAnimating(false);
      }, 2000);
    }
  };

  return (
    <div
      className="gacha-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: 'url(../../assets/kenney_tiny-town/Tiles/tile_0000.png)',
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <GachaHeader coins={coins} />

      <div className="gacha-nav">
        <button
          className={`nav-item btn-kenney ${category === 'catch' ? 'primary' : 'neutral'}`}
          onClick={() => {
            setCategory('catch');
            setSelectedBall('pokeball');
          }}
        >
          Vangen
        </button>
        <button
          className={`nav-item btn-kenney ${category === 'mystery' ? 'primary' : 'neutral'}`}
          onClick={() => {
            setCategory('mystery');
            setSelectedBall('mystery');
          }}
        >
          Items
        </button>
      </div>

      <div className="gacha-stage">
        {error && (
          <div className="error-message game-panel-dark" style={{ borderColor: '#ef4444' }}>
            {error}
          </div>
        )}

        {!result && !isAnimating && (
          <>
            <div
              className="gacha-intro game-panel-dark"
              style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}
            >
              <img
                src={gachaImage}
                className="gacha-promo-img"
                alt="Gacha"
                style={{ imageRendering: 'pixelated' }}
              />
              <h2
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '1rem',
                  marginTop: '1rem',
                }}
              >
                Welkom bij de Poké-Gacha!
              </h2>
              <p
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '0.7rem',
                  color: '#fbbf24',
                  lineHeight: '1.5',
                }}
              >
                Kies een categorie en beproef je geluk!
              </p>
            </div>

            <GachaSelector
              category={category}
              selectedBall={selectedBall}
              setSelectedBall={setSelectedBall}
              tiers={GACHA_TIERS}
              onSummon={summon}
              currentTier={currentTier}
            />
          </>
        )}

        {isAnimating && (
          <div className="animation-container">
            <img
              src={currentTier.image}
              alt="Summoning..."
              className="summon-pokeball shaking"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="light-burst"></div>
          </div>
        )}

        <GachaResult result={result} autoEquipped={autoEquipped} onReset={() => setResult(null)} />
      </div>
    </div>
  );
}

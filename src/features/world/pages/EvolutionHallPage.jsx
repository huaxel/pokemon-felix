import { useState } from 'react';
import { useData, useDomainCollection, useEconomy } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { Download, Upload } from 'lucide-react';
import { WorldPageHeader } from '../components/WorldPageHeader';
import {
  grassTile,
  fireStone,
  waterStone,
  thunderStone,
  leafStone,
  moonStone,
} from '../worldAssets';

import './EvolutionHallPage.css';

const EVOLUTION_CHAINS = [
  { id: 1, name: 'Bulbasaur', evo: 'Ivysaur', level: 16, type: 'Grass', method: 'level' },
  { id: 4, name: 'Charmander', evo: 'Charmeleon', level: 16, type: 'Fire', method: 'level' },
  { id: 7, name: 'Squirtle', evo: 'Wartortle', level: 16, type: 'Water', method: 'level' },
  {
    id: 25,
    name: 'Pikachu',
    evo: 'Raichu',
    item: 'thunder_stone',
    type: 'Electric',
    method: 'stone',
  },
  {
    id: 39,
    name: 'Jigglypuff',
    evo: 'Wigglytuff',
    item: 'moon_stone',
    type: 'Normal',
    method: 'stone',
  },
  { id: 133, name: 'Eevee', evo: 'Vaporeon', item: 'water_stone', type: 'Normal', method: 'stone' },
  {
    id: 133,
    name: 'Eevee',
    evo: 'Jolteon',
    item: 'thunder_stone',
    type: 'Normal',
    method: 'stone',
  },
  { id: 133, name: 'Eevee', evo: 'Flareon', item: 'fire_stone', type: 'Normal', method: 'stone' },
];

const STONES = [
  { id: 'fire_stone', name: 'Vuursteen', price: 2000, img: fireStone, color: '#ef4444' },
  { id: 'water_stone', name: 'Watersteen', price: 2000, img: waterStone, color: '#3b82f6' },
  { id: 'thunder_stone', name: 'Dondersteen', price: 2000, img: thunderStone, color: '#eab308' },
  { id: 'leaf_stone', name: 'Bladsteen', price: 2000, img: leafStone, color: '#22c55e' },
  { id: 'moon_stone', name: 'Maansteen', price: 3000, img: moonStone, color: '#a855f7' },
];

export function EvolutionHallPage() {
  const { pokemonList } = useData();
  const { ownedIds } = useDomainCollection();
  const { addCoins, coins, addItem, inventory, removeItem } = useEconomy();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [, setEvolving] = useState(false);
  const { showSuccess, showError } = useToast();

  const [view, setView] = useState('evolve'); // evolve, shop

  const getEvolutionInfo = pokemonId => EVOLUTION_CHAINS.filter(e => e.id === pokemonId);

  const handleBuyStone = stone => {
    if (coins >= stone.price) {
      addItem(stone.id, 1);
      addCoins(-stone.price);
      showSuccess(`${stone.name} gekocht!`);
    } else {
      showError('Niet genoeg munten.');
    }
  };

  const handleEvolve = async (pokemon, evoOption) => {
    if (evoOption.method === 'stone') {
      const requiredItem = evoOption.item;
      const hasItem = inventory && inventory[requiredItem] > 0;

      if (!hasItem) {
        const stoneName = STONES.find(s => s.id === requiredItem)?.name || 'Evolutiesteen';
        showError(`Je hebt een ${stoneName} nodig!`);
        return;
      }

      // Consume item
      removeItem(requiredItem, 1);
    }

    setEvolving(true);
    await new Promise(r => setTimeout(r, 2000));
    // addCoins(100);
    // addItem('rare_candy');
    showSuccess(`${pokemon.name} is geëvolueerd naar ${evoOption.evo}! 🎉`);
    setEvolving(false);
    setSelectedPokemon(null);
  };

  const readyToEvolve = pokemonList.filter(
    p => ownedIds.includes(p.id) && EVOLUTION_CHAINS.some(e => e.id === p.id)
  );

  return (
    <div
      className="evolution-hall-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
        minHeight: '100vh',
      }}
    >
      <WorldPageHeader title="Evolutiehal" icon="✨" />

      <div
        className="evolution-chamber game-panel"
        style={{
          margin: '1rem auto',
          maxWidth: '800px',
          textAlign: 'center',
          padding: '2rem',
          border: '4px solid #fbbf24',
        }}
      >
        <div className="chamber-glow" />
        <div
          className="chamber-text"
          style={{ fontFamily: '"Press Start 2P", cursive', color: '#fbbf24', fontSize: '1.2rem' }}
        >
          ⚡ Energiekamer ⚡
        </div>
      </div>

      {view === 'shop' ? (
        <div
          className="stone-shop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {STONES.map(stone => (
            <div
              key={stone.id}
              className="stone-card game-panel"
              style={{
                borderColor: stone.color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
              }}
            >
              <img
                src={stone.img}
                alt={stone.name}
                style={{
                  width: '64px',
                  height: '64px',
                  imageRendering: 'pixelated',
                  marginBottom: '1rem',
                }}
              />
              <h3
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '0.8rem',
                  marginBottom: '0.5rem',
                }}
              >
                {stone.name}
              </h3>
              <button
                className="btn-kenney primary"
                onClick={() => handleBuyStone(stone)}
                style={{ width: '100%', fontSize: '0.7rem' }}
              >
                💰 {stone.price}
              </button>
            </div>
          ))}
        </div>
      ) : !selectedPokemon ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
          <div
            className="evolution-intro game-panel-dark"
            style={{ textAlign: 'center', padding: '1rem', marginBottom: '2rem' }}
          >
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Welkom
            </h2>
            <div
              className="mode-toggle"
              style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
            >
              <button
                className={`btn-kenney ${view === 'evolve' ? 'primary' : 'neutral'}`}
                onClick={() => setView('evolve')}
              >
                Evolueren
              </button>
              <button
                className={`btn-kenney ${view === 'shop' ? 'primary' : 'neutral'}`}
                onClick={() => setView('shop')}
              >
                Stenen Winkel
              </button>
            </div>
          </div>
          {/* ... guide ... */}
          <div
            className="pokemon-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {readyToEvolve.length === 0 ? (
              <p
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  color: '#fff',
                  textAlign: 'center',
                  gridColumn: '1/-1',
                }}
              >
                Geen Pokémon klaar om te evolueren.
              </p>
            ) : (
              readyToEvolve.map(p => (
                <div
                  key={p.id}
                  className="evo-pokemon-card game-panel"
                  onClick={() => setSelectedPokemon(p)}
                  style={{ cursor: 'pointer', textAlign: 'center', padding: '1rem' }}
                >
                  <img
                    src={p.sprites?.front_default}
                    alt={p.name}
                    className="pokemon-sprite"
                    style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }}
                  />
                  <h3
                    style={{
                      fontFamily: '"Press Start 2P", cursive',
                      fontSize: '0.8rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {p.name}
                  </h3>
                  {getEvolutionInfo(p.id).map(opt => (
                    <div key={opt.evo} className="evo-preview-row" style={{ fontSize: '0.7rem' }}>
                      <span>{opt.method === 'stone' ? '💎' : '📈'}</span>
                      <span>➡ {opt.evo}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div
          className="evolution-selection game-panel"
          style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }}
        >
          <h3
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '1rem',
              marginBottom: '2rem',
            }}
          >
            Kies de evolutie voor {selectedPokemon.name}
          </h3>
          {getEvolutionInfo(selectedPokemon.id).map(opt => (
            <button
              key={opt.evo}
              className="evo-choice-btn btn-kenney primary"
              onClick={() => handleEvolve(selectedPokemon, opt)}
              style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
            >
              {opt.evo} (
              {opt.method === 'stone'
                ? `Vereist ${STONES.find(s => s.id === opt.item)?.name || 'Steen'}`
                : `Level ${opt.level}`}
              )
            </button>
          ))}
          <button
            className="cancel-btn btn-kenney neutral"
            onClick={() => setSelectedPokemon(null)}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Annuleren
          </button>
        </div>
      )}

      <div
        className="hall-stats game-panel-dark"
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '2rem',
          padding: '1rem 2rem',
          borderRadius: '50px',
          border: '2px solid #fff',
        }}
      >
        <div
          className="stat-box"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}
        >
          <Upload size={20} />
          <span className="stat-value" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            {readyToEvolve.length}
          </span>
          <span className="stat-label" style={{ fontSize: '0.8rem' }}>
            Klaar
          </span>
        </div>
        <div
          className="stat-box"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}
        >
          <Download size={20} />
          <span className="stat-value" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            {ownedIds.length}
          </span>
          <span className="stat-label" style={{ fontSize: '0.8rem' }}>
            Gevangen
          </span>
        </div>
      </div>
    </div>
  );
}

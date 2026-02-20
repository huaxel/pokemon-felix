import { useState } from 'react';
import { Check } from 'lucide-react';
import { usePlayer } from '../../../hooks/usePlayer';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile, shopUrbanTile, bagIcon } from '../worldAssets';
import './WardrobePage.css';

const OUTFITS = [
  {
    id: 'default',
    name: 'Passie Rood',
    color: '#ef4444',
    price: 0,
    desc: 'De klassieke trainerskleur.',
  },
  { id: 'cool', name: 'IJsblauw', color: '#3b82f6', price: 500, desc: 'Fris en ontspannen.' },
  {
    id: 'nature',
    name: 'Bosgroen',
    color: '#22c55e',
    price: 500,
    desc: 'Perfect om te verkennen.',
  },
  {
    id: 'shiny',
    name: 'Bliksemgeel',
    color: '#eab308',
    price: 1000,
    desc: 'Val op in de menigte!',
  },
  {
    id: 'ninja',
    name: 'Schaduwzwart',
    color: '#1e293b',
    price: 1500,
    desc: 'Sluipend als een ninja.',
  },
  {
    id: 'pink',
    name: 'Chique Roze',
    color: '#ec4899',
    price: 800,
    desc: 'Fabelachtig en opvallend.',
  },
];

export function WardrobePage() {
  const { showSuccess, showError } = useToast();
  const { playerColor, setPlayerColor } = usePlayer();
  const { coins, spendCoins } = usePokemonContext();
  const [ownedOutfits, setOwnedOutfits] = useState(['default']); // Simple local state for now

  const handleBuy = outfit => {
    if (coins >= outfit.price) {
      if (spendCoins(outfit.price)) {
        setOwnedOutfits([...ownedOutfits, outfit.id]);
        showSuccess(`Je hebt ${outfit.name} gekocht!`);
      }
    } else {
      showError('Je hebt niet genoeg munten.');
    }
  };

  const handleEquip = (outfitId, color) => {
    setPlayerColor(color);
    showSuccess('Je hebt je omgekleed!');
  };

  return (
    <div
      className="wardrobe-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <WorldPageHeader title="Mode Boetiek" icon="👗" />

      <div className="wardrobe-content">
        <div
          className="outfit-preview"
          style={{ border: '4px solid #eab308', borderRadius: '8px', backgroundColor: '#fff' }}
        >
          <img
            src={shopUrbanTile}
            alt="Shop"
            className="shop-bg"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="character-preview" style={{ backgroundColor: playerColor }}>
            {/* Simple pixel character representation */}
            <div className="pixel-char"></div>
          </div>
        </div>

        <div className="outfits-grid">
          {OUTFITS.map(outfit => {
            const isOwned = ownedOutfits.includes(outfit.id);
            const isEquipped = playerColor === outfit.color;

            return (
              <div
                key={outfit.id}
                className="outfit-card game-panel-dark"
                style={{ border: '4px solid #4b5563', padding: '1rem', backgroundColor: '#1f2937' }}
              >
                <div
                  className="color-swatch"
                  style={{ backgroundColor: outfit.color, border: '2px solid #fff' }}
                ></div>
                <div className="outfit-info">
                  <h3
                    style={{
                      fontFamily: '"Press Start 2P", cursive',
                      fontSize: '0.8rem',
                      color: '#fff',
                    }}
                  >
                    {outfit.name}
                  </h3>
                  <p style={{ color: '#d1d5db', fontSize: '0.8rem' }}>{outfit.desc}</p>
                </div>
                <div className="outfit-action">
                  {isOwned ? (
                    <button
                      className={`action-btn btn-kenney ${isEquipped ? 'success' : 'primary'}`}
                      onClick={() => !isEquipped && handleEquip(outfit.id, outfit.color)}
                      disabled={isEquipped}
                      style={{ width: '100%', fontSize: '0.7rem' }}
                    >
                      {isEquipped ? (
                        <>
                          <Check size={16} /> Aan
                        </>
                      ) : (
                        'Aantrekken'
                      )}
                    </button>
                  ) : (
                    <button
                      className="action-btn btn-kenney warning"
                      onClick={() => handleBuy(outfit)}
                      style={{
                        width: '100%',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <img
                        src={bagIcon}
                        alt="coins"
                        style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
                      />{' '}
                      {outfit.price}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { ShoppingCart } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useEconomy } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import { grassTile, shopUrbanTile } from '../worldAssets';

import './DecorShopPage.css';

const DECOR_SHOP_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.GRASS;
    if (y === 3 && xIndex === 4) return TILE_TYPES.URBAN_SHOP;
    if (y === 4 && xIndex === 4) return TILE_TYPES.URBAN_SHOP;
    if (xIndex === 4) return TILE_TYPES.PATH;
    return TILE_TYPES.GRASS;
  }),
);

const DECOR_ITEMS = [
  {
    id: 'plant',
    name: 'Tropische Plant',
    price: 200,
    icon: '🌿',
    desc: 'Brengt leven in je huis.',
  },
  { id: 'rug', name: 'Perzisch Tapijt', price: 400, icon: '🧶', desc: 'Zacht en elegant.' },
  { id: 'lamp', name: 'Lavalamp', price: 350, icon: '💡', desc: 'Retro verlichting.' },
  { id: 'poster', name: 'Pikachu Poster', price: 150, icon: '🖼️', desc: 'Pika pika!' },
  { id: 'chair', name: 'Gamer Stoel', price: 800, icon: '💺', desc: 'Maximaal comfort.' },
  {
    id: 'fishtank',
    name: 'Magikarp Aquarium',
    price: 1200,
    icon: '🐟',
    desc: 'Ontspannend om naar te kijken.',
  },
];

export function DecorShopPage() {
  const { coins, spendCoins } = useEconomy();
  const { showSuccess, showError } = useToast();

  const handleBuy = item => {
    if (coins >= item.price) {
      if (spendCoins(item.price)) {
        showSuccess(`Je hebt ${item.name} gekocht! (Verzonden naar huis)`);
      }
    } else {
      showError('Je hebt niet genoeg munten.');
    }
  };

  return (
    <div
      className="decor-shop-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <WorldPageHeader title="Meubels & Decoratie" icon="🛋️" />

      <div className="decorshop-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={DECOR_SHOP_GRID}
            onObjectClick={undefined}
            isNight={false}
            enableSky={false}
          />
        </Canvas>
      </div>

      <div className="decor-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          className="decor-intro game-panel-dark"
          style={{ marginTop: '2rem', textAlign: 'center', marginBottom: '2rem' }}
        >
          <img
            src={shopUrbanTile}
            alt="Shop"
            className="shop-img"
            style={{ imageRendering: 'pixelated', height: '128px', marginBottom: '1rem' }}
          />
          <p
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '0.8rem',
              lineHeight: '1.5',
            }}
          >
            Versier je geheime basis met de beste meubels!
          </p>
        </div>

        <div className="catalog-grid">
          {DECOR_ITEMS.map(item => (
            <div
              key={item.id}
              className="catalog-item game-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <div className="item-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '0.7rem',
                  marginBottom: '0.5rem',
                  minHeight: '32px',
                  color: '#1e293b',
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  minHeight: '40px',
                  color: '#475569',
                }}
              >
                {item.desc}
              </p>
              <div
                className="price-tag"
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  color: '#fbbf24',
                  marginBottom: '1rem',
                  textShadow: '1px 1px 0 #000',
                }}
              >
                {item.price} munten
              </div>
              <button
                className="btn-kenney primary"
                onClick={() => handleBuy(item)}
                style={{ width: '100%', fontSize: '0.7rem', marginTop: 'auto' }}
              >
                <ShoppingCart size={14} style={{ marginRight: '0.5rem' }} /> Kopen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

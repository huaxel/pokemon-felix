import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useEconomy, useCare } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import { grassTile } from '../worldAssets';
import bagImage from '../../../assets/items/bag_icon.png';
import candyImage from '../../../assets/items/rare_candy.png';
import mysteryImage from '../../../assets/items/mystery_box.png';
import pokeballImage from '../../../assets/items/pokeball.png';
import greatballImage from '../../../assets/items/greatball.png';
import ultraballImage from '../../../assets/items/ultraball.png';
import berryImage from '../../../assets/items/berry.png';
import sitrusImage from '../../../assets/items/sitrus_berry.png';
import razzImage from '../../../assets/items/razz_berry.png';
import './BagPage.css';

const BAG_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.GRASS;
    if (y === 3 && xIndex === 3) return TILE_TYPES.TREE;
    if (y === 2 && xIndex === 5) return TILE_TYPES.TREE;
    if (xIndex === 4) return TILE_TYPES.PATH;
    return TILE_TYPES.GRASS;
  }),
);

export function BagPage() {
  const { inventory, removeItem, coins } = useEconomy();
  const { healAll } = useCare();

  const ITEM_DETAILS = {
    pokeball: {
      name: 'Poké Ball',
      image: pokeballImage,
      desc: 'Gebruik in de Gacha om Pokémon te vangen.',
    },
    greatball: {
      name: 'Super Ball',
      image: greatballImage,
      desc: 'Hogere kans op zeldzame Pokémon.',
    },
    ultraball: { name: 'Ultra Ball', image: ultraballImage, desc: 'Zeer hoge vangkans.' },
    'rare-candy': {
      name: 'Zeldzaam Snoepje',
      image: candyImage,
      desc: 'Geneest je hele team direct!',
    },
    'mystery-box': {
      name: 'Mysterieuze Doos',
      image: mysteryImage,
      desc: 'Wie weet wat erin zit? (Gebruik in Gacha)',
    },
    berry: { name: 'Oran Bes', image: berryImage, desc: 'Herstelt 30 HP van een Pokémon.' },
    'sitrus-berry': {
      name: 'Sitrus Bes',
      image: sitrusImage,
      desc: 'Herstelt 60 HP. Erg krachtig!',
    },
    'razz-berry': {
      name: 'Frambu Bes',
      image: razzImage,
      desc: 'Heerlijk. Verhoogt blijheid en vermindert honger.',
    },
    fire_stone: {
      name: 'Vuursteen',
      image: '/assets/items/fire_stone.png',
      desc: 'Evolueert bepaalde Vuur-Pokémon.',
    },
    water_stone: {
      name: 'Watersteen',
      image: '/assets/items/water_stone.png',
      desc: 'Evolueert bepaalde Water-Pokémon.',
    },
    thunder_stone: {
      name: 'Dondersteen',
      image: '/assets/items/rare_candy.png',
      desc: 'Evolueert bepaalde Elektrische Pokémon.',
    }, // Placeholder
    leaf_stone: {
      name: 'Bladsteen',
      image: '/assets/items/berry.png',
      desc: 'Evolueert bepaalde Gras-Pokémon.',
    }, // Placeholder
    moon_stone: {
      name: 'Maansteen',
      image: '/assets/items/mystery_box.png',
      desc: 'Een mysterieuze steen die gloeit als de maan.',
    }, // Placeholder
  };

  const { addToast } = useToast();

  const handleUseItem = itemId => {
    if (itemId === 'rare-candy') {
      if (removeItem(itemId, 1)) {
        healAll();
        addToast('Je team is volledig genezen!', 'success');
      }
    } else {
      addToast('Dit item kun je gebruiken in de Poké-Gacha.', 'info');
    }
  };

  return (
    <div
      className="bag-page-container"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      <div className="bag-content-wrapper game-panel-dark">
        {/* Visual Backpack Section */}
        <div
          className="bag-visual-section"
          style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            border: '4px solid #4a3b32',
          }}
        >
          <div className="bag-3d-bg">
            <Canvas
              shadows={false}
              dpr={[1, 1.5]}
              gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
              camera={{ position: [3.5, 4.5, 8], fov: 55 }}
            >
              <WorldScene3DMain
                mapGrid={BAG_GRID}
                onObjectClick={undefined}
                isNight={false}
                enableSky={false}
              />
            </Canvas>
          </div>
          <div className="backpack-frame">
            <img
              src={bagImage}
              className="pixel-backpack"
              alt="Rugzak"
              style={{ width: '192px' }}
            />
            <div className="backpack-overlay">
              <div className="backpack-stats" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                <div
                  className="stat-pill"
                  style={{
                    background: '#fbbf24',
                    color: '#000',
                    borderRadius: '0',
                    border: '4px solid #b45309',
                  }}
                >
                  <img src={bagImage} alt="coins" className="mini-coin" />
                  <span>{coins} Munten</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Grid Section */}
        <div className="bag-inventory-section">
          <header className="bag-page-header" style={{ marginBottom: '1rem' }}>
            <Link
              to="/adventure"
              className="btn-kenney neutral"
              style={{ textDecoration: 'none', marginRight: '1rem' }}
            >
              ← Terug
            </Link>
            <h1
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1.5rem',
                textShadow: '2px 2px 0 #000',
              }}
            >
              Mijn Rugzak
            </h1>
          </header>

          <div className="inventory-scroll-area">
            <div
              className="inventory-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {Object.entries(inventory).map(([id, count]) => {
                const details = ITEM_DETAILS[id];
                if (!details || (count === 0 && !id.includes('ball'))) return null;

                return (
                  <div
                    key={id}
                    className={`game-panel ${count === 0 ? 'empty' : ''}`}
                    style={{ position: 'relative', opacity: count === 0 ? 0.6 : 1 }}
                  >
                    <div
                      className="item-count-badge"
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        fontFamily: '"Press Start 2P", cursive',
                        fontSize: '0.6rem',
                        border: '2px solid #991b1b',
                        zIndex: 10,
                      }}
                    >
                      x{count}
                    </div>

                    <div
                      className="item-img-container"
                      style={{
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <img
                        src={details.image}
                        alt={details.name}
                        className="item-img-pixel"
                        style={{ maxHeight: '64px', imageRendering: 'pixelated' }}
                      />
                    </div>

                    <div className="item-info">
                      <h3
                        style={{
                          fontFamily: '"Press Start 2P", cursive',
                          fontSize: '0.8rem',
                          marginBottom: '0.5rem',
                          minHeight: '32px',
                        }}
                      >
                        {details.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: '#fbbf24',
                          marginBottom: '1rem',
                          minHeight: '40px',
                        }}
                      >
                        {details.desc}
                      </p>
                      <button
                        className="btn-kenney primary"
                        onClick={() => handleUseItem(id)}
                        disabled={count === 0}
                        style={{ width: '100%', fontSize: '0.7rem' }}
                      >
                        Gebruiken
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.values(inventory).every(c => c === 0) && (
              <div className="empty-bag-notice" style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ fontFamily: '"Press Start 2P", cursive', marginBottom: '1rem' }}>
                  Je rugzak is momenteel leeg...
                </p>
                <Link
                  to="/adventure"
                  className="btn-kenney primary"
                  style={{ textDecoration: 'none' }}
                >
                  Ga naar de Gacha!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
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

export function BagPage() {
    const { inventory, removeItem, coins, healAll } = usePokemonContext();

    const ITEM_DETAILS = {
        'pokeball': { name: 'Poké Ball', image: pokeballImage, desc: 'Gebruik in de Gacha om Pokémon te vangen.' },
        'greatball': { name: 'Super Ball', image: greatballImage, desc: 'Hogere kans op zeldzame Pokémon.' },
        'ultraball': { name: 'Ultra Ball', image: ultraballImage, desc: 'Zeer hoge vangkans.' },
        'rare-candy': { name: 'Zeldzaam Snoepje', image: candyImage, desc: 'Geneest je hele team direct!' },
        'mystery-box': { name: 'Mysterieuze Doos', image: mysteryImage, desc: 'Wie weet wat erin zit? (Gebruik in Gacha)' },
        'berry': { name: 'Baya Oran', image: berryImage, desc: 'Restaura 30 HP a un Pokémon.' },
        'sitrus-berry': { name: 'Baya Zidra', image: sitrusImage, desc: 'Restaura 60 HP. ¡Muy potente!' },
        'razz-berry': { name: 'Baya Frambu', image: razzImage, desc: 'Deliciosa. Aumenta felicidad y reduce hambre.' },
        'fire_stone': { name: 'Piedra Fuego', image: '/assets/items/fire_stone.png', desc: 'Evoluciona a ciertos Pokémon de fuego.' },
        'water_stone': { name: 'Piedra Agua', image: '/assets/items/water_stone.png', desc: 'Evoluciona a ciertos Pokémon de agua.' },
        'thunder_stone': { name: 'Piedra Trueno', image: '/assets/items/rare_candy.png', desc: 'Evoluciona a ciertos Pokémon eléctricos.' }, // Placeholder
        'leaf_stone': { name: 'Piedra Hoja', image: '/assets/items/berry.png', desc: 'Evoluciona a ciertos Pokémon de planta.' }, // Placeholder
        'moon_stone': { name: 'Piedra Lunar', image: '/assets/items/mystery_box.png', desc: 'Una piedra misteriosa que brilla como la luna.' } // Placeholder
    };

    const { addToast } = useToast();

    const handleUseItem = (itemId) => {
        if (itemId === 'rare-candy') {
            if (removeItem(itemId, 1)) {
                healAll();
                addToast("Je team is volledig genezen!", 'success');
            }
        } else {
            addToast("Dit item kun je gebruiken in de Poké-Gacha.", 'info');
        }
    };

    return (
        <div className="bag-page-container">
            <div className="bag-content-wrapper">
                {/* Visual Backpack Section */}
                <div className="bag-visual-section">
                    <div className="backpack-frame">
                        <img src={bagImage} className="pixel-backpack" alt="Rugzak" />
                        <div className="backpack-overlay">
                            <div className="backpack-stats">
                                <div className="stat-pill">
                                    <img src={bagImage} alt="coins" className="mini-coin" />
                                    <span>{coins} Munten</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Grid Section */}
                <div className="bag-inventory-section">
                    <header className="bag-page-header">
                        <Link to="/adventure" className="back-btn-pill">← Terug</Link>
                        <h1>Mijn Rugzak</h1>
                    </header>

                    <div className="inventory-scroll-area">
                        <div className="inventory-grid">
                            {Object.entries(inventory).map(([id, count]) => {
                                const details = ITEM_DETAILS[id];
                                if (!details || (count === 0 && !id.includes('ball'))) return null;

                                return (
                                    <div key={id} className={`item-card-premium ${count === 0 ? 'empty' : ''}`}>
                                        <div className="item-count-badge">x{count}</div>
                                        <div className="item-img-container">
                                            <img src={details.image} alt={details.name} className="item-img-pixel" />
                                        </div>
                                        <div className="item-info">
                                            <h3>{details.name}</h3>
                                            <p>{details.desc}</p>
                                            <button
                                                className="use-item-btn-pill"
                                                onClick={() => handleUseItem(id)}
                                                disabled={count === 0}
                                            >
                                                Gebruiken
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {Object.values(inventory).every(c => c === 0) && (
                            <div className="empty-bag-notice">
                                <p>Je rugzak is momenteel leeg...</p>
                                <Link to="/adventure" className="go-shop-pill">Ga naar de Gacha!</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

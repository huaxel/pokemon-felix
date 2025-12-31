import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import bagImage from '../../assets/items/bag_icon.png';
import candyImage from '../../assets/items/rare_candy.png';
import mysteryImage from '../../assets/items/mystery_box.png';
import pokeballImage from '../../assets/items/pokeball.png';
import greatballImage from '../../assets/items/greatball.png';
import ultraballImage from '../../assets/items/ultraball.png';
import './BagPage.css';

export function BagPage() {
    const { inventory, removeItem, coins, healAll } = usePokemonContext();

    const ITEM_DETAILS = {
        'pokeball': { name: 'Poké Ball', image: pokeballImage, desc: 'Gebruik in de Gacha om Pokémon te vangen.' },
        'greatball': { name: 'Super Ball', image: greatballImage, desc: 'Hogere kans op zeldzame Pokémon.' },
        'ultraball': { name: 'Ultra Ball', image: ultraballImage, desc: 'Zeer hoge vangkans.' },
        'rare-candy': { name: 'Zeldzaam Snoepje', image: candyImage, desc: 'Geneest je hele team direct!' },
        'mystery-box': { name: 'Mysterieuze Doos', image: mysteryImage, desc: 'Wie weet wat erin zit? (Gebruik in Gacha)' }
    };

    const handleUseItem = (itemId) => {
        if (itemId === 'rare-candy') {
            if (removeItem(itemId, 1)) {
                healAll();
                alert("Je team is volledig genezen! 🍬✨");
            }
        } else {
            alert("Dit item kun je gebruiken in de Poké-Gacha! 🎰");
        }
    };

    return (
        <div className="bag-page">
            <header className="bag-header">
                <Link to="/adventure" className="back-btn">⬅️ Terug</Link>
                <h1><img src={bagImage} className="header-bag-icon" alt="" /> Mijn Rugzak</h1>
                <div className="coin-balance">🪙 {coins}</div>
            </header>

            <div className="inventory-grid">
                {Object.entries(inventory).map(([id, count]) => {
                    const details = ITEM_DETAILS[id];
                    if (!details || (count === 0 && !id.includes('ball'))) return null;

                    return (
                        <div key={id} className={`item-card ${count === 0 ? 'empty' : ''}`}>
                            <div className="item-count">x{count}</div>
                            <img src={details.image} alt={details.name} className="item-img" />
                            <h3>{details.name}</h3>
                            <p>{details.desc}</p>
                            <button
                                className="use-item-btn"
                                onClick={() => handleUseItem(id)}
                                disabled={count === 0}
                            >
                                Gebruiken
                            </button>
                        </div>
                    );
                })}
            </div>

            {Object.values(inventory).every(c => c === 0) && (
                <div className="empty-bag-msg">
                    <p>Je rugzak is momenteel leeg...</p>
                    <Link to="/adventure" className="go-shop-btn">Ga naar de Gacha! 🎰</Link>
                </div>
            )}
        </div>
    );
}

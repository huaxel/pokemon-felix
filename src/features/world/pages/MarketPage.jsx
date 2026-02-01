import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { useOutfitEffects } from '../../../hooks/useOutfitEffects';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { 
    grassTile, 
    marketImage, 
    bagIcon,
    pokeballTile as pokeballImage,
    greatballIcon as greatballImage,
    ultraballIcon as ultraballImage,
    potionIcon as potionImage,
    superPotionIcon as superPotionImage,
    rareCandyIcon as rareCandyImage,
    mysteryBoxIcon as mysteryBoxImage,
    berryIcon as oranBerryImage,
    sitrusBerryIcon as sitrusBerryImage,
    razzBerryIcon as razzBerryImage
} from '../worldAssets';
import './MarketPage.css';

const calculatePokemonValue = (pokemon) => {
    if (!pokemon || !pokemon.stats || !Array.isArray(pokemon.stats)) {
        return 50;
    }

    const bst = pokemon.stats.reduce((sum, s) => sum + (s.base_stat || 0), 0);
    const baseValue = Math.floor(bst / 10);
    const rarityBonus = pokemon.id > 130 ? 100 : 0;
    const evolutionBonus = pokemon.id > 100 ? 20 : 0;
    return Math.max(50, baseValue + rarityBonus + evolutionBonus);
};

const SHOP_ITEMS = {
    pokeballs: [
        { id: 'pokeball', name: 'Poké Ball', price: 100, description: 'Standaard bal om Pokémon te vangen.', image: pokeballImage },
        { id: 'greatball', name: 'Super Ball', price: 250, description: 'Effectiever dan de Poké Ball.', image: greatballImage },
        { id: 'ultraball', name: 'Ultra Ball', price: 500, description: 'Hoge vangkans.', image: ultraballImage }
    ],
    potions: [
        { id: 'potion', name: 'Potion', price: 200, description: 'Geneest een beetje HP.', image: potionImage },
        { id: 'super-potion', name: 'Super Potion', price: 400, description: 'Geneest meer HP.', image: superPotionImage }
    ],
    berries: [
        { id: 'berry', name: 'Oran Bes', price: 50, description: 'Herstelt 30 HP.', image: oranBerryImage },
        { id: 'sitrus-berry', name: 'Sitrus Bes', price: 100, description: 'Herstelt 80 HP.', image: sitrusBerryImage },
        { id: 'razz-berry', name: 'Frambu Bes', price: 150, description: 'Maakt vangen makkelijker.', image: razzBerryImage }
    ],
    special: [
        { id: 'rare-candy', name: 'Zeldzaam Snoepje', price: 1000, description: 'Verhoogt level.', image: rareCandyImage },
        { id: 'mystery-box', name: 'Mysterieuze Doos', price: 500, description: 'Wat zit erin?', image: mysteryBoxImage }
    ]
};

const ECONOMICS_TIPS = [
    "💡 Tip: Sterkere Pokémon zijn meer munten waard!",
    "💡 Tip: Spaar voor speciale items.",
    "💡 Tip: Dubbele Pokémon verkopen is een goede manier om te verdienen.",
    "💡 Tip: Legendarische Pokémon zijn veel meer waard op de markt."
];

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
                            <img src={item.image} alt={item.name} className="shop-item-img" style={{ imageRendering: 'pixelated' }} />
                        </div>
                        <h3>{item.name}</h3>
                        <p className="item-desc">{item.description}</p>
                        <button className="buy-btn btn-kenney primary" onClick={() => onBuy(item)}>
                            Kopen <img src={bagIcon} alt="coins" className="coin-icon-inline" style={{ imageRendering: 'pixelated' }} />
                            {discount > 0 ? (
                                <span><s style={{ opacity: 0.6 }}>{item.price}</s> <b>{getPrice(item.price)}</b></span>
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
                <p>Verkoop je extra Pokémon! De prijs hangt af van hun kracht. Pokémon in je team kunnen niet worden verkocht.</p>
            </div>

            <div className="pokemon-grid">
                {sellablePokemon.length === 0 ? (
                    <p className="empty-msg">Je hebt geen extra Pokémon om te verkopen...</p>
                ) : (
                    sellablePokemon.map(pokemon => {
                        const value = calculatePokemonValue(pokemon);
                        const bst = pokemon.stats && Array.isArray(pokemon.stats)
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
                                    Verkopen voor <img src={bagIcon} alt="coins" className="coin-icon-inline" /> {value}
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
    const { ownedIds, pokemonList, sellPokemon, coins, spendCoins, addItem, squadIds, addCoins } = usePokemonContext();
    const [tab, setTab] = useState('buy');
    const [category, setCategory] = useState('pokeballs');
    const [showTip, setShowTip] = useState(true);

    const { getDiscount, activeEffect } = useOutfitEffects();
    const discount = getDiscount();

    const getPrice = (basePrice) => Math.floor(basePrice * (1 - discount));

    const handleBuyItem = (item) => {
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

    const sellablePokemon = pokemonList.filter(p =>
        ownedIds.includes(p.id) && !squadIds.includes(p.id)
    );

    const handleSell = async (pokemon) => {
        const value = calculatePokemonValue(pokemon);
        const success = await sellPokemon(pokemon.id);
        if (success) {
            addCoins(value - 50); // sellPokemon already adds 50, so add the difference
            showSuccess(`✅ Je hebt ${pokemon.name} verkocht voor ${value} munten!`);
        }
    };

    return (
        <div className="market-page" style={{ 
            backgroundColor: '#2d1810',
            backgroundImage: `url(${grassTile})`,
            backgroundSize: '64px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
            minHeight: '100vh'
        }}>
            <WorldPageHeader title="Pokémon Markt" icon="🏪" />

            {activeEffect.discount > 0 && (
                <div className="market-discount-banner">
                    ✨ Korting van {activeEffect.discount * 100}% actief dankzij je outfit!
                </div>
            )}


            {showTip && (
                <div className="market-tip">
                    {ECONOMICS_TIPS[Math.floor(Math.random() * ECONOMICS_TIPS.length)]}
                    <button className="tip-close" onClick={() => setShowTip(false)}>✕</button>
                </div>
            )}

            <div className="market-tabs">
                <button className={`tab-btn ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>
                    🛒 Kopen
                </button>
                <button className={`tab-btn ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>
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

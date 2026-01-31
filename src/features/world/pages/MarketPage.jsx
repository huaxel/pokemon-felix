import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { useOutfitEffects } from '../../../hooks/useOutfitEffects';
import { WorldPageHeader } from '../components/WorldPageHeader';
import marketImage from '../../../assets/buildings/market_stall.png';
import bagIcon from '../../../assets/items/bag_icon.png';
import pokeballImage from '../../../assets/items/pokeball.png';
import greatballImage from '../../../assets/items/greatball.png';
import ultraballImage from '../../../assets/items/ultraball.png';
import potionImage from '../../../assets/items/potion.png';
import superPotionImage from '../../../assets/items/super_potion.png';
import rareCandyImage from '../../../assets/items/rare_candy.png';
import mysteryBoxImage from '../../../assets/items/mystery_box.png';
import oranBerryImage from '../../../assets/items/berry.png';
import sitrusBerryImage from '../../../assets/items/sitrus_berry.png';
import razzBerryImage from '../../../assets/items/razz_berry.png';
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
        { id: 'pokeball', name: 'Poké Ball', price: 100, description: 'Balón estándar para atrapar Pokémon.', image: pokeballImage },
        { id: 'greatball', name: 'Súper Ball', price: 250, description: 'Más efectiva que la Poké Ball.', image: greatballImage },
        { id: 'ultraball', name: 'Ultra Ball', price: 500, description: 'Alta probabilidad de captura.', image: ultraballImage }
    ],
    potions: [
        { id: 'potion', name: 'Poción', price: 200, description: 'Cura un poco de HP.', image: potionImage },
        { id: 'super-potion', name: 'Súper Poción', price: 400, description: 'Cura más HP.', image: superPotionImage }
    ],
    berries: [
        { id: 'berry', name: 'Baya Aranja', price: 50, description: 'Restaura 30 HP.', image: oranBerryImage },
        { id: 'sitrus-berry', name: 'Baya Zidra', price: 100, description: 'Restaura 80 HP.', image: sitrusBerryImage },
        { id: 'razz-berry', name: 'Baya Frambu', price: 150, description: 'Facilita la captura.', image: razzBerryImage }
    ],
    special: [
        { id: 'rare-candy', name: 'Caramelo Raro', price: 1000, description: 'Sube de nivel.', image: rareCandyImage },
        { id: 'mystery-box', name: 'Caja Misteriosa', price: 500, description: '¿Qué habrá dentro?', image: mysteryBoxImage }
    ]
};

const ECONOMICS_TIPS = [
    "💡 Tip: ¡Los Pokémon más fuertes valen más monedas!",
    "💡 Tip: Ahorra para comprar objetos especiales.",
    "💡 Tip: Vender Pokémon duplicados es una buena forma de ganar monedas.",
    "💡 Tip: Los Pokémon legendarios valen mucho más en el mercado."
];

function CategoryTabs({ category, setCategory }) {
    return (
        <div className="category-tabs">
            <button
                className={`category-btn ${category === 'pokeballs' ? 'active' : ''}`}
                onClick={() => setCategory('pokeballs')}
            >
                ⚾ Poké Balls
            </button>
            <button
                className={`category-btn ${category === 'potions' ? 'active' : ''}`}
                onClick={() => setCategory('potions')}
            >
                🧪 Pociones
            </button>
            <button
                className={`category-btn ${category === 'berries' ? 'active' : ''}`}
                onClick={() => setCategory('berries')}
            >
                🍒 Bayas
            </button>
            <button
                className={`category-btn ${category === 'special' ? 'active' : ''}`}
                onClick={() => setCategory('special')}
            >
                ✨ Especiales
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
                            <img src={item.image} alt={item.name} className="shop-item-img" />
                        </div>
                        <h3>{item.name}</h3>
                        <p className="item-desc">{item.description}</p>
                        <button className="buy-btn" onClick={() => onBuy(item)}>
                            Comprar <img src={bagIcon} alt="coins" className="coin-icon-inline" />
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
                <p>¡Vende tus Pokémon extra! El precio depende de su fuerza. Los Pokémon en tu equipo no se pueden vender.</p>
            </div>

            <div className="pokemon-grid">
                {sellablePokemon.length === 0 ? (
                    <p className="empty-msg">No tienes Pokémon extra para vender...</p>
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
                                    <span className="stat-label">Fuerza Total: {bst}</span>
                                    {pokemon.id > 130 && <span className="legendary-badge">⭐ Legendario</span>}
                                </div>
                                <button className="sell-btn" onClick={() => onSell(pokemon)}>
                                    Vender por <img src={bagIcon} alt="coins" className="coin-icon-inline" /> {value}
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
                showSuccess(`✅ ¡Has comprado 1 ${item.name}!`);
            }
        } else {
            showError('❌ No tienes suficientes monedas.');
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
            showSuccess(`✅ ¡Vendiste ${pokemon.name} por ${value} monedas!`);
        }
    };

    return (
        <div className="market-page">
            <WorldPageHeader title="Mercado Pokémon" icon="🏪" />

            {activeEffect.discount > 0 && (
                <div className="market-discount-banner">
                    ✨ ¡Descuento de {activeEffect.discount * 100}% activo por tu traje!
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
                    🛒 Comprar
                </button>
                <button className={`tab-btn ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>
                    💰 Vender
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

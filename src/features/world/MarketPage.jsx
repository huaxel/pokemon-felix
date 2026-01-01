import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { useOutfitEffects } from '../../hooks/useOutfitEffects';
import marketImage from '../../assets/buildings/market_stall.png';
import bagIcon from '../../assets/items/bag_icon.png';
import './MarketPage.css';

// Calculate Pokemon value based on stats and rarity
const calculatePokemonValue = (pokemon) => {
    // Defensive check: if stats aren't loaded, return base value
    if (!pokemon || !pokemon.stats || !Array.isArray(pokemon.stats)) {
        return 50; // Fallback value
    }

    const bst = pokemon.stats.reduce((sum, s) => sum + (s.base_stat || 0), 0);
    const baseValue = Math.floor(bst / 10); // 30-80 coins typical
    const rarityBonus = pokemon.id > 130 ? 100 : 0; // Legendary bonus
    const evolutionBonus = pokemon.id > 100 ? 20 : 0; // Later gen bonus
    return Math.max(50, baseValue + rarityBonus + evolutionBonus);
};

export function MarketPage() {
    const { ownedIds, pokemonList, sellPokemon, coins, spendCoins, addItem, squadIds, addCoins } = usePokemonContext();
    const [message, setMessage] = useState(null);
    const [tab, setTab] = useState('buy'); // buy, sell
    const [category, setCategory] = useState('pokeballs'); // pokeballs, potions, special
    const [showTip, setShowTip] = useState(true);

    const SHOP_ITEMS = {
        pokeballs: [
            { id: 'pokeball', name: 'Poké Ball', price: 100, description: 'Balón estándar para atrapar Pokémon.', emoji: '⚾' },
            { id: 'greatball', name: 'Súper Ball', price: 250, description: 'Más efectiva que la Poké Ball.', emoji: '🔵' },
            { id: 'ultraball', name: 'Ultra Ball', price: 500, description: 'Alta probabilidad de captura.', emoji: '🟡' },
        ],
        potions: [
            { id: 'potion', name: 'Poción', price: 200, description: 'Cura un poco de HP.', emoji: '🧪' },
            { id: 'super-potion', name: 'Súper Poción', price: 400, description: 'Cura más HP.', emoji: '💊' },
        ],
        special: [
            { id: 'rare-candy', name: 'Caramelo Raro', price: 1000, description: 'Sube de nivel.', emoji: '🍬' },
            { id: 'mystery-box', name: 'Caja Misteriosa', price: 500, description: '¿Qué habrá dentro?', emoji: '🎁' },
        ]
    };

    const ECONOMICS_TIPS = [
        "💡 Tip: ¡Los Pokémon más fuertes valen más monedas!",
        "💡 Tip: Ahorra para comprar objetos especiales.",
        "💡 Tip: Vender Pokémon duplicados es una buena forma de ganar monedas.",
        "💡 Tip: Los Pokémon legendarios valen mucho más en el mercado.",
    ];

    const { getDiscount, activeEffect } = useOutfitEffects();
    const discount = getDiscount();

    const getPrice = (basePrice) => {
        return Math.floor(basePrice * (1 - discount));
    };

    const handleBuyItem = (item) => {
        const finalPrice = getPrice(item.price);
        if (coins >= finalPrice) {
            if (spendCoins(finalPrice)) {
                addItem(item.id, 1);
                setMessage(`✅ ¡Has comprado 1 ${item.name}!`);
                setTimeout(() => setMessage(null), 3000);
            }
        } else {
            setMessage('❌ No tienes suficientes monedas.');
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Only show pokemon NOT in squad and that are owned
    const sellablePokemon = pokemonList.filter(p =>
        ownedIds.includes(p.id) && !squadIds.includes(p.id)
    );

    const handleSell = async (pokemon) => {
        const value = calculatePokemonValue(pokemon);
        const success = await sellPokemon(pokemon.id);
        if (success) {
            addCoins(value - 50); // sellPokemon already adds 50, so add the difference
            setMessage(`✅ ¡Vendiste ${pokemon.name} por ${value} monedas!`);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="market-page">
            <header className="market-header">
                <Link to="/adventure" className="back-btn">← Terug</Link>
                <h1>🏪 Mercado Pokémon</h1>
                <div className="coin-balance"><img src={bagIcon} alt="coins" className="coin-icon" /> {coins}</div>
            </header>

            {activeEffect.discount > 0 && (
                <div className="market-discount-banner">
                    ✨ ¡Descuento de {activeEffect.discount * 100}% activo por tu traje!
                </div>
            )}

            {message && <div className="market-message">{message}</div>}

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
                <div className="shop-section">
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
                            className={`category-btn ${category === 'special' ? 'active' : ''}`}
                            onClick={() => setCategory('special')}
                        >
                            ✨ Especiales
                        </button>
                    </div>

                    <div className="items-grid">
                        {SHOP_ITEMS[category].map(item => (
                            <div key={item.id} className="item-card">
                                <div className="item-icon-circle">{item.emoji}</div>
                                <h3>{item.name}</h3>
                                <p className="item-desc">{item.description}</p>
                                <button className="buy-btn" onClick={() => handleBuyItem(item)}>
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
            ) : (
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
                                        <button className="sell-btn" onClick={() => handleSell(pokemon)}>
                                            Vender por <img src={bagIcon} alt="coins" className="coin-icon-inline" /> {value}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

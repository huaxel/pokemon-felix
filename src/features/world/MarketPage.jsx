import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { useOutfitEffects } from '../../hooks/useOutfitEffects';
import marketImage from '../../assets/buildings/market_stall.png';
import bagIcon from '../../assets/items/bag_icon.png';
import './MarketPage.css';

export function MarketPage() {
    const { ownedIds, pokemonList, sellPokemon, coins, spendCoins, addItem, squadIds } = usePokemonContext();
    const [message, setMessage] = useState(null);
    const [tab, setTab] = useState('buy'); // buy, sell

    const SHOP_ITEMS = [
        { id: 'pokeball', name: 'Poké Ball', price: 100, description: 'Balón estándar para atrapar Pokémon.' },
        { id: 'greatball', name: 'Súper Ball', price: 250, description: 'Más efectiva que la Poké Ball.' },
        { id: 'ultraball', name: 'Ultra Ball', price: 500, description: 'Alta probabilidad de captura.' },
        { id: 'potion', name: 'Poción', price: 200, description: 'Cura un poco de HP en batalla.' },
        { id: 'rare-candy', name: 'Caramelo Raro', price: 1000, description: 'Sube de nivel instantáneamente.' }
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
                setMessage(`¡Has comprado 1 ${item.name}!`);
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
        const success = await sellPokemon(pokemon.id);
        if (success) {
            setMessage(`Ik heb ${pokemon.name} verkocht voor 50 coins!`);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="market-page">
            <header className="market-header">
                <Link to="/adventure" className="back-btn">Terug naar Wereld</Link>
                <h1>De Pokémon Markt</h1>
                <div className="coin-balance"><img src={bagIcon} alt="coins" className="coin-icon" /> {coins}</div>
            </header>

            {activeEffect.discount > 0 && (
                <div className="market-discount-banner">
                    ✨ ¡Descuento de {activeEffect.discount * 100}% activo por tu traje!
                </div>
            )}

            {message && <div className="market-message">{message}</div>}

            <div className="market-tabs">
                <button className={`tab-btn ${tab === 'buy' ? 'active' : ''}`} onClick={() => setTab('buy')}>Comprar Objetos</button>
                <button className={`tab-btn ${tab === 'sell' ? 'active' : ''}`} onClick={() => setTab('sell')}>Vender Pokémon</button>
            </div>

            {tab === 'buy' ? (
                <div className="shop-section">
                    <div className="items-grid">
                        {SHOP_ITEMS.map(item => (
                            <div key={item.id} className="item-card">
                                <div className="item-icon-circle">🎁</div>
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
                        <p>Verkoop je extra Pokémon hier voor 50 munten! Pokémon in je team kun je niet verkopen.</p>
                    </div>

                    <div className="pokemon-grid">
                        {sellablePokemon.length === 0 ? (
                            <p className="empty-msg">Je hebt geen extra Pokémon om te verkopen...</p>
                        ) : (
                            sellablePokemon.map(pokemon => (
                                <div key={pokemon.id} className="market-card">
                                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                                    <h3>{pokemon.name}</h3>
                                    <button className="sell-btn" onClick={() => handleSell(pokemon)}>
                                        Verkoop voor <img src={bagIcon} alt="coins" className="coin-icon-inline" /> 50
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

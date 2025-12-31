import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import marketImage from '../../assets/buildings/market_stall.png';
import bagIcon from '../../assets/items/bag_icon.png';
import './MarketPage.css';

export function MarketPage() {
    const { ownedIds, pokemonList, sellPokemon, coins, squadIds } = usePokemonContext();
    const [message, setMessage] = useState(null);

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

            {message && <div className="market-message">{message}</div>}

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
        </div>
    );
}

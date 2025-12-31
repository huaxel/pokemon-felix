import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import { addToCollection } from '../../lib/api';
import pokeballImage from '../../assets/pokeball_transparent.png';
import greatballImage from '../../assets/great_ball.png';
import ultraballImage from '../../assets/ultra_ball.png';
import './GachaPage.css';

export function GachaPage() {
    const { coins, spendCoins, setOwnedIds, pokemonList, addToSquad, squadIds } = usePokemonContext();
    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [autoEquipped, setAutoEquipped] = useState(false);
    const [selectedBall, setSelectedBall] = useState('pokeball');

    const GACHA_TIERS = {
        pokeball: {
            id: 'pokeball',
            name: 'Poké Ball',
            cost: 100,
            image: pokeballImage,
            rates: { common: 0.6, rare: 0.3, epic: 0.09, legendary: 0.01 },
            color: '#ef4444'
        },
        greatball: {
            id: 'greatball',
            name: 'Super Ball',
            cost: 300,
            image: greatballImage,
            rates: { common: 0.3, rare: 0.5, epic: 0.18, legendary: 0.02 },
            color: '#3b82f6'
        },
        ultraball: {
            id: 'ultraball',
            name: 'Ultra Ball',
            cost: 1000,
            image: ultraballImage,
            rates: { common: 0, rare: 0.4, epic: 0.5, legendary: 0.1 },
            color: '#eab308'
        }
    };

    const currentTier = GACHA_TIERS[selectedBall];

    const determineRarity = () => {
        const rand = Math.random();
        const rates = currentTier.rates;

        // Accumulate probabilities
        let cumulative = 0;

        cumulative += rates.legendary;
        if (rand < cumulative) return 'legendary';

        cumulative += rates.epic;
        if (rand < cumulative) return 'epic';

        cumulative += rates.rare;
        if (rand < cumulative) return 'rare';

        return 'common';
    };

    const getBST = (pokemon) => {
        return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
    };

    const summon = async () => {
        if (coins < currentTier.cost) {
            setError(`¡Necesitas ${currentTier.cost} PokeCoins!`);
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (spendCoins(currentTier.cost)) {
            setIsAnimating(true);
            setResult(null);
            setAutoEquipped(false);

            // Simulate network/animation delay
            setTimeout(async () => {
                const rarity = determineRarity();
                const pokemon = await getRandomPokemon(rarity);

                if (pokemon) {
                    await addToCollection(pokemon.id);
                    setOwnedIds(prev => [...prev, pokemon.id]);

                    // Auto-equip if squad has space
                    if (squadIds.length < 4) {
                        addToSquad(pokemon.id);
                        setAutoEquipped(true);
                    }

                    setResult({ ...pokemon, rarity });
                } else {
                    // Fallback if no pokemon found for rarity (shouldn't happen with full pokedex)
                    setError("Error invocando: No encontrado para rareza " + rarity);
                }
                setIsAnimating(false);
            }, 2000);
        }
    };

    // Helper to get random pokemon by rarity
    const getRandomPokemon = async (rarity) => {
        // Filter by BST
        const candidates = pokemonList.filter(p => {
            const bst = getBST(p);
            if (rarity === 'legendary') return bst >= 580;
            if (rarity === 'epic') return bst >= 500 && bst < 580;
            if (rarity === 'rare') return bst >= 400 && bst < 500;
            return bst < 400; // common
        });

        // Fallback: if no candidates (e.g. no legendaries loaded), pick from next lower tier
        if (candidates.length === 0) {
            console.warn(`No pokemon found for rarity ${rarity}, falling back.`);
            return pokemonList[Math.floor(Math.random() * pokemonList.length)];
        }

        return candidates[Math.floor(Math.random() * candidates.length)];
    };

    return (
        <div className="gacha-page">
            <div className="gacha-header">
                <Link to="/adventure" className="back-hub-btn">⬅️ 🌍</Link>
                <h1>Poke-Gacha</h1>
                <div className="coin-balance">
                    <span className="coin-icon">🪙</span>
                    <span>{coins}</span>
                </div>
            </div>

            <div className="gacha-stage">
                {error && <div className="error-message">{error}</div>}

                {!result && !isAnimating && (
                    <>
                        <div className="ball-selector">
                            {Object.values(GACHA_TIERS).map(tier => (
                                <div
                                    key={tier.id}
                                    className={`ball-option ${selectedBall === tier.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedBall(tier.id)}
                                    style={{ '--ball-color': tier.color }}
                                >
                                    <img src={tier.image} alt={tier.name} />
                                    <div className="ball-info">
                                        <span className="ball-name">{tier.name}</span>
                                        <span className="ball-cost">{tier.cost} 🪙</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summon-container">
                            <img
                                src={currentTier.image}
                                alt="Summon"
                                className="summon-pokeball"
                                onClick={summon}
                            />
                            <p>Toca la {currentTier.name} para invocar</p>
                            <button className="summon-btn" onClick={summon}>
                                Invocar ({currentTier.cost} 🪙)
                            </button>
                        </div>
                    </>
                )}

                {isAnimating && (
                    <div className="animation-container">
                        <img src={currentTier.image} alt="Summoning..." className="summon-pokeball shaking" />
                        <div className="light-burst"></div>
                    </div>
                )}

                {result && (
                    <div className={`result-container ${result.rarity}`}>
                        <div className="result-glow"></div>
                        <img src={result.sprites.front_default} alt={result.name} className="result-pokemon" />
                        <h2>{result.name}</h2>
                        <span className="rarity-badge">{result.rarity}</span>

                        {autoEquipped && (
                            <div className="auto-equip-msg">
                                ⚔️ ¡Añadido a tu equipo!
                            </div>
                        )}

                        <div className="gacha-actions">
                            <button className="reset-gacha-btn" onClick={() => setResult(null)}>
                                Invocing Nochmal
                            </button>
                            <Link to="/adventure" className="squad-link-btn">
                                🌍 Wereld
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

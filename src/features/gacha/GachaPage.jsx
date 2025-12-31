import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import gachaImage from '../../assets/buildings/gacha_machine.png';
import pokeballImage from '../../assets/items/pokeball.png';
import greatballImage from '../../assets/items/greatball.png';
import ultraballImage from '../../assets/items/ultraball.png';
import candyImage from '../../assets/items/rare_candy.png';
import mysteryImage from '../../assets/items/mystery_box.png';
import bagIcon from '../../assets/items/bag_icon.png';
import './GachaPage.css';

export function GachaPage() {
    const { coins, spendCoins, setOwnedIds, pokemonList, addToSquad, squadIds, addItem } = usePokemonContext();
    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [autoEquipped, setAutoEquipped] = useState(false);
    const [selectedBall, setSelectedBall] = useState('pokeball');
    const [category, setCategory] = useState('catch'); // catch, mystery

    const GACHA_TIERS = {
        pokeball: {
            id: 'pokeball',
            name: 'Poké Ball',
            cost: 100,
            image: pokeballImage,
            rates: { common: 0.6, rare: 0.3, epic: 0.09, legendary: 0.01 },
            color: '#ef4444',
            type: 'catch'
        },
        greatball: {
            id: 'greatball',
            name: 'Super Ball',
            cost: 300,
            image: greatballImage,
            rates: { common: 0.3, rare: 0.5, epic: 0.18, legendary: 0.02 },
            color: '#3b82f6',
            type: 'catch'
        },
        ultraball: {
            id: 'ultraball',
            name: 'Ultra Ball',
            cost: 1000,
            image: ultraballImage,
            rates: { common: 0, rare: 0.4, epic: 0.5, legendary: 0.1 },
            color: '#eab308',
            type: 'catch'
        },
        mystery: {
            id: 'mystery',
            name: 'Mysterieuze Doos',
            cost: 500,
            image: mysteryImage,
            color: '#8b5cf6',
            type: 'mystery'
        },
        candy: {
            id: 'candy',
            name: 'Zeldzaam Snoepje',
            cost: 200,
            image: candyImage,
            color: '#f472b6',
            type: 'mystery'
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
            setError(`Je hebt ${currentTier.cost} PokeCoins nodig!`);
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (spendCoins(currentTier.cost)) {
            setIsAnimating(true);
            setResult(null);
            setAutoEquipped(false);
            const isShiny = Math.random() < 0.01; // 1% Shiny chance

            // Handle non-pokemon items
            if (currentTier.id === 'candy') {
                setTimeout(() => {
                    addItem('rare-candy', 1);
                    setResult({ name: 'Zeldzaam Snoepje', type: 'item', id: 'rare-candy', description: 'Toegevoegd aan je rugzak! Gebruik het om te genezen.', image: candyImage });
                    setIsAnimating(false);
                }, 1500);
                return;
            }

            if (currentTier.id === 'mystery') {
                setTimeout(() => {
                    addItem('mystery-box', 1);
                    setResult({ name: 'Mysterieuze Doos', type: 'item', id: 'mystery-box', description: 'Wat zou erin zitten? Bekijk je rugzak!', image: mysteryImage });
                    setIsAnimating(false);
                }, 1500);
                return;
            }

            // Standard Pokeball logic
            setTimeout(async () => {
                const rarity = determineRarity();
                const pokemon = await getRandomPokemon(rarity);

                if (pokemon) {
                    setOwnedIds(prev => [...prev, pokemon.id]);

                    // Auto-equip if squad has space
                    if (squadIds.length < 4) {
                        addToSquad(pokemon.id);
                        setAutoEquipped(true);
                    }

                    setResult({ ...pokemon, rarity, isShiny });
                } else {
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
                <Link to="/adventure" className="back-hub-btn">Terug naar Wereld</Link>
                <h1>Poke-Gacha</h1>
                <div className="coin-balance">
                    <img src={bagIcon} alt="coins" className="coin-icon" />
                    <span>{coins}</span>
                </div>
            </div>

            <div className="gacha-intro">
                <img src={gachaImage} className="gacha-promo-img" alt="Gacha" />
                <h2>Welkom bij de Poké-Gacha!</h2>
                <p>Kies een categorie en beproef je geluk!</p>
            </div>

            <div className="gacha-nav">
                <button
                    className={`nav-item ${category === 'catch' ? 'active' : ''}`}
                    onClick={() => { setCategory('catch'); setSelectedBall('pokeball'); }}
                >
                    <img src={pokeballImage} alt="Vangen" className="nav-icon" />
                    <span>Vangen</span>
                </button>
                <button
                    className={`nav-item ${category === 'mystery' ? 'active' : ''}`}
                    onClick={() => { setCategory('mystery'); setSelectedBall('mystery'); }}
                >
                    <img src={mysteryImage} alt="Extra's" className="nav-icon" />
                    <span>Extra's</span>
                </button>
            </div>

            <div className="gacha-stage">
                {error && <div className="error-message">{error}</div>}

                {!result && !isAnimating && (
                    <>
                        <div className="ball-selector">
                            {Object.values(GACHA_TIERS).filter(t => t.type === category).map(tier => (
                                <div
                                    key={tier.id}
                                    className={`ball-option ${selectedBall === tier.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedBall(tier.id)}
                                    style={{ '--ball-color': tier.color }}
                                >
                                    {typeof tier.image === 'string' && tier.image.length < 4 ? (
                                        <div className="item-emoji">{tier.image}</div>
                                    ) : (
                                        <img src={tier.image} alt={tier.name} />
                                    )}
                                    <div className="ball-info">
                                        <span className="ball-name">{tier.name}</span>
                                        <span className="ball-cost"><img src={bagIcon} alt="coins" className="coin-icon" />{tier.cost}</span>
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
                            <p>Tik op de {currentTier.name} om te kopen</p>
                            <button className="summon-btn" onClick={summon}>
                                Kopen (<img src={bagIcon} alt="coins" className="coin-icon-inline" /> {currentTier.cost})
                            </button>
                        </div>
                    </>
                )}

                {isAnimating && (
                    <div className="animation-container">
                        {typeof currentTier.image === 'string' && currentTier.image.length < 4 ? (
                            <div className="summon-emoji shaking">{currentTier.image}</div>
                        ) : (
                            <img src={currentTier.image} alt="Summoning..." className="summon-pokeball shaking" />
                        )}
                        <div className="light-burst"></div>
                    </div>
                )}

                {result && (
                    <div className={`result-container ${result.rarity || 'common'}`}>
                        <div className="result-glow"></div>
                        {result.type === 'item' ? (
                            <img src={result.image} alt="" className="result-item-img" />
                        ) : (
                            <img
                                src={result.sprites.front_default}
                                alt={result.name}
                                className={`result-pokemon ${result.isShiny ? 'shiny-effect' : ''}`}
                            />
                        )}
                        <h2>{result.name}</h2>
                        {result.description && <p className="result-desc">{result.description}</p>}
                        <span className="rarity-badge">{result.rarity || 'Gevonden!'}</span>

                        {autoEquipped && (
                            <div className="auto-equip-msg">
                                ⚔️ ¡Añadido a tu equipo!
                            </div>
                        )}

                        <div className="gacha-actions">
                            <button className="reset-gacha-btn" onClick={() => setResult(null)}>
                                Opnieuw proberen
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

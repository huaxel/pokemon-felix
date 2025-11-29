import React, { useState } from 'react';
import { usePokemonContext } from '../../contexts/PokemonContext';
import { addToCollection } from '../../lib/api';
import pokeballImage from '../../assets/pokeball_transparent.png';
import './GachaPage.css';

export function GachaPage() {
    const { coins, spendCoins, setOwnedIds, pokemonList } = usePokemonContext();
    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const COST = 100;

    const summon = async () => {
        if (coins < COST) {
            setError("¡No tienes suficientes PokeCoins!");
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (spendCoins(COST)) {
            setIsAnimating(true);
            setResult(null);

            // Simulate network/animation delay
            setTimeout(async () => {
                const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];

                // Determine rarity (mock logic for visual flair)
                const rand = Math.random();
                let rarity = 'common';
                if (rand > 0.99) rarity = 'legendary';
                else if (rand > 0.9) rarity = 'epic';
                else if (rand > 0.6) rarity = 'rare';

                await addToCollection(randomPokemon.id);
                setOwnedIds(prev => [...prev, randomPokemon.id]);

                setResult({ ...randomPokemon, rarity });
                setIsAnimating(false);
            }, 2000);
        }
    };

    return (
        <div className="gacha-page">
            <div className="gacha-header">
                <h1>Poke-Gacha</h1>
                <div className="coin-balance">
                    <span className="coin-icon">🪙</span>
                    <span>{coins}</span>
                </div>
            </div>

            <div className="gacha-stage">
                {error && <div className="error-message">{error}</div>}

                {!result && !isAnimating && (
                    <div className="summon-container">
                        <img
                            src={pokeballImage}
                            alt="Summon"
                            className="summon-pokeball"
                            onClick={summon}
                        />
                        <p>Toca la Pokeball para invocar</p>
                        <button className="summon-btn" onClick={summon}>
                            Invocar x1 ({COST} 🪙)
                        </button>
                    </div>
                )}

                {isAnimating && (
                    <div className="animation-container">
                        <img src={pokeballImage} alt="Summoning..." className="summon-pokeball shaking" />
                        <div className="light-burst"></div>
                    </div>
                )}

                {result && (
                    <div className={`result-container ${result.rarity}`}>
                        <div className="result-glow"></div>
                        <img src={result.sprites.front_default} alt={result.name} className="result-pokemon" />
                        <h2>{result.name}</h2>
                        <span className="rarity-badge">{result.rarity}</span>
                        <button className="reset-gacha-btn" onClick={() => setResult(null)}>
                            Invocar de nuevo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { PokemonCard } from '../../components/PokemonCard';
import { Heart, Utensils, Sparkles } from 'lucide-react';
import './CarePage.css';

export function CarePage() {
    const {
        squadIds,
        pokemonList,
        careStats,
        healAll,
        feedPokemon,
        coins,
        spendCoins
    } = usePokemonContext();
    const [isHealing, setIsHealing] = useState(false);

    // Get squad data
    const squadPokemon = pokemonList.filter(p => squadIds.includes(p.id));

    const handleHealAll = () => {
        setIsHealing(true);
        // Play sound effect could go here
        setTimeout(() => {
            healAll();
            setIsHealing(false);
        }, 3000);
    };

    const handleFeed = (id) => {
        const FOOD_COST = 20;
        if (coins >= FOOD_COST) {
            if (spendCoins(FOOD_COST)) {
                feedPokemon(id);
            }
        } else {
            alert("¡No tienes suficientes PokeCoins para comida!");
        }
    };

    return (
        <div className="care-page">
            <div className="care-header">
                <h1>Cuidados Pokémon</h1>
                <p>Mantén a tu equipo sano y feliz.</p>
            </div>

            <section className="hospital-section">
                <div className="hospital-card">
                    <div className="hospital-info">
                        <h2><Heart className="icon red" /> Centro Pokémon</h2>
                        <p>Restaura los PS de todo tu equipo.</p>
                    </div>
                    <button
                        className={`heal-all-btn ${isHealing ? 'healing' : ''}`}
                        onClick={handleHealAll}
                        disabled={isHealing || squadIds.length === 0}
                    >
                        {isHealing ? (
                            <><Sparkles className="spin" /> Curando...</>
                        ) : (
                            "¡Curar Equipo!"
                        )}
                    </button>
                    {isHealing && (
                        <div className="healing-animation">
                            <div className="healing-light"></div>
                            <div className="healing-light"></div>
                            <div className="healing-light"></div>
                        </div>
                    )}
                </div>
            </section>

            <section className="canteen-section">
                <h2><Utensils className="icon orange" /> Comedor</h2>
                <div className="squad-care-grid">
                    {squadPokemon.length === 0 && (
                        <p className="empty-msg">No hay Pokémon en tu equipo para cuidar.</p>
                    )}
                    {squadPokemon.map(pokemon => {
                        const stats = careStats[pokemon.id] || { hp: 100, hunger: 0, happiness: 70 };
                        return (
                            <div key={pokemon.id} className="pokemon-care-card">
                                <PokemonCard pokemon={pokemon} isOwned={true} hideStats />

                                <div className="care-stats">
                                    <div className="stat-bar-group">
                                        <div className="stat-label">
                                            <span>Salud (PS)</span>
                                            <span>{Math.round(stats.hp)}%</span>
                                        </div>
                                        <div className="care-bar-bg">
                                            <div
                                                className="care-bar-fill hp"
                                                style={{ width: `${stats.hp}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="stat-bar-group">
                                        <div className="stat-label">
                                            <span>Hambre</span>
                                            <span>{Math.round(stats.hunger)}%</span>
                                        </div>
                                        <div className="care-bar-bg">
                                            <div
                                                className="care-bar-fill hunger"
                                                style={{ width: `${stats.hunger}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="feed-btn"
                                    onClick={() => handleFeed(pokemon.id)}
                                >
                                    <Utensils size={16} /> Alimentar (20 🪙)
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

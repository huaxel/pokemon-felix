import React, { useState, useEffect } from 'react';
import { usePokemonContext } from '../../contexts/PokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { PokemonCard } from '../../components/PokemonCard';
import './SquadPage.css';

export function SquadPage() {
    const { ownedIds, squadIds, addToSquad, removeFromSquad, isInSquad } = usePokemonContext();
    const [benchPokemon, setBenchPokemon] = useState([]);
    const [squadPokemon, setSquadPokemon] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all owned pokemon details
                const promises = ownedIds.map(id => getPokemonDetails(id));
                const results = await Promise.all(promises);

                // Separate into Squad and Bench
                const squad = results.filter(p => squadIds.includes(p.id));
                const bench = results.filter(p => !squadIds.includes(p.id));

                setSquadPokemon(squad);
                setBenchPokemon(bench);
            } catch (error) {
                console.error("Failed to load squad data", error);
            } finally {
                setLoading(false);
            }
        };

        if (ownedIds.length > 0) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [ownedIds, squadIds]);

    if (loading) return <div className="squad-loading">Cargando equipo...</div>;

    return (
        <div className="squad-page">
            <div className="squad-header">
                <h1>Gestión de Equipo</h1>
                <p>Selecciona hasta 6 Pokémon para tus batallas.</p>
                <div className="squad-count">
                    {squadPokemon.length} / 6
                </div>
            </div>

            <div className="active-squad-section">
                <h2>Equipo Activo</h2>
                <div className="squad-grid">
                    {/* Render 6 slots, some might be empty */}
                    {Array.from({ length: 6 }).map((_, index) => {
                        const pokemon = squadPokemon[index];
                        return (
                            <div key={index} className={`squad-slot ${pokemon ? 'filled' : 'empty'}`}>
                                {pokemon ? (
                                    <div className="squad-member">
                                        <PokemonCard
                                            pokemon={pokemon}
                                            isOwned={true}
                                            onToggleOwned={() => { }} // Disable favorite toggle here
                                            onClick={() => { }}
                                            isInSquad={true}
                                            onToggleSquad={() => removeFromSquad(pokemon.id)}
                                        />
                                        <button className="remove-btn" onClick={() => removeFromSquad(pokemon.id)}>
                                            Quitar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-slot-content">
                                        <span>Vacío</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bench-section">
                <h2>Banca ({benchPokemon.length})</h2>
                <div className="bench-grid">
                    {benchPokemon.map(pokemon => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            isOwned={true}
                            onToggleOwned={() => { }}
                            onClick={() => { }}
                            isInSquad={false}
                            onToggleSquad={() => {
                                if (!addToSquad(pokemon.id)) {
                                    alert("¡Tu equipo está lleno!");
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

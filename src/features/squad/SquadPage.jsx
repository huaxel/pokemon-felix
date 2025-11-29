import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { usePokemonContext } from '../../contexts/PokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { PokemonCard } from '../../components/PokemonCard';
import { DraggablePokemon } from './DraggablePokemon';
import { DroppableSlot } from './DroppableSlot';
import squadBg from '../../assets/squad_bg.png';
import './SquadPage.css';

export function SquadPage() {
    const { ownedIds, squadIds, addToSquad, removeFromSquad } = usePokemonContext();
    const [benchPokemon, setBenchPokemon] = useState([]);
    const [squadPokemon, setSquadPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null); // For DragOverlay

    // Sensors for drag detection
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const promises = ownedIds.map(id => getPokemonDetails(id));
                const results = await Promise.all(promises);
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

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const pokemonId = parseInt(active.id.split('-')[1]);
        const source = active.id.split('-')[0]; // 'bench' or 'squad'

        // Drag from Bench to Squad Slot
        if (source === 'bench' && over.id.startsWith('slot-')) {
            addToSquad(pokemonId);
        }
        // Drag from Squad to Bench Area
        else if (source === 'squad' && over.id === 'bench-area') {
            removeFromSquad(pokemonId);
        }
    };

    // Helper to find pokemon by ID for Overlay
    const getActivePokemon = () => {
        if (!activeId) return null;
        const id = parseInt(activeId.split('-')[1]);
        return [...squadPokemon, ...benchPokemon].find(p => p.id === id);
    };

    if (loading) return <div className="squad-loading">Cargando equipo...</div>;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="squad-page" style={{ backgroundImage: `url(${squadBg})` }}>
                <div className="squad-overlay"></div>
                <div className="squad-content">
                    <div className="squad-header">
                        <h1>Gestión de Equipo</h1>
                        <p>Arrastra Pokémon para organizar tu equipo.</p>
                        <div className="squad-count">
                            {squadPokemon.length} / 4
                        </div>

                        {squadPokemon.length > 0 && (
                            <div className="squad-actions" style={{ marginTop: '1.5rem' }}>
                                <Link to="/battle-modes" className="tournament-btn">
                                    ⚔️ Ir a Batalla
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="active-squad-section">
                        <h2>Equipo Activo</h2>
                        <div className="squad-grid">
                            {Array.from({ length: 4 }).map((_, index) => {
                                const pokemon = squadPokemon[index];
                                return (
                                    <DroppableSlot key={index} id={`slot-${index}`} isFilled={!!pokemon}>
                                        {pokemon ? (
                                            <DraggablePokemon id={`squad-${pokemon.id}`}>
                                                <div className="squad-member">
                                                    <PokemonCard
                                                        pokemon={pokemon}
                                                        isOwned={true}
                                                        onToggleOwned={() => { }}
                                                        onClick={() => { }}
                                                        isInSquad={true}
                                                        onToggleSquad={() => removeFromSquad(pokemon.id)}
                                                    />
                                                </div>
                                            </DraggablePokemon>
                                        ) : (
                                            <div className="empty-slot-content">
                                                <span>Vacío</span>
                                            </div>
                                        )}
                                    </DroppableSlot>
                                );
                            })}
                        </div>
                    </div>

                    <DroppableSlot id="bench-area" isFilled={false}>
                        <div className="bench-section">
                            <h2>Banca ({benchPokemon.length})</h2>
                            <div className="bench-grid">
                                {benchPokemon.map(pokemon => (
                                    <DraggablePokemon key={pokemon.id} id={`bench-${pokemon.id}`}>
                                        <PokemonCard
                                            pokemon={pokemon}
                                            isOwned={true}
                                            onToggleOwned={() => { }}
                                            onClick={() => { }}
                                            isInSquad={false}
                                            onToggleSquad={() => addToSquad(pokemon.id)}
                                        />
                                    </DraggablePokemon>
                                ))}
                            </div>
                        </div>
                    </DroppableSlot>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div style={{ transform: 'scale(1.1)', opacity: 0.9 }}>
                            <PokemonCard pokemon={getActivePokemon()} isOwned={true} />
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

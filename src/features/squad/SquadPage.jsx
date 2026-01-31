import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { PokemonCard } from '../../components/PokemonCard';
import { MemberDetailModal } from './components/MemberDetailModal';
import { SquadGrid } from './components/SquadGrid';
import { BenchGrid } from './components/BenchGrid';
import { DroppableSlot } from './DroppableSlot';
import { useSquadData } from './hooks/useSquadData';
import squadBg from '../../assets/buildings/squad_bg.png';
import './SquadPage.css';

export function SquadPage() {
    const { addToSquad, removeFromSquad, careStats } = usePokemonContext();
    const { squadPokemon, benchPokemon, loading } = useSquadData();
    const [selectedMember, setSelectedMember] = useState(null);
    const [activeId, setActiveId] = useState(null); // For DragOverlay

    // Sensors for drag detection
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

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

    const renderHpBar = (pokemonId) => {
        const stats = careStats ? careStats[pokemonId] : null;
        const hp = stats ? stats.hp : 100;
        const hpColor = hp > 60 ? '#22c55e' : hp > 20 ? '#eab308' : '#ef4444';

        return (
            <div className="squad-hp-container">
                <div className="squad-hp-bar" style={{ width: `${hp}%`, backgroundColor: hpColor }}></div>
                <span className="squad-hp-text">{hp}%</span>
            </div>
        );
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
                                <Link to="/adventure" className="btn-adventure primary tournament-btn">
                                    Vra de Wereld
                                </Link>
                                <Link to="/battle-modes" className="btn-adventure tournament-btn" style={{ marginLeft: '1rem' }}>
                                    Ir a Batalla
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="active-squad-section">
                        <h2>Equipo Activo</h2>
                        <SquadGrid
                            squadPokemon={squadPokemon}
                            selectedMember={selectedMember}
                            onSelectMember={setSelectedMember}
                            onRemoveFromSquad={removeFromSquad}
                            renderHpBar={renderHpBar}
                        />
                    </div>

                    <DroppableSlot id="bench-area" isFilled={false}>
                        <div className="bench-section">
                            <h2>Banca ({benchPokemon.length})</h2>
                            <BenchGrid
                                benchPokemon={benchPokemon}
                                selectedMember={selectedMember}
                                onSelectMember={setSelectedMember}
                                onAddToSquad={addToSquad}
                                renderHpBar={renderHpBar}
                            />
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

                {selectedMember && (
                    <MemberDetailModal
                        pokemon={selectedMember}
                        onClose={() => setSelectedMember(null)}
                    />
                )}
            </div>
        </DndContext>
    );
}

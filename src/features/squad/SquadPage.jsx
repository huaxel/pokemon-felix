import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { useDomainCollection } from '../../contexts/DomainContexts';
import { useCareContext } from '../../hooks/useCareContext';
import { PokemonCard } from '../../components/PokemonCard';
import { MemberDetailModal } from './components/MemberDetailModal';
import { SquadGrid } from './components/SquadGrid';
import { BenchGrid } from './components/BenchGrid';
import { DroppableSlot } from './DroppableSlot';
import { useSquadData } from './hooks/useSquadData';
import { grassTile } from '../world/worldAssets';

import './SquadPage.css';

export function SquadPage() {
  const { addToSquad, removeFromSquad } = useDomainCollection();
  const { squadPokemon, benchPokemon, loading } = useSquadData();
  const { careStats } = useCareContext();
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeId, setActiveId] = useState(null); // For DragOverlay

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragStart = event => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = event => {
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

  const renderHpBar = pokemonId => {
    const stats = careStats ? careStats[pokemonId] : null;
    const hp = stats ? stats.hp : 100;
    const hpColorClass = hp > 60 ? 'success' : hp > 20 ? 'warning' : 'critical';

    return (
      <div className="squad-hp-container">
        <div className="stat-bar-pixel" style={{ width: '100%', height: '12px' }}>
          <div className={`stat-bar-pixel-fill ${hpColorClass}`} style={{ width: `${hp}%` }} />
          <span className="stat-value" style={{ fontSize: '0.6rem' }}>
            {hp}%
          </span>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div
        className="squad-loading game-panel-dark"
        style={{ textAlign: 'center', margin: '2rem' }}
      >
        Team laden...
      </div>
    );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className="squad-page"
        style={{
          backgroundColor: '#2d1810',
          backgroundImage: `url(${grassTile})`,
          backgroundSize: '64px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated',
        }}
      >
        <div className="squad-overlay"></div>
        <div className="squad-content">
          <div className="squad-header" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            <h1 style={{ textShadow: '2px 2px 0 #000' }}>Team Beheer</h1>
            <p style={{ color: '#fbbf24', fontSize: '0.8rem' }}>
              Sleep Pokémon om je team te beheren.
            </p>
            <div
              className="squad-count game-panel"
              style={{ display: 'inline-block', padding: '0.5rem 1rem', marginTop: '1rem' }}
            >
              {squadPokemon.length} / 4
            </div>

            {squadPokemon.length > 0 && (
              <div
                className="squad-actions"
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                <Link
                  to="/adventure"
                  className="btn-kenney neutral"
                  style={{ textDecoration: 'none' }}
                >
                  🌍 Wereld
                </Link>
                <Link
                  to="/battle-modes"
                  className="btn-kenney primary"
                  style={{ textDecoration: 'none' }}
                >
                  ⚔️ Naar Gevecht
                </Link>
              </div>
            )}
          </div>

          <div className="active-squad-section">
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                textShadow: '2px 2px 0 #000',
                marginBottom: '1rem',
              }}
            >
              Actief Team
            </h2>
            <SquadGrid
              squadPokemon={squadPokemon}
              selectedMember={selectedMember}
              onSelectMember={setSelectedMember}
              onRemoveFromSquad={removeFromSquad}
              renderHpBar={renderHpBar}
            />
          </div>

          <DroppableSlot id="bench-area" isFilled={false}>
            <div
              className="bench-section game-panel-dark"
              style={{ padding: '2rem', borderRadius: '1rem', marginTop: '2rem' }}
            >
              <h2
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                  textShadow: '2px 2px 0 #000',
                  marginBottom: '1rem',
                }}
              >
                Box ({benchPokemon.length})
              </h2>
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
          <MemberDetailModal pokemon={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </div>
    </DndContext>
  );
}

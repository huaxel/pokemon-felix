import { PokemonCard } from '../../../components/PokemonCard';
import { DraggablePokemon } from '../DraggablePokemon';
import { DroppableSlot } from '../DroppableSlot';

/**
 * Renders the active squad grid (4 slots)
 */
export function SquadGrid({ squadPokemon, onSelectMember, onRemoveFromSquad, renderHpBar }) {
  return (
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
                    onToggleOwned={() => {}}
                    onClick={() => onSelectMember(pokemon)}
                    isInSquad={true}
                    onToggleSquad={() => onRemoveFromSquad(pokemon.id)}
                  />
                  {renderHpBar(pokemon.id)}
                </div>
              </DraggablePokemon>
            ) : (
              <div
                className="empty-slot-content game-panel-dark"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#94a3b8',
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '0.6rem',
                  opacity: 0.5,
                }}
              >
                <span>Leeg</span>
              </div>
            )}
          </DroppableSlot>
        );
      })}
    </div>
  );
}

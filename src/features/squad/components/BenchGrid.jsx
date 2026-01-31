import { PokemonCard } from '../../../components/PokemonCard';
import { DraggablePokemon } from '../DraggablePokemon';

/**
 * Renders the bench pokemon grid
 */
export function BenchGrid({ benchPokemon, onSelectMember, onAddToSquad, renderHpBar }) {
    return (
        <div className="bench-grid">
            {benchPokemon.map(pokemon => (
                <DraggablePokemon key={pokemon.id} id={`bench-${pokemon.id}`}>
                    <PokemonCard
                        pokemon={pokemon}
                        isOwned={true}
                        onToggleOwned={() => { }}
                        onClick={() => onSelectMember(pokemon)}
                        isInSquad={false}
                        onToggleSquad={() => onAddToSquad(pokemon.id)}
                    />
                    {renderHpBar(pokemon.id)}
                </DraggablePokemon>
            ))}
        </div>
    );
}

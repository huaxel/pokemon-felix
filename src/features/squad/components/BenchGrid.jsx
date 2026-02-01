import { PokemonCard } from '../../../components/PokemonCard';
import { DraggablePokemon } from '../DraggablePokemon';

/**
 * Renders the bench pokemon grid
 */
export function BenchGrid({ benchPokemon, onSelectMember, onAddToSquad, renderHpBar }) {
    if (benchPokemon.length === 0) {
        return (
            <div className="bench-empty" style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#94a3b8', 
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.8rem'
            }}>
                <p>Je box is leeg.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>Vang meer Pokémon!</p>
            </div>
        );
    }

    return (
        <div className="bench-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '1rem',
            padding: '1rem'
        }}>
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

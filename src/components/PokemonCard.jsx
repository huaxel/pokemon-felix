import './PokemonCard.css';

export function PokemonCard({ pokemon, isOwned, onToggleOwned, onClick, index = 0 }) {
    return (
        <div
            className={`pokemon-card ${pokemon.types[0].type.name}`}
            onClick={() => onClick(pokemon)}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="card-inner">
                <div className="card-header">
                    <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
                    <button
                        className={`collection-btn ${isOwned ? 'owned' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleOwned(pokemon.id);
                        }}
                    >
                        {isOwned ? '★' : '☆'}
                    </button>
                </div>
                <img
                    src={pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                />
                <h3 className="pokemon-name">
                    {pokemon.speciesData?.names.find(n => n.language.name === 'fr')?.name || pokemon.name}
                </h3>
                <div className="pokemon-types">
                    {pokemon.types.map((type) => (
                        <span key={type.type.name} className={`type-badge ${type.type.name}`}>
                            {type.type.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

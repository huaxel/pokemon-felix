import { typeTranslations } from '../lib/utils';
import './PokemonCard.css';

export function PokemonCard({ pokemon, isOwned, onToggleOwned, onClick, index = 0 }) {
    // Determine the main type for styling
    const mainType = pokemon.types[0].type.name;
    // Determine the display name, preferring Spanish if available
    const displayName = pokemon.speciesData?.names.find(n => n.language.name === 'es')?.name || pokemon.name;

    return (
        <div
            className={`pokemon-card type-${mainType}`}
            onClick={() => onClick(pokemon)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(pokemon);
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${displayName}, number ${pokemon.id}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="card-header">
                <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
                <button
                    className={`favorite-btn ${isOwned ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleOwned(pokemon.id);
                    }}
                    aria-label={isOwned ? "Eliminar de la colección" : "Añadir a la colección"}
                >
                    ★
                </button>
            </div>

            <div className="card-image-container">
                <img
                    src={pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = pokemon.sprites.front_default;
                    }}
                />
            </div>

            <div className="card-info">
                <h3 className="pokemon-name">
                    {displayName}
                </h3>
                <div className="pokemon-types">
                    {pokemon.types.map((type) => (
                        <span key={type.type.name} className={`type-badge ${type.type.name}`}>
                            {typeTranslations[type.type.name] || type.type.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

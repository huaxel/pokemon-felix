import React from 'react';
import { typeTranslations } from '../lib/utils';
import './PokemonCard.css';
import favIcon from '../assets/items/mystery_box.png';
import squadIcon from '../assets/items/greatball.png';

const PokemonCardComponent = ({ pokemon, isOwned, onToggleOwned, onClick, index = 0, isInSquad, onToggleSquad }) => {
    // Determine the main type for styling (defensive: list items may be lightweight)
    const mainType = pokemon.types?.[0]?.type?.name || 'normal';
    // Determine the display name, preferring Spanish if available
    const displayName = pokemon.speciesData?.names?.find(n => n.language.name === 'es')?.name || pokemon.name;

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
                    <img src={favIcon} alt={isOwned ? 'Quitar favorito' : 'Marcar favorito'} className="icon" />
                </button>
                {onToggleSquad && (
                    <button
                        className={`squad-btn ${isInSquad ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSquad();
                        }}
                        title={isInSquad ? "Eliminar del equipo" : "Añadir al equipo"}
                    >
                        <img src={squadIcon} alt={isInSquad ? 'Remover del equipo' : 'Añadir al equipo'} className="icon" />
                    </button>
                )}
            </div>

            <div className="card-image-container">
                <img
                    src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
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
                    {(pokemon.types || []).map((type) => (
                        <span key={type.type.name} className={`type-badge type-${type.type.name}`}>
                            {typeTranslations[type.type.name] || type.type.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PokemonCard = React.memo(PokemonCardComponent);
PokemonCard.displayName = 'PokemonCard';

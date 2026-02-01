import React from 'react';
import { typeTranslations } from '../lib/utils';
import './PokemonCard.css';
import { mysteryBoxIcon as favIcon, greatballIcon as squadIcon } from '../features/world/worldAssets';

const PokemonCardComponent = ({ pokemon, isOwned, onToggleOwned, onClick, index = 0, isInSquad, onToggleSquad }) => {
    // Determine the main type for styling (defensive: list items may be lightweight)
    const mainType = pokemon.types?.[0]?.type?.name || 'normal';
    // Determine the display name, preferring English if available, otherwise default to name
    const displayName = pokemon.speciesData?.names?.find(n => n.language.name === 'en')?.name || pokemon.name;

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
                    aria-label={isOwned ? "Verwijder uit collectie" : "Voeg toe aan collectie"}
                >
                    <img src={favIcon} alt={isOwned ? 'Verwijder favoriet' : 'Markeer favoriet'} className="icon" />
                </button>
                {onToggleSquad && (
                    <button
                        className={`squad-btn ${isInSquad ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSquad();
                        }}
                        title={isInSquad ? "Verwijder uit team" : "Voeg toe aan team"}
                    >
                        <img src={squadIcon} alt={isInSquad ? 'Verwijder uit team' : 'Voeg toe aan team'} className="icon" />
                    </button>
                )}
            </div>

            <div className="card-image-container">
                <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                    loading="lazy"
                    decoding="async"
                    style={{ imageRendering: 'pixelated', width: '96px', height: '96px' }}
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = pokemon.sprites.other['official-artwork'].front_default;
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

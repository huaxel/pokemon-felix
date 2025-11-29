import React, { useState } from 'react';
import './PokemonModal.css';

export function PokemonModal({ pokemon, onClose, isOwned, onToggleOwned }) {
    const [language, setLanguage] = useState('en'); // 'en', 'fr', 'es'

    if (!pokemon) return null;

    const { speciesData } = pokemon;

    // Helper to get name in current language
    const getName = (lang) => {
        const entry = speciesData.names.find(n => n.language.name === lang);
        return entry ? entry.name : pokemon.name;
    };

    // Helper to get flavor text in current language
    const getFlavorText = (lang) => {
        // Find the first entry in the language, preferring later versions (usually more recent games)
        const entries = speciesData.flavor_text_entries.filter(f => f.language.name === lang);
        // Reverse to get latest gen text usually
        return entries.length > 0 ? entries[entries.length - 1].flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.';
    };

    const currentName = getName(language);
    const currentDescription = getFlavorText(language);

    // Stats mapping
    const statLabels = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        speed: 'Speed'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>{currentName} <span className="modal-id">#{String(pokemon.id).padStart(3, '0')}</span></h2>
                    <div className="language-selector">
                        <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
                        <button className={language === 'fr' ? 'active' : ''} onClick={() => setLanguage('fr')}>FR</button>
                        <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-image-container">
                        <img
                            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                            alt={currentName}
                        />
                        <button
                            className={`collection-btn ${isOwned ? 'owned' : ''}`}
                            onClick={() => onToggleOwned(pokemon.id)}
                        >
                            {isOwned ? 'In Collection' : 'Add to Collection'}
                        </button>
                    </div>

                    <div className="modal-info">
                        <div className="types">
                            {pokemon.types.map(t => (
                                <span key={t.type.name} className={`type-badge ${t.type.name}`}>
                                    {t.type.name}
                                </span>
                            ))}
                        </div>

                        <p className="flavor-text">{currentDescription}</p>

                        <div className="stats-container">
                            <h3>Stats</h3>
                            {pokemon.stats.map(stat => (
                                <div key={stat.stat.name} className="stat-row">
                                    <span className="stat-label">{statLabels[stat.stat.name] || stat.stat.name}</span>
                                    <div className="stat-bar-bg">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{stat.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

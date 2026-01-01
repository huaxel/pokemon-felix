import { useState } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import './SecretCavePage.css';

/**
 * SecretCavePage - Hidden cave with rare and legendary Pokemon
 * Requires special item or condition to discover
 * Educational: Exploration, persistence, pattern recognition
 */
export function SecretCavePage() {
    const navigate = useNavigate();
    const { addCoins, toggleOwned } = usePokemonContext();
    const [discovered, setDiscovered] = useState(() => {
        return localStorage.getItem('cave_discovered') === 'true';
    });
    const [depth, setDepth] = useState(0);
    const [encounter, setEncounter] = useState(null);
    const [message, setMessage] = useState('');

    // Rare Pokemon by cave depth
    const CAVE_POKEMON = [
        // Depth 0-2: Uncommon
        { depth: 0, pool: ['zubat', 'geodude', 'onix', 'machop'], rarity: 'Uncommon' },
        // Depth 3-5: Rare
        { depth: 3, pool: ['haunter', 'graveler', 'machoke', 'kadabra'], rarity: 'Rare' },
        // Depth 6-8: Very Rare
        { depth: 6, pool: ['aerodactyl', 'kabuto', 'omanyte', 'dratini'], rarity: 'Very Rare' },
        // Depth 9+: Legendary
        { depth: 9, pool: ['articuno', 'zapdos', 'moltres', 'mewtwo'], rarity: 'Legendary' },
    ];

    /**
     * Discover the cave (first time entry)
     */
    const handleDiscover = () => {
        setDiscovered(true);
        localStorage.setItem('cave_discovered', 'true');
        setMessage('✨ You discovered the Secret Cave! Ancient power flows through these tunnels...');
    };

    /**
     * Explore deeper into the cave
     */
    const handleExplore = async () => {
        const newDepth = depth + 1;
        setDepth(newDepth);

        // Calculate encounter chance (increases with depth)
        const encounterChance = Math.min(0.7, 0.3 + (newDepth * 0.05));

        if (Math.random() < encounterChance) {
            // Determine rarity tier
            const tier = CAVE_POKEMON.reverse().find(t => newDepth >= t.depth) || CAVE_POKEMON[0];

            // Random Pokemon from pool
            const randomPoke = tier.pool[Math.floor(Math.random() * tier.pool.length)];
            const pokemon = await getPokemonDetails(randomPoke);

            // Check for shiny (1% chance)
            if (Math.random() < 0.01) {
                pokemon.shiny = true;
            }

            setEncounter({ pokemon, tier });
            setMessage(`⚠️ A ${tier.rarity} ${pokemon.name} appears!`);
        } else {
            setMessage(`🔦 You explore deeper... (Depth: ${newDepth})`);
        }
    };

    /**
     * Attempt to catch encountered Pokemon
     */
    const handleCatch = () => {
        if (!encounter) return;

        const { pokemon, tier } = encounter;

        // Catch rate based on rarity
        const catchRates = {
            'Uncommon': 0.7,
            'Rare': 0.5,
            'Very Rare': 0.3,
            'Legendary': 0.1
        };

        const catchRate = catchRates[tier.rarity] || 0.5;
        const success = Math.random() < catchRate;

        if (success) {
            toggleOwned(pokemon.id);
            const reward = tier.rarity === 'Legendary' ? 2000
                : tier.rarity === 'Very Rare' ? 1000
                    : tier.rarity === 'Rare' ? 500
                        : 200;

            addCoins(reward);
            setMessage(`✨ Caught ${pokemon.name}! +${reward} coins! ${pokemon.shiny ? '🌟 SHINY!' : ''}`);
            setEncounter(null);
        } else {
            setMessage(`💨 ${pokemon.name} escaped! Try again or explore deeper...`);
            setEncounter(null);
        }
    };

    /**
     * Flee from encounter
     */
    const handleFlee = () => {
        setMessage('🏃 You fled back to the cave entrance...');
        setEncounter(null);
    };

    /**
     * Exit cave
     */
    const handleExit = () => {
        navigate('/adventure');
    };

    /**
     * Reset depth (return to entrance)
     */
    const handleReturnToEntrance = () => {
        setDepth(0);
        setEncounter(null);
        setMessage('🔙 Returned to cave entrance');
    };

    // Discovery screen
    if (!discovered) {
        return (
            <div className="secret-cave-page discovery">
                <div className="discovery-scene">
                    <h1>🕳️ A Mysterious Cave</h1>
                    <div className="cave-entrance">
                        <div className="entrance-glow"></div>
                        <p className="entrance-text">
                            You stumble upon a hidden entrance. Strange energy emanates from within...
                        </p>
                    </div>

                    <div className="discovery-prompt">
                        <p>💭 Do you dare to enter?</p>
                        <div className="discovery-actions">
                            <button className="btn-discover" onClick={handleDiscover}>
                                🔦 Enter the Cave
                            </button>
                            <button className="btn-leave" onClick={handleExit}>
                                🏃 Leave (for now)
                            </button>
                        </div>
                    </div>

                    <div className="discovery-hint">
                        <h3>⚠️ Warning</h3>
                        <p>This cave is said to contain Pokemon found nowhere else...</p>
                        <p>The deeper you go, the rarer the Pokemon become.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Cave exploration screen
    return (
        <div className="secret-cave-page exploring">
            <div className="cave-header">
                <h2>🕳️ Secret Cave</h2>
                <button className="exit-btn" onClick={handleExit}>Exit Cave</button>
            </div>

            <div className="depth-display">
                <span className="depth-label">Depth:</span>
                <span className="depth-value">{depth} floors</span>
                <div className="depth-bar">
                    <div
                        className="depth-fill"
                        style={{
                            width: `${Math.min(100, (depth / 10) * 100)}%`,
                            backgroundColor: depth >= 9 ? '#dc2626'
                                : depth >= 6 ? '#f59e0b'
                                    : depth >= 3 ? '#3b82f6'
                                        : '#22c55e'
                        }}
                    ></div>
                </div>
                <div className="rarity-indicator">
                    {depth >= 9 ? '👑 Legendary Zone'
                        : depth >= 6 ? '💎 Very Rare Zone'
                            : depth >= 3 ? '🔷 Rare Zone'
                                : '🟢 Common Zone'}
                </div>
            </div>

            {message && (
                <div className="cave-message">
                    {message}
                </div>
            )}

            {encounter ? (
                <div className="encounter-scene">
                    <div className="encounter-pokemon">
                        <img
                            src={encounter.pokemon.sprites?.front_default}
                            alt={encounter.pokemon.name}
                            className={encounter.pokemon.shiny ? 'shiny-pokemon' : ''}
                        />
                        <h3>{encounter.pokemon.name}</h3>
                        <div className="rarity-badge" data-rarity={encounter.tier.rarity}>
                            {encounter.tier.rarity}
                        </div>
                        {encounter.pokemon.shiny && (
                            <div className="shiny-badge">✨ SHINY</div>
                        )}
                    </div>

                    <div className="encounter-actions">
                        <button className="btn-catch" onClick={handleCatch}>
                            🎯 Catch
                        </button>
                        <button className="btn-flee" onClick={handleFlee}>
                            🏃 Flee
                        </button>
                    </div>

                    <div className="catch-info">
                        <p>Catch Rate: {
                            encounter.tier.rarity === 'Legendary' ? '10%'
                                : encounter.tier.rarity === 'Very Rare' ? '30%'
                                    : encounter.tier.rarity === 'Rare' ? '50%'
                                        : '70%'
                        }</p>
                    </div>
                </div>
            ) : (
                <div className="exploration-actions">
                    <button className="btn-explore" onClick={handleExplore}>
                        🔦 Explore Deeper
                    </button>
                    {depth > 0 && (
                        <button className="btn-return" onClick={handleReturnToEntrance}>
                            🔙 Return to Entrance
                        </button>
                    )}
                </div>
            )}

            <div className="cave-guide">
                <h3>📚 Cave Guide</h3>
                <div className="guide-zones">
                    <div className="zone" data-active={depth < 3}>
                        <span className="zone-icon">🟢</span>
                        <span>Floors 0-2: Common</span>
                    </div>
                    <div className="zone" data-active={depth >= 3 && depth < 6}>
                        <span className="zone-icon">🔷</span>
                        <span>Floors 3-5: Rare</span>
                    </div>
                    <div className="zone" data-active={depth >= 6 && depth < 9}>
                        <span className="zone-icon">💎</span>
                        <span>Floors 6-8: Very Rare</span>
                    </div>
                    <div className="zone" data-active={depth >= 9}>
                        <span className="zone-icon">👑</span>
                        <span>Floor 9+: Legendary</span>
                    </div>
                </div>

                <div className="cave-tips">
                    <p>💡 <strong>Tip:</strong> Deeper floors have higher encounter rates!</p>
                    <p>✨ <strong>Rare:</strong> 1% chance for shiny Pokemon!</p>
                    <p>💰 <strong>Rewards:</strong> Legendary catches give 2000 coins!</p>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import './WaterRoutePage.css';

/**
 * WaterRoutePage - Surfing mechanic with water Pokemon encounters
 * Requires surf ability or item
 * Educational: Navigation, exploration, water Pokemon ecology
 */
export function WaterRoutePage() {
    const navigate = useNavigate();
    const { inventory, addCoins, toggleOwned } = usePokemonContext();
    const [canSurf, setCanSurf] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [encounter, setEncounter] = useState(null);
    const [exploring, setExploring] = useState(false);
    const [message, setMessage] = useState('');
    const [treasureFound, setTreasureFound] = useState([]);

    // Water Pokemon pool
    const WATER_POKEMON = [
        'magikarp', 'goldeen', 'psyduck', 'poliwag',
        'tentacool', 'horsea', 'krabby', 'shellder',
        'staryu', 'slowpoke', 'seel', 'dewgong',
        'lapras', 'vaporeon', 'gyarados'
    ];

    // Check for surf ability
    useEffect(() => {
        // Check if player has surf item or learned surf
        const hasSurf = (inventory && inventory.surf) || localStorage.getItem('learned_surf') === 'true';
        setCanSurf(hasSurf);
    }, [inventory]);

    /**
     * Learn surf (tutorial)
     */
    const handleLearnSurf = () => {
        localStorage.setItem('learned_surf', 'true');
        setCanSurf(true);
        setMessage('✨ You learned SURF! You can now travel across water!');
        setTimeout(() => setExploring(true), 2000);
    };

    /**
     * Move in water
     */
    const handleMove = (dx, dy) => {
        const newX = Math.max(0, Math.min(9, position.x + dx));
        const newY = Math.max(0, Math.min(9, position.y + dy));
        setPosition({ x: newX, y: newY });

        // Random encounter (30% chance)
        if (Math.random() < 0.3) {
            handleEncounter();
        }

        // Check for treasure
        if (!treasureFound.includes(`${newX},${newY}`)) {
            if (Math.random() < 0.15) {
                const treasureAmount = Math.floor(Math.random() * 200) + 50;
                addCoins(treasureAmount);
                setMessage(`💎 Found treasure! +${treasureAmount} coins`);
                setTreasureFound(prev => [...prev, `${newX},${newY}`]);
            }
        }
    };

    /**
     * Random water Pokemon encounter
     */
    const handleEncounter = async () => {
        const randomPokemon = WATER_POKEMON[Math.floor(Math.random() * WATER_POKEMON.length)];
        const pokemon = await getPokemonDetails(randomPokemon);
        
        // Chance for shiny
        if (Math.random() < 0.02) {
            pokemon.shiny = true;
        }

        setEncounter(pokemon);
        setMessage(`🌊 A wild ${pokemon.name} appeared!`);
    };

    /**
     * Catch Pokemon
     */
    const handleCatch = () => {
        if (!encounter) return;

        const catchRate = encounter.shiny ? 0.2 : 0.6;
        const success = Math.random() < catchRate;

        if (success) {
            toggleOwned(encounter.id);
            const reward = encounter.shiny ? 500 : 150;
            addCoins(reward);
            setMessage(`✨ Caught ${encounter.name}! +${reward} coins ${encounter.shiny ? '🌟' : ''}`);
            setEncounter(null);
        } else {
            setMessage(`💨 ${encounter.name} swam away!`);
            setEncounter(null);
        }
    };

    /**
     * Flee encounter
     */
    const handleFlee = () => {
        setEncounter(null);
        setMessage('🏊 You swam away safely');
    };

    /**
     * Exit water route
     */
    const handleExit = () => {
        navigate('/adventure');
    };

    // Entry screen - need to learn surf
    if (!canSurf && !exploring) {
        return (
            <div className="water-route-page intro">
                <div className="surf-lesson">
                    <h1>🌊 Water Route</h1>
                    <div className="water-scene">
                        <div className="water-animation"></div>
                        <p className="water-text">
                            A vast expanse of water blocks your path...
                        </p>
                    </div>

                    <div className="surf-info">
                        <h2>Learn SURF?</h2>
                        <p>Surf allows you to travel across water and discover new areas!</p>
                        <ul>
                            <li>🌊 Encounter water-type Pokemon</li>
                            <li>💎 Find hidden treasures</li>
                            <li>🗺️ Explore new locations</li>
                        </ul>
                    </div>

                    <button className="learn-surf-btn" onClick={handleLearnSurf}>
                        🏄 Learn SURF
                    </button>
                    <button className="back-btn" onClick={handleExit}>
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    // Surfing screen
    return (
        <div className="water-route-page surfing">
            <div className="water-header">
                <h2>🌊 Water Route - Surfing</h2>
                <button className="exit-btn" onClick={handleExit}>Exit Water</button>
            </div>

            <div className="position-display">
                <span>Position: ({position.x}, {position.y})</span>
                <span>Treasures: {treasureFound.length}</span>
            </div>

            {message && (
                <div className="water-message">
                    {message}
                </div>
            )}

            {encounter ? (
                <div className="water-encounter">
                    <div className="encounter-pokemon">
                        <img 
                            src={encounter.sprites?.front_default} 
                            alt={encounter.name}
                            className={encounter.shiny ? 'shiny' : ''}
                        />
                        <h3>{encounter.name}</h3>
                        {encounter.shiny && (
                            <div className="shiny-badge">✨ SHINY</div>
                        )}
                    </div>

                    <div className="encounter-actions">
                        <button className="btn-catch" onClick={handleCatch}>
                            🎣 Catch
                        </button>
                        <button className="btn-flee" onClick={handleFlee}>
                            🏊 Swim Away
                        </button>
                    </div>

                    <p className="catch-rate">
                        Catch Rate: {encounter.shiny ? '20%' : '60%'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="water-grid">
                        {Array(10).fill(0).map((_, y) => (
                            <div key={y} className="water-row">
                                {Array(10).fill(0).map((_, x) => (
                                    <div
                                        key={`${x}-${y}`}
                                        className={`water-tile ${position.x === x && position.y === y ? 'player' : ''} ${treasureFound.includes(`${x},${y}`) ? 'explored' : ''}`}
                                    >
                                        {position.x === x && position.y === y ? '🏄' : '🌊'}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="surf-controls">
                        <div className="d-pad">
                            <button className="up" onClick={() => handleMove(0, -1)}>⬆️</button>
                            <div className="middle">
                                <button className="left" onClick={() => handleMove(-1, 0)}>⬅️</button>
                                <div className="center"></div>
                                <button className="right" onClick={() => handleMove(1, 0)}>➡️</button>
                            </div>
                            <button className="down" onClick={() => handleMove(0, 1)}>⬇️</button>
                        </div>
                    </div>
                </>
            )}

            <div className="water-guide">
                <h3>🌊 Surfing Guide</h3>
                <ul>
                    <li>🎮 Use controls to surf around</li>
                    <li>🌊 30% encounter rate per move</li>
                    <li>💎 15% treasure find rate</li>
                    <li>✨ 2% shiny chance!</li>
                </ul>
            </div>
        </div>
    );
}

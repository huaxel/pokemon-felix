import { useState, useEffect } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { MountainEntryView } from './components/MountainEntryView';
import { MountainHikeView } from './components/MountainHikeView';
import './MountainPage.css';

/**
 * MountainPage - Hiking system with altitude progression
 * Requires hiking boots (collected item)
 * Educational: Persistence, gradual progress, reward escalation
 */
export function MountainPage() {
    const { inventory, addItem, addCoins } = usePokemonContext();
    const [stage, setStage] = useState('entry'); // entry, hiking, resting, summit
    const [altitude, setAltitude] = useState(0);
    const [tiredness, setTiredness] = useState(0);
    const [foundPokemon, setFoundPokemon] = useState(null);
    const [message, setMessage] = useState('');

    // Mountain data - different Pokemon at different altitudes
    const ALTITUDE_STAGES = [
        {
            name: 'Foothills (0-500m)',
            altitude: 500,
            pokemon: ['pidgeot', 'mankey', 'growlithe'],
            item: 'hiking_boots',
            description: 'Gentle slopes covered in grass and small rocks',
            danger: 'Low'
        },
        {
            name: 'Lower Mountain (500-1000m)',
            altitude: 1000,
            pokemon: ['spearow', 'fearow', 'sandslash'],
            description: 'Steeper terrain with sparse vegetation',
            danger: 'Medium'
        },
        {
            name: 'Middle Mountain (1000-1500m)',
            altitude: 1500,
            pokemon: ['graveler', 'golem', 'cloyster'],
            description: 'Rocky slopes with thin air',
            danger: 'High'
        },
        {
            name: 'Peak (1500-2000m)',
            altitude: 2000,
            pokemon: ['articuno', 'zapdos', 'moltres'],
            description: 'The majestic summit with legendary Pokemon!',
            danger: 'Extreme'
        }
    ];

    /**
     * Check if player has hiking boots
     */
    const hasHikingBoots = () => {
        return (inventory && inventory.hiking_boots) || false;
    };

    /**
     * Start hiking
     */
    const handleStartHike = () => {
        if (!hasHikingBoots()) {
            setMessage('❌ You need hiking boots to climb the mountain! Find them first.');
            return;
        }
        setStage('hiking');
        setMessage('🏔️ You begin your climb...');
    };

    /**
     * Climb up (increases altitude and tiredness)
     */
    const handleClimb = async () => {
        const currentStageIndex = Math.floor(altitude / 500);
        if (currentStageIndex >= ALTITUDE_STAGES.length) {
            handleReachSummit();
            return;
        }

        const currentStageData = ALTITUDE_STAGES[currentStageIndex];
        const nextAltitude = currentStageIndex === 0 ? 500 : (currentStageIndex + 1) * 500;

        // Simulate climb - increase altitude and tiredness
        const newTiredness = tiredness + Math.floor(Math.random() * 30) + 15;
        setAltitude(nextAltitude);
        setTiredness(Math.min(100, newTiredness));

        // Random encounter
        if (Math.random() < 0.4) {
            const randomPokemon = currentStageData.pokemon[
                Math.floor(Math.random() * currentStageData.pokemon.length)
            ];
            const pokemonDetails = await getPokemonDetails(randomPokemon);
            setFoundPokemon(pokemonDetails);
            setMessage(`🔔 You encountered a ${pokemonDetails.name}!`);
        } else {
            setMessage(`📍 You climbed to ${nextAltitude}m`);
        }

        // Check if too tired
        if (newTiredness >= 100) {
            setStage('resting');
            setMessage('😫 You are exhausted! You must rest.');
        }
    };

    /**
     * Reach summit
     */
    const handleReachSummit = () => {
        setStage('summit');
        setMessage('🎉 You reached the summit! You earned 1000 coins and a rare candy!');
        addCoins(1000);
        addItem('rare_candy', 1);
        setTimeout(() => setStage('entry'), 5000);
    };

    /**
     * Rest and recover
     */
    const handleRest = () => {
        const newTiredness = Math.max(0, tiredness - 30);
        setTiredness(newTiredness);
        setMessage('😴 You rest and recover...');

        if (newTiredness === 0) {
            setStage('hiking');
            setMessage('✨ You feel refreshed! Ready to climb again?');
        }
    };

    /**
     * Catch found Pokemon
     */
    const handleCatchPokemon = async () => {
        if (!foundPokemon) return;

        const catchRate = 0.5;
        const success = Math.random() < catchRate;

        if (success) {
            // Add to collection
            addItem('pokeball', -1); // Use one pokeball
            setMessage(`✨ Caught ${foundPokemon.name}!`);
            addCoins(100);
            setFoundPokemon(null);
        } else {
            setMessage(`💨 ${foundPokemon.name} got away!`);
            setFoundPokemon(null);
        }
    };

    /**
     * Leave mountain
     */
    const handleExit = () => {
        setStage('entry');
        setAltitude(0);
        setTiredness(0);
        setFoundPokemon(null);
        setMessage('');
    };

    // Entry/Info screen
    if (stage === 'entry') {
        return (
            <MountainEntryView
                hasBoots={hasHikingBoots()}
                zones={ALTITUDE_STAGES}
                onStartHike={handleStartHike}
            />
        );
    }

    // Hiking/Combat stage
    if (stage === 'hiking') {
        const currentStageIndex = Math.floor(altitude / 500);
        const currentStage = ALTITUDE_STAGES[currentStageIndex];

        return (
            <MountainHikeView
                altitude={altitude}
                tiredness={tiredness}
                currentStage={currentStage}
                foundPokemon={foundPokemon}
                message={message}
                onExit={handleExit}
                onClimb={handleClimb}
                onRest={handleRest}
                onCatch={handleCatchPokemon}
                onPass={() => setFoundPokemon(null)}
            />
        );
    }

    // Rest stage
    if (stage === 'resting') {
        return (
            <div className="mountain-page resting">
                <div className="rest-scene">
                    <h2>😴 Resting at Camp</h2>
                    <p>You sit down and catch your breath...</p>
                    <div className="rest-progress">
                        <div className="rest-bar">
                            <div className="rest-fill" style={{ width: `${100 - tiredness}%` }}></div>
                        </div>
                        <p>Recovery: {100 - tiredness}%</p>
                    </div>
                    <button className="rest-btn" onClick={handleRest}>
                        ⏳ Rest More
                    </button>
                    {tiredness <= 30 && (
                        <button className="continue-btn" onClick={() => setStage('hiking')}>
                            ✨ Continue Climbing
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Summit victory
    if (stage === 'summit') {
        return (
            <div className="mountain-page summit">
                <div className="summit-scene">
                    <h1>🏔️ You Reached the Summit!</h1>
                    <div className="victory-message">
                        <p>The view is breathtaking! You can see for miles in every direction.</p>
                        <p>A legendary Pokemon watches you from the peak...</p>
                    </div>
                    <div className="rewards">
                        <div className="reward">
                            <span className="reward-icon">💰</span>
                            <span>1000 Coins</span>
                        </div>
                        <div className="reward">
                            <span className="reward-icon">🍭</span>
                            <span>Rare Candy</span>
                        </div>
                    </div>
                    <button className="btn-continue" onClick={handleExit}>
                        🌄 Descend Mountain
                    </button>
                </div>
            </div>
        );
    }
}

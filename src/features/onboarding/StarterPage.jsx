import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { usePlayer } from '../../hooks/usePlayer';
import { addToCollection } from '../../lib/api';
import { grassTile } from '../world/worldAssets';
import './StarterPage.css';

const STARTERS = [
    { id: 1, name: 'Bulbasaur', type: 'grass', description: 'Een Gras/Gif Pokémon. Hij draagt een zaadje op zijn rug dat groeit naarmate hij ouder wordt.' },
    { id: 4, name: 'Charmander', type: 'fire', description: 'Een Vuur Pokémon. De vlam op zijn staart toont zijn gezondheid en stemming.' },
    { id: 7, name: 'Squirtle', type: 'water', description: 'Een Water Pokémon. Zijn schild biedt niet alleen bescherming, maar helpt ook bij het zwemmen.' },
    { id: 25, name: 'Pikachu', type: 'electric', description: 'Een Elektrische Pokémon. Hij slaat elektriciteit op in zijn wangen om vijanden te schokken.' }
];

export function StarterPage() {
    const { setOwnedIds, addToSquad, addCoins, pokemonList, ownedIds } = usePokemonContext();
    const { hasProfile } = usePlayer();
    const navigate = useNavigate();
    const [selectedStarter, setSelectedStarter] = useState(null);
    const [isChoosing, setIsChoosing] = useState(false);

    useEffect(() => {
        if (!hasProfile) {
            navigate('/character-creation');
        } else if (ownedIds.length > 0) {
            navigate('/adventure');
        }
    }, [ownedIds, hasProfile, navigate]);

    const handleChoose = async () => {
        if (!selectedStarter || isChoosing) return;
        setIsChoosing(true);

        // Add to collection
        await addToCollection(selectedStarter.id);
        setOwnedIds(prev => [...prev, selectedStarter.id]);

        // Add to squad
        addToSquad(selectedStarter.id);

        // Bonus coins
        addCoins(100);

        // Go straight to the world map to start exploring
        setTimeout(() => {
            navigate('/adventure');
        }, 1500);
    };

    const getSprite = (id) => {
        const p = pokemonList.find(p => p.id === id);
        return p ? p.sprites.front_default : '';
    };

    return (
        <div className="starter-page" style={{ 
            backgroundImage: `url(${grassTile})`,
            backgroundSize: '64px',
            imageRendering: 'pixelated',
            fontFamily: '"Press Start 2P", cursive'
        }}>
            <div className="starter-content">
                <div className="starter-header">
                    <h1 style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", cursive' }}>Welkom, Trainer!</h1>
                    <p className="subtitle" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', lineHeight: '1.5' }}>Kies je eerste Pokémon partner om je avontuur te beginnen.</p>
                </div>

                <div className="starters-grid">
                    {STARTERS.map(starter => (
                        <div
                            key={starter.id}
                            className={`starter-card game-panel ${selectedStarter?.id === starter.id ? 'selected' : ''} ${starter.type}`}
                            onClick={() => setSelectedStarter(starter)}
                            style={{ fontFamily: '"Press Start 2P", cursive' }}
                        >
                            <div className="starter-image">
                                <img 
                                    src={getSprite(starter.id)} 
                                    alt={starter.name} 
                                    style={{ imageRendering: 'pixelated', width: '96px', height: '96px' }}
                                />
                            </div>
                            <h3 style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{starter.name}</h3>
                            <p style={{ fontSize: '0.6rem', lineHeight: '1.4', marginTop: '0.5rem' }}>{starter.description}</p>
                        </div>
                    ))}
                </div>

                {selectedStarter && (
                    <div className="action-area">
                        <button 
                            className="btn-kenney choose-btn" 
                            onClick={handleChoose} 
                            disabled={isChoosing}
                            style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', padding: '1rem 2rem' }}
                        >
                            {isChoosing ? 'Avontuur Starten...' : `Ik kies jou, ${selectedStarter.name}!`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { usePlayer } from '../../hooks/usePlayer';
import { addToCollection } from '../../lib/api';
import './StarterPage.css';

const STARTERS = [
    { id: 1, name: 'Bulbasaur', type: 'grass', description: 'Un Pokémon tipo Planta/Veneno. Lleva una semilla en su lomo desde que nace.' },
    { id: 4, name: 'Charmander', type: 'fire', description: 'Un Pokémon tipo Fuego. La llama de su cola indica su salud y estado de ánimo.' },
    { id: 7, name: 'Squirtle', type: 'water', description: 'Un Pokémon tipo Agua. Su caparazón no solo lo protege, también reduce la resistencia al agua.' },
    { id: 25, name: 'Pikachu', type: 'electric', description: 'Un Pokémon tipo Eléctrico. Almacena electricidad en sus mejillas para atacar.' }
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
        <div className="starter-page">
            <div className="starter-content">
                <h1>¡Bienvenido, Entrenador!</h1>
                <p className="subtitle">Para comenzar tu aventura, elige tu primer compañero Pokémon.</p>

                <div className="starters-grid">
                    {STARTERS.map(starter => (
                        <div
                            key={starter.id}
                            className={`starter-card ${selectedStarter?.id === starter.id ? 'selected' : ''} ${starter.type}`}
                            onClick={() => setSelectedStarter(starter)}
                        >
                            <div className="starter-image">
                                <img src={getSprite(starter.id)} alt={starter.name} />
                            </div>
                            <h3>{starter.name}</h3>
                            <p>{starter.description}</p>
                        </div>
                    ))}
                </div>

                {selectedStarter && (
                    <div className="action-area">
                        <button className="choose-btn" onClick={handleChoose} disabled={isChoosing}>
                            {isChoosing ? '¡Comenzando Aventura!' : `¡Yo te elijo, ${selectedStarter.name}!`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { Download, Upload } from 'lucide-react';
import { WorldPageHeader } from '../components/WorldPageHeader';
import fireStone from '../../../assets/items/fire_stone.png';
import waterStone from '../../../assets/items/water_stone.png';
// Placeholders for now
import thunderStone from '../../../assets/items/rare_candy.png';
import leafStone from '../../../assets/items/berry.png';
import moonStone from '../../../assets/items/mystery_box.png';


import './EvolutionHallPage.css';

const EVOLUTION_CHAINS = [
    { id: 1, name: 'Bulbasaur', evo: 'Ivysaur', level: 16, type: 'Grass', method: 'level' },
    { id: 4, name: 'Charmander', evo: 'Charmeleon', level: 16, type: 'Fire', method: 'level' },
    { id: 7, name: 'Squirtle', evo: 'Wartortle', level: 16, type: 'Water', method: 'level' },
    { id: 25, name: 'Pikachu', evo: 'Raichu', item: 'thunder_stone', type: 'Electric', method: 'stone' },
    { id: 39, name: 'Jigglypuff', evo: 'Wigglytuff', item: 'moon_stone', type: 'Normal', method: 'stone' },
    { id: 133, name: 'Eevee', evo: 'Vaporeon', item: 'water_stone', type: 'Normal', method: 'stone' },
    { id: 133, name: 'Eevee', evo: 'Jolteon', item: 'thunder_stone', type: 'Normal', method: 'stone' },
    { id: 133, name: 'Eevee', evo: 'Flareon', item: 'fire_stone', type: 'Normal', method: 'stone' },
];

const STONES = [
    { id: 'fire_stone', name: 'Piedra Fuego', price: 2000, img: fireStone, color: '#ef4444' },
    { id: 'water_stone', name: 'Piedra Agua', price: 2000, img: waterStone, color: '#3b82f6' },
    { id: 'thunder_stone', name: 'Piedra Trueno', price: 2000, img: thunderStone, color: '#eab308' },
    { id: 'leaf_stone', name: 'Piedra Hoja', price: 2000, img: leafStone, color: '#22c55e' },
    { id: 'moon_stone', name: 'Piedra Lunar', price: 3000, img: moonStone, color: '#a855f7' },
];

export function EvolutionHallPage() {
    const { pokemonList, ownedIds, addCoins, coins } = usePokemonContext();
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [, setEvolving] = useState(false);
    const { showSuccess, showError } = useToast();

    const [view, setView] = useState('evolve'); // evolve, shop

    const getEvolutionInfo = (pokemonId) => EVOLUTION_CHAINS.filter(e => e.id === pokemonId);

    const handleBuyStone = (stone) => {
        if (coins >= stone.price) {
            // addItem(stone.id, 1); // logic to add item
            addCoins(-stone.price);
            showSuccess(`¡Compraste ${stone.name}!`);
        } else {
            showError('No tienes suficientes monedas.');
        }
    };

    const handleEvolve = async (pokemon, evoOption) => {
        if (evoOption.method === 'stone') {
            // Logic to check if user has stone would go here
            // For now we assume they do or just let them evolve for free/coins as a simplified version
        }

        setEvolving(true);
        await new Promise(r => setTimeout(r, 2000));
        // addCoins(100); 
        // addItem('rare_candy');
        showSuccess(`¡${pokemon.name} evolucionó a ${evoOption.evo}! 🎉`);
        setEvolving(false); setSelectedPokemon(null);
    };

    const readyToEvolve = pokemonList.filter(p => ownedIds.includes(p.id) && EVOLUTION_CHAINS.some(e => e.id === p.id));

    return (
        <div className="evolution-hall-page">
            <WorldPageHeader title="Salón de Evolución" icon="✨" />

            <div className="evolution-chamber"><div className="chamber-glow" /><div className="chamber-text">⚡ Cámara de Energía ⚡</div></div>

            {view === 'shop' ? (
                <div className="stone-shop-grid">
                    {STONES.map(stone => (
                        <div key={stone.id} className="stone-card" style={{ borderColor: stone.color }}>
                            <img src={stone.img} alt={stone.name} />
                            <h3>{stone.name}</h3>
                            <button onClick={() => handleBuyStone(stone)}>
                                💰 {stone.price}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                !selectedPokemon ? (
                    <>
                        <div className="evolution-intro">
                            <h2>Bienvenido</h2>
                            <div className="mode-toggle">
                                <button className={view === 'evolve' ? 'active' : ''} onClick={() => setView('evolve')}>Evolucionar</button>
                                <button className={view === 'shop' ? 'active' : ''} onClick={() => setView('shop')}>Tienda de Piedras</button>
                            </div>
                        </div>
                        {/* ... guide ... */}
                        <div className="pokemon-grid">
                            {readyToEvolve.length === 0 ? <p>No tienes Pokémon listos.</p> : readyToEvolve.map(p => (
                                <div key={p.id} className="evo-pokemon-card" onClick={() => setSelectedPokemon(p)}>
                                    <img src={p.sprites?.front_default} alt={p.name} className="pokemon-sprite" />
                                    <h3>{p.name}</h3>
                                    {getEvolutionInfo(p.id).map(opt => (
                                        <div key={opt.evo} className="evo-preview-row">
                                            <span>{opt.method === 'stone' ? '💎' : '📈'}</span>
                                            <span>➡ {opt.evo}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="evolution-selection">
                        <h3>Elige la evolución para {selectedPokemon.name}</h3>
                        {getEvolutionInfo(selectedPokemon.id).map(opt => (
                            <button key={opt.evo} className="evo-choice-btn" onClick={() => handleEvolve(selectedPokemon, opt)}>
                                {opt.evo} ({opt.method === 'stone' ? `Requiere ${STONES.find(s => s.id === opt.item)?.name || 'Piedra'}` : `Nivel ${opt.level}`})
                            </button>
                        ))}
                        <button className="cancel-btn" onClick={() => setSelectedPokemon(null)}>Cancelar</button>
                    </div>
                )
            )}

            <div className="hall-stats">
                <div className="stat-box"><Upload size={24} /><span className="stat-value">{readyToEvolve.length}</span><span className="stat-label">Listos</span></div>
                <div className="stat-box"><Download size={24} /><span className="stat-value">{ownedIds.length}</span><span className="stat-label">Capturados</span></div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Sparkles, Download, Upload } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import { EvolutionDetail } from './components/EvolutionDetail';
import './EvolutionHallPage.css';

const EVOLUTION_CHAINS = [
    { id: 1, name: 'Bulbasaur', evo: 'Ivysaur', level: 16, type: 'Grass' },
    { id: 4, name: 'Charmander', evo: 'Charmeleon', level: 16, type: 'Fire' },
    { id: 7, name: 'Squirtle', evo: 'Wartortle', level: 16, type: 'Water' },
    { id: 25, name: 'Pikachu', evo: 'Raichu', level: 'Thunder Stone', type: 'Electric' },
    { id: 39, name: 'Jigglypuff', evo: 'Wigglytuff', level: 'Moon Stone', type: 'Normal' },
];

export function EvolutionHallPage() {
    const { pokemonList, ownedIds, addCoins, addItem } = usePokemonContext();
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [message, setMessage] = useState(null);
    const [evolving, setEvolving] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const getEvolutionInfo = (pokemonId) => EVOLUTION_CHAINS.find(e => e.id === pokemonId);

    const handleEvolve = async (pokemon) => {
        const evoInfo = getEvolutionInfo(pokemon.id);
        if (!evoInfo) {
            setMessage({ text: 'No evoluciona...', type: 'error' });
            return;
        }
        setEvolving(true);
        await new Promise(r => setTimeout(r, 2000));
        addCoins(100); addItem('rare_candy');
        setMessage({ text: `¡${pokemon.name} evolucionó! 🎉`, type: 'success' });
        setTimeout(() => setMessage(null), 3000);
        setEvolving(false); setSelectedPokemon(null);
    };

    const readyToEvolve = pokemonList.filter(p => ownedIds.includes(p.id) && getEvolutionInfo(p.id));

    return (
        <div className="evolution-hall-page">
            <header className="evolution-header">
                <Link to="/world" className="back-button"><img src={bagIcon} alt="Back" /></Link>
                <h1><Sparkles size={32} /> Salón de Evolución</h1>
            </header>

            {message && <div className={`evolution-message ${message.type}`}>{message.text}</div>}
            <div className="evolution-chamber"><div className="chamber-glow" /><div className="chamber-text">⚡ Cámara de Energía ⚡</div></div>

            {!selectedPokemon ? (
                <>
                    <div className="evolution-intro"><h2>Bienvenido</h2><p>Alcanza la verdadera potencia</p></div>
                    <button className="guide-btn" onClick={() => setShowGuide(!showGuide)}>{showGuide ? '📖 Ocultar Guía' : '📖 Ver Guía'}</button>
                    {showGuide && (
                        <div className="evolution-guide">
                            <h3>¿Cómo funciona?</h3>
                            <ul><li>🎯 Pokémon evolucionan a nivel específico o con ítem</li><li>📈 Ganas Caramelos Raros y monedas</li></ul>
                        </div>
                    )}
                    <div className="pokemon-grid">
                        {readyToEvolve.length === 0 ? <p>No tienes Pokémon listos.</p> : readyToEvolve.map(p => (
                            <div key={p.id} className="evo-pokemon-card" onClick={() => setSelectedPokemon(p)}>
                                <img src={p.sprites?.front_default} alt={p.name} className="pokemon-sprite" />
                                <h3>{p.name}</h3><div className="evo-arrow">⬇️</div><div className="evo-result">{getEvolutionInfo(p.id).evo}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <EvolutionDetail pokemon={selectedPokemon} evoInfo={getEvolutionInfo(selectedPokemon.id)} evolving={evolving} onEvolve={handleEvolve} onBack={() => setSelectedPokemon(null)} />
            )}

            <div className="hall-stats">
                <div className="stat-box"><Upload size={24} /><span className="stat-value">{readyToEvolve.length}</span><span className="stat-label">Listos</span></div>
                <div className="stat-box"><Download size={24} /><span className="stat-value">{ownedIds.length}</span><span className="stat-label">Capturados</span></div>
            </div>
        </div>
    );
}

import { Zap, Sparkles } from 'lucide-react';

export function EvolutionDetail({ pokemon, evoInfo, evolving, onEvolve, onBack }) {
    if (!evoInfo) return null;

    return (
        <div className="evolution-detail">
            <button className="back-detail-btn" onClick={onBack}>← Atrás</button>
            <div className="evo-display">
                <div className="pokemon-before">
                    <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
                    <h2>{pokemon.name}</h2>
                    <div className="stats">
                        {pokemon.stats?.slice(0, 3).map((s, idx) => (
                            <div key={idx} className="stat">
                                <span>{s.stat.name}</span>
                                <span className="stat-value">{s.base_stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="evolution-arrow-big"><Zap size={48} /></div>
                <div className="pokemon-after">
                    <h2>{evoInfo.evo}</h2>
                    <p className="evo-bonus">⬆️ +15% a todas las estadísticas</p>
                    <div className="rewards">
                        <span className="reward-item">💰 100 monedas</span>
                        <span className="reward-item">🍬 Caramelo Raro</span>
                    </div>
                </div>
            </div>
            <button className="evolve-btn" onClick={() => onEvolve(pokemon)} disabled={evolving}>
                {evolving ? (
                    <><Sparkles size={24} className="spinning" /> ¡Evolucionando!</>
                ) : (
                    <><Zap size={24} /> ¡Evolucionar Ahora!</>
                )}
            </button>
        </div>
    );
}

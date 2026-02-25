import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useDomainCollection, useData, useEconomy } from '../../../contexts/DomainContexts';
import { useGlobalActions } from '../../../hooks/useGlobalActions';
import evoImage from '../../../assets/buildings/evo_lab.png';
import bagIcon from '../../../assets/items/bag_icon.png';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import { EVOLUTIONS } from '../evolutionConfig';
import { useToast } from '../../../hooks/useToast';
import './EvolutionPage.css';

const EVOLUTION_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.GRASS;
    if (y === 3 && xIndex === 4) return TILE_TYPES.EVOLUTION;
    if (y === 4 && xIndex === 4) return TILE_TYPES.EVOLUTION;
    if (xIndex === 4) return TILE_TYPES.PATH;
    return TILE_TYPES.GRASS;
  }),
);

export function EvolutionPage() {
  const { ownedIds } = useDomainCollection();
  const { pokemonList } = useData();
  const { evolvePokemon } = useGlobalActions();
  const { coins } = useEconomy();
  const { addToast } = useToast();
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionResult, setEvolutionResult] = useState(null);

  // Filter evolvable pokemon
  const evolvable = pokemonList.filter(p => ownedIds.includes(p.id) && EVOLUTIONS[p.id.toString()]);

  const handleEvolve = async pokemon => {
    const targetId = parseInt(EVOLUTIONS[pokemon.id]);
    const targetPokemon = pokemonList.find(p => p.id === targetId);

    if (!targetPokemon) return;

    setIsEvolving(true);
    const success = await evolvePokemon(pokemon.id, targetId);

    if (success) {
      setTimeout(() => {
        setEvolutionResult({ from: pokemon, to: targetPokemon });
        setIsEvolving(false);
      }, 3000);
    } else {
      setIsEvolving(false);
      addToast('Niet genoeg munten! Evolutie kost 300 coins.', 'error');
    }
  };

  return (
    <div className="evolution-page">
      <header className="evo-header">
        <Link to="/adventure" className="back-btn">
          Terug naar Wereld
        </Link>
        <h1>Evolutie Hal</h1>
        <div className="coin-balance">
          <img src={bagIcon} alt="coins" className="coin-icon" /> {coins}
        </div>
      </header>

      <div className="evolution-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={EVOLUTION_GRID}
            onObjectClick={undefined}
            isNight={false}
            enableSky={false}
          />
        </Canvas>
      </div>

      {isEvolving && (
        <div className="evo-animation">
          <div className="white-glow"></div>
          <p className="evo-text">Wat gebeurt er? De Pokémon straalt!</p>
        </div>
      )}

      {evolutionResult && (
        <div className="result-overlay">
          <div className="result-card">
            <h2>Gefeliciteerd!</h2>
            <div className="evo-flex">
              <img src={evolutionResult.from.sprites.front_default} className="old-pk" alt="" />
              <span className="arrow-icon">→</span>
              <img src={evolutionResult.to.sprites.front_default} className="new-pk" alt="" />
            </div>
            <p>
              {evolutionResult.from.name} is geëvolueerd in {evolutionResult.to.name}!
            </p>
            <button className="confirm-btn" onClick={() => setEvolutionResult(null)}>
              Geweldig!
            </button>
          </div>
        </div>
      )}

      <div className="evo-intro">
        <img src={evoImage} className="evo-promo-img" alt="Lab" />
        <p>
          Evolueer je Pokémon naar hun sterkere vorm voor 300 munten. Bekijk wie er klaar voor is!
        </p>
      </div>

      <div className="pokemon-grid">
        {evolvable.length === 0 ? (
          <p className="empty-msg">Geen van je Pokémon kan nu evolueren...</p>
        ) : (
          evolvable.map(pokemon => {
            const nextId = EVOLUTIONS[pokemon.id];
            const nextPk = pokemonList.find(p => p.id === parseInt(nextId));
            return (
              <div key={pokemon.id} className="evo-card">
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <h3>{pokemon.name}</h3>
                <div className="evo-to">→ {nextPk?.name}</div>
                <button className="evolve-btn" onClick={() => handleEvolve(pokemon)}>
                  Evolueer 300 coins
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

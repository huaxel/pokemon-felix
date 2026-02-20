import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDomainCollection, useData, useEconomy } from '../../../contexts/DomainContexts';
import { useGlobalActions } from '../../../hooks/useGlobalActions';
import evoImage from '../../../assets/buildings/evo_lab.png';
import bagIcon from '../../../assets/items/bag_icon.png';
import './EvolutionPage.css';

// Simplified evolution mapping for standard Pokemon
const EVOLUTIONS = {
  1: '2',
  2: '3', // Bulbasaur -> Ivysaur -> Venusaur
  4: '5',
  5: '6', // Charmander -> Charmeleon -> Charizard
  7: '8',
  8: '9', // Squirtle -> Wartortle -> Blastoise
  10: '11',
  11: '12', // Caterpie -> Metapod -> Butterfree
  13: '14',
  14: '15', // Weedle -> Kakuna -> Beedrill
  16: '17',
  17: '18', // Pidgey -> Pidgeotto -> Pidgeot
  19: '20', // Rattata -> Raticate
  21: '22', // Spearow -> Fearow
  23: '24', // Ekans -> Arbok
  25: '26', // Pikachu -> Raichu
  27: '28', // Sandshrew -> Sandslash
  29: '30',
  30: '31', // NidoranF -> Nidorina -> Nidoqueen
  32: '33',
  33: '34', // NidoranM -> Nidorino -> Nidoking
  37: '38', // Vulpix -> Ninetales
  39: '40', // Jigglypuff -> Wigglytuff
  41: '42', // Zubat -> Golbat
  43: '44',
  44: '45', // Oddish -> Gloom -> Vileplume
  46: '47', // Paras -> Parasect
  48: '49', // Venonat -> Venomoth
  50: '51', // Diglett -> Dugtrio
  52: '53', // Meowth -> Persian
  54: '55', // Psyduck -> Golduck
  56: '57', // Mankey -> Primeape
  58: '59', // Growlithe -> Arcanine
  60: '61',
  61: '62', // Poliwag -> Poliwhirl -> Poliwrath
  63: '64',
  64: '65', // Abra -> Kadabra -> Alakazam
  66: '67',
  67: '68', // Machop -> Machoke -> Machamp
  69: '70',
  70: '71', // Bellsprout -> Weepinbell -> Victreebel
  72: '73', // Tentacool -> Tentacruel
  74: '75',
  75: '76', // Geodude -> Graveler -> Golem
  77: '78', // Ponyta -> Rapidash
  79: '80', // Slowpoke -> Slowbro
  81: '82', // Magnemite -> Magneton
  84: '85', // Doduo -> Dodrio
  86: '87', // Seel -> Dewgong
  88: '89', // Grimer -> Muk
  90: '91', // Shellder -> Cloyster
  92: '93',
  93: '94', // Gastly -> Haunter -> Gengar
  95: '95', // Onix doesn't evolve in Gen 1 (simplified)
  98: '99', // Krabby -> Kingler
  100: '101', // Voltorb -> Electrode
  102: '103', // Exeggcute -> Exeggutor
  104: '105', // Cubone -> Marowak
  109: '110', // Koffing -> Weezing
  111: '112', // Rhyhorn -> Rhydon
  116: '117', // Horsea -> Seadra
  118: '119', // Goldeen -> Seaking
  120: '121', // Staryu -> Starmie
  129: '130', // Magikarp -> Gyarados
  133: '134', // Eevee -> Vaporeon (simplified to one path)
  138: '139', // Omanyte -> Omastar
  140: '141', // Kabuto -> Kabutops
  147: '148',
  148: '149', // Dratini -> Dragonair -> Dragonite
};

import { useToast } from '../../../hooks/useToast';
// ... (imports)

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

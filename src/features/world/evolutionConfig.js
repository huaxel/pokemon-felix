import {
  fireStone,
  waterStone,
  thunderStone,
  leafStone,
  moonStone,
} from './worldAssets';

export const EVOLUTION_CHAINS = [
  { id: 1, name: 'Bulbasaur', evo: 'Ivysaur', level: 16, type: 'Grass', method: 'level' },
  { id: 4, name: 'Charmander', evo: 'Charmeleon', level: 16, type: 'Fire', method: 'level' },
  { id: 7, name: 'Squirtle', evo: 'Wartortle', level: 16, type: 'Water', method: 'level' },
  {
    id: 25,
    name: 'Pikachu',
    evo: 'Raichu',
    item: 'thunder_stone',
    type: 'Electric',
    method: 'stone',
  },
  {
    id: 39,
    name: 'Jigglypuff',
    evo: 'Wigglytuff',
    item: 'moon_stone',
    type: 'Normal',
    method: 'stone',
  },
  { id: 133, name: 'Eevee', evo: 'Vaporeon', item: 'water_stone', type: 'Normal', method: 'stone' },
  {
    id: 133,
    name: 'Eevee',
    evo: 'Jolteon',
    item: 'thunder_stone',
    type: 'Normal',
    method: 'stone',
  },
  { id: 133, name: 'Eevee', evo: 'Flareon', item: 'fire_stone', type: 'Normal', method: 'stone' },
];

export const STONES = [
  { id: 'fire_stone', name: 'Vuursteen', price: 2000, img: fireStone, color: '#ef4444' },
  { id: 'water_stone', name: 'Watersteen', price: 2000, img: waterStone, color: '#3b82f6' },
  { id: 'thunder_stone', name: 'Dondersteen', price: 2000, img: thunderStone, color: '#eab308' },
  { id: 'leaf_stone', name: 'Bladsteen', price: 2000, img: leafStone, color: '#22c55e' },
  { id: 'moon_stone', name: 'Maansteen', price: 3000, img: moonStone, color: '#a855f7' },
];

export const EVOLUTIONS = {
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

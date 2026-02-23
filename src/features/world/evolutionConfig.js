import { fireStone, waterStone, thunderStone, leafStone, moonStone } from './worldAssets';

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

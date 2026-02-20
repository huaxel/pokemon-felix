export const ALTITUDE_STAGES = [
  {
    name: 'Voet van de Berg (0-500m)',
    altitude: 500,
    pokemon: ['pidgeot', 'mankey', 'growlithe'],
    item: 'hiking_boots',
    description: 'Glooiende hellingen bedekt met gras en kleine rotsen',
    danger: 'Laag',
  },
  {
    name: 'Lage Berg (500-1000m)',
    altitude: 1000,
    pokemon: ['spearow', 'fearow', 'sandslash'],
    description: 'Steiler terrein met weinig begroeiing',
    danger: 'Gemiddeld',
  },
  {
    name: 'Midden Berg (1000-1500m)',
    altitude: 1500,
    pokemon: ['graveler', 'golem', 'cloyster'],
    description: 'Rotsachtige hellingen met ijle lucht',
    danger: 'Hoog',
  },
  {
    name: 'Bergtop (1500-2000m)',
    altitude: 2000,
    pokemon: ['articuno', 'zapdos', 'moltres'],
    description: 'De majestueuze top met legendarische Pokémon!',
    danger: 'Extreem',
  },
];

import {
  pokeballTile as pokeballImage,
  greatballIcon as greatballImage,
  ultraballIcon as ultraballImage,
  potionIcon as potionImage,
  superPotionIcon as superPotionImage,
  rareCandyIcon as rareCandyImage,
  mysteryBoxIcon as mysteryBoxImage,
  berryIcon as oranBerryImage,
  sitrusBerryIcon as sitrusBerryImage,
  razzBerryIcon as razzBerryImage,
} from './worldAssets';

export const SHOP_ITEMS = {
  pokeballs: [
    {
      id: 'pokeball',
      name: 'Poké Ball',
      price: 100,
      description: 'Standaard bal om Pokémon te vangen.',
      image: pokeballImage,
    },
    {
      id: 'greatball',
      name: 'Super Ball',
      price: 250,
      description: 'Effectiever dan de Poké Ball.',
      image: greatballImage,
    },
    {
      id: 'ultraball',
      name: 'Ultra Ball',
      price: 500,
      description: 'Hoge vangkans.',
      image: ultraballImage,
    },
  ],
  potions: [
    {
      id: 'potion',
      name: 'Potion',
      price: 200,
      description: 'Geneest een beetje HP.',
      image: potionImage,
    },
    {
      id: 'super-potion',
      name: 'Super Potion',
      price: 400,
      description: 'Geneest meer HP.',
      image: superPotionImage,
    },
  ],
  berries: [
    {
      id: 'berry',
      name: 'Oran Bes',
      price: 50,
      description: 'Herstelt 30 HP.',
      image: oranBerryImage,
    },
    {
      id: 'sitrus-berry',
      name: 'Sitrus Bes',
      price: 100,
      description: 'Herstelt 80 HP.',
      image: sitrusBerryImage,
    },
    {
      id: 'razz-berry',
      name: 'Frambu Bes',
      price: 150,
      description: 'Maakt vangen makkelijker.',
      image: razzBerryImage,
    },
  ],
  special: [
    {
      id: 'rare-candy',
      name: 'Zeldzaam Snoepje',
      price: 1000,
      description: 'Verhoogt level.',
      image: rareCandyImage,
    },
    {
      id: 'mystery-box',
      name: 'Mysterieuze Doos',
      price: 500,
      description: 'Wat zit erin?',
      image: mysteryBoxImage,
    },
  ],
};

export const ECONOMICS_TIPS = [
  '💡 Tip: Sterkere Pokémon zijn meer munten waard!',
  '💡 Tip: Spaar voor speciale items.',
  '💡 Tip: Dubbele Pokémon verkopen is een goede manier om te verdienen.',
  '💡 Tip: Legendarische Pokémon zijn veel meer waard op de markt.',
];

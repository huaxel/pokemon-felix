export const PALACE_CHALLENGES = [
  {
    id: 'wisdom',
    name: 'Test van Wijsheid',
    icon: '🧠',
    description: 'Beantwoord Pokémon trivia correct',
    cost: 0,
    reward: { coins: 200, item: 'rare_candy' },
    difficulty: 'medium',
  },
  {
    id: 'strength',
    name: 'Test van Kracht',
    icon: '💪',
    description: 'Versla een legendarische Pokémon',
    cost: 100,
    reward: { coins: 500, legendary: true },
    difficulty: 'hard',
  },
  {
    id: 'luck',
    name: 'Test van Geluk',
    icon: '🎲',
    description: 'Rol de koninklijke dobbelstenen',
    cost: 50,
    reward: { coins: 300, item: 'mystery_box' },
    difficulty: 'easy',
  },
];

export const TRIVIA_QUESTIONS = [
  {
    question: 'Welk type is Pikachu?',
    options: ['Elektrisch', 'Vuur', 'Water', 'Gras'],
    answer: 0,
  },
  { question: 'Hoeveel Pokémon types zijn er?', options: ['16', '17', '18', '19'], answer: 2 },
  {
    question: 'Welke Pokémon is de Legendarische Vuurvogel?',
    options: ['Articuno', 'Zapdos', 'Moltres', 'Mewtwo'],
    answer: 2,
  },
  {
    question: 'Waarin evolueert Eevee met een Watersteen?',
    options: ['Vaporeon', 'Jolteon', 'Flareon', 'Espeon'],
    answer: 0,
  },
  {
    question: 'Wat is de Gras-starter van Kanto?',
    options: ['Charmander', 'Squirtle', 'Bulbasaur', 'Pikachu'],
    answer: 2,
  },
  {
    question: 'Welke aanval mist nooit?',
    options: ['Thunderbolt', 'Thunder Shock', 'Quick Attack', 'Swift'],
    answer: 3,
  },
  {
    question: 'Welke Pokémon is nummer 001 in de Pokédex?',
    options: ['Pikachu', 'Mew', 'Bulbasaur', 'Charizard'],
    answer: 2,
  },
  {
    question: 'Welk type is super effectief tegen Draak?',
    options: ['Vuur', 'Water', 'IJs', 'Elektrisch'],
    answer: 2,
  },
];

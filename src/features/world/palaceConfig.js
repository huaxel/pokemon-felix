export const PALACE_CHALLENGES = [
    {
        id: 'wisdom',
        name: 'Prueba de Sabiduría',
        icon: '🧠',
        description: 'Responde correctamente trivia de Pokémon',
        cost: 0,
        reward: { coins: 200, item: 'rare_candy' },
        difficulty: 'medium'
    },
    {
        id: 'strength',
        name: 'Prueba de Fuerza',
        icon: '💪',
        description: 'Derrota a un Pokémon legendario',
        cost: 100,
        reward: { coins: 500, legendary: true },
        difficulty: 'hard'
    },
    {
        id: 'luck',
        name: 'Prueba de Suerte',
        icon: '🎲',
        description: 'Lanza los dados reales del campeón',
        cost: 50,
        reward: { coins: 300, item: 'mystery_box' },
        difficulty: 'easy'
    }
];

export const TRIVIA_QUESTIONS = [
    { question: '¿Qué tipo es Pikachu?', options: ['Eléctrico', 'Fuego', 'Agua', 'Planta'], answer: 0 },
    { question: '¿Cuántos tipos de Pokémon existen?', options: ['16', '17', '18', '19'], answer: 2 },
    { question: '¿Qué Pokémon es conocido como el Pokémon Legendario del Fuego?', options: ['Articuno', 'Zapdos', 'Moltres', 'Mewtwo'], answer: 2 },
    { question: '¿En qué se convierte Eevee con una Piedra Agua?', options: ['Vaporeon', 'Jolteon', 'Flareon', 'Espeon'], answer: 0 },
    { question: '¿Cuál es el Pokémon inicial de tipo Planta en Kanto?', options: ['Charmander', 'Squirtle', 'Bulbasaur', 'Pikachu'], answer: 2 },
    { question: '¿Qué movimiento tiene 100% de precisión y nunca falla?', options: ['Rayo', 'Impactrueno', 'Ataque Rápido', 'Hidrobomba'], answer: 2 },
    { question: '¿Cuál es el Pokémon con el número 001 en la Pokédex?', options: ['Pikachu', 'Mew', 'Bulbasaur', 'Charizard'], answer: 2 },
    { question: '¿Qué tipo es súper efectivo contra Dragón?', options: ['Fuego', 'Agua', 'Hielo', 'Eléctrico'], answer: 2 },
];

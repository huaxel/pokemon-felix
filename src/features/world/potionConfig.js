export const INGREDIENTS = [
  { id: 'oran', name: 'Baya Aranja', value: 5, color: '#3b82f6', emoji: '🔵' },
  { id: 'sitrus', name: 'Baya Sitrus', value: 10, color: '#eab308', emoji: '🟡' },
  { id: 'pecha', name: 'Baya Meloc', value: 3, color: '#ec4899', emoji: '🟣' },
  { id: 'rawst', name: 'Raíz Amarga', value: -4, color: '#8b5cf6', emoji: '🟤' },
  { id: 'cheri', name: 'Baya Zreza', value: 8, color: '#ef4444', emoji: '🔴' },
  { id: 'aspear', name: 'Baya Safre', value: -2, color: '#06b6d4', emoji: '⚪' },
];

export const DIFFICULTIES = {
  EASY: { name: 'Fácil', range: [10, 30], ingredients: 3, reward: 50 },
  MEDIUM: { name: 'Medio', range: [20, 50], ingredients: 4, reward: 100 },
  HARD: { name: 'Difícil', range: [30, 80], ingredients: 5, reward: 200 },
};

const STORAGE_KEY = 'pokeInventory';

export async function getInventory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      'pokeball': 5,
      'greatball': 0,
      'ultraball': 0,
      'masterball': 0,
      'rare-candy': 0,
      'mystery-box': 0
    };
  } catch (err) {
    console.error('Failed to read inventory', err);
    return {};
  }
}

export async function saveInventory(inventory) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (err) {
    console.error('Failed to save inventory', err);
  }
}

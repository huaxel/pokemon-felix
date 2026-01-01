const STORAGE_KEY = 'pokeQuests';

export async function getQuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read quests', err);
    return [];
  }
}

export async function saveQuests(quests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
  } catch (err) {
    console.error('Failed to save quests', err);
  }
}

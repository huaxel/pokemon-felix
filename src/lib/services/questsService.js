import { STORAGE_KEYS } from '../constants';

export async function getQuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read quests', err);
    return [];
  }
}

export async function saveQuests(quests) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch (err) {
    console.error('Failed to save quests', err);
  }
}

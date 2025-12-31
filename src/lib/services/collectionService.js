import * as api from '../api';

const RETRIES = 2;

async function retry(fn, times = RETRIES) {
  let lastError;
  for (let i = 0; i <= times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export async function getCollection() {
  return retry(() => api.getCollection());
}

export async function addToCollection(id) {
  // Basic validation
  if (typeof id !== 'number') throw new TypeError('id must be a number');
  return retry(() => api.addToCollection(id));
}

export async function removeFromCollection(id) {
  if (typeof id !== 'number') throw new TypeError('id must be a number');
  return retry(() => api.removeFromCollection(id));
}

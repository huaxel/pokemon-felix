import * as api from '../api';
import { handleAsyncError } from '../errorHandler';

export async function getCollection() {
  try {
    return await api.getCollection();
  } catch (error) {
    handleAsyncError(error, 'getCollection');
    throw error;
  }
}

export async function addToCollection(id) {
  // Basic validation
  if (typeof id !== 'number') throw new TypeError('id must be a number');
  
  try {
    return await api.addToCollection(id);
  } catch (error) {
    handleAsyncError(error, 'addToCollection', { message: `Failed to add Pokemon ${id}` });
    throw error;
  }
}

export async function removeFromCollection(id) {
  if (typeof id !== 'number') throw new TypeError('id must be a number');
  
  try {
    return await api.removeFromCollection(id);
  } catch (error) {
    handleAsyncError(error, 'removeFromCollection', { message: `Failed to remove Pokemon ${id}` });
    throw error;
  }
}

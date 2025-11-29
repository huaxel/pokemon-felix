const BASE_URL = import.meta.env.VITE_POKEMON_API_URL || 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
  }

  const data = await response.json();

  // Fetch details for each pokemon to get the image AND species data for names
  const detailedPromises = data.results.map(async (pokemon) => {
    try {
      const res = await fetch(pokemon.url);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${pokemon.name}: ${res.status}`);
      }
      const details = await res.json();

      // Fetch species data
      const speciesRes = await fetch(details.species.url);
      if (!speciesRes.ok) {
        console.warn(`Failed to fetch species data for ${pokemon.name}`);
        return { ...details, speciesData: null };
      }
      const speciesData = await speciesRes.json();

      return {
        ...details,
        speciesData
      };
    } catch (error) {
      console.error(`Error fetching ${pokemon.name}:`, error);
      return null;
    }
  });

  const results = await Promise.allSettled(detailedPromises);

  // Filter out failed requests and null values
  return results
    .filter(result => result.status === 'fulfilled' && result.value !== null)
    .map(result => result.value);
}

export async function getPokemonDetails(name) {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${name}: ${response.status}`);
  }

  const details = await response.json();

  // Fetch species data for multilingual info
  const speciesResponse = await fetch(details.species.url);

  if (!speciesResponse.ok) {
    console.warn(`Failed to fetch species data for ${name}`);
    return { ...details, speciesData: null };
  }

  const speciesData = await speciesResponse.json();

  return {
    ...details,
    speciesData
  };
}

export async function getAllPokemonNames() {
  const response = await fetch(`${BASE_URL}/pokemon?limit=10000`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon names: ${response.status}`);
  }

  const data = await response.json();
  return data.results.map(p => p.name);
}

// Collection Persistence (JSON Server)
const DB_URL = import.meta.env.VITE_DB_URL || 'http://localhost:3001/collection';

export async function getCollection() {
  try {
    const response = await fetch(DB_URL);
    if (!response.ok) throw new Error('Failed to fetch collection');
    const data = await response.json();
    return data.map(item => item.id);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return [];
  }
}

export async function addToCollection(id) {
  try {
    await fetch(DB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  } catch (error) {
    console.error("Error adding to collection:", error);
  }
}

export async function removeFromCollection(id) {
  try {
    // First find the item ID (json-server assigns a unique id to each entry, which might differ from pokemon id if we didn't set it explicitly, but here we used 'id' as the pokemon id)
    // However, json-server expects DELETE /collection/:id where :id is the id of the record.
    // Since we stored { "id": 6 }, the record ID IS the pokemon ID.
    await fetch(`${DB_URL}/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error("Error removing from collection:", error);
  }
}

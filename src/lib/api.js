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

// Collection Persistence (localStorage)
const STORAGE_KEY = 'pokemon_collection';

export async function getCollection() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error fetching collection:", error);
    return [];
  }
}

export async function addToCollection(id) {
  try {
    const current = await getCollection();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Error adding to collection:", error);
  }
}

export async function removeFromCollection(id) {
  try {
    const current = await getCollection();
    const updated = current.filter(itemId => itemId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing from collection:", error);
  }
}

export async function getMoveDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      name: data.names.find(n => n.language.name === 'es')?.name || data.name,
      type: data.type.name,
      power: data.power || 40, // Default to 40 if null (status moves)
      accuracy: data.accuracy || 100,
      pp: data.pp
    };
  } catch (error) {
    console.error("Error fetching move:", error);
    return null;
  }
}

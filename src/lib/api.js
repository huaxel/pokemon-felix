const BASE_URL = import.meta.env.VITE_POKEMON_API_URL || 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
  }

  const data = await response.json();

  // Return a lightweight but compatible shape for list views to avoid N+1 fetches.
  // We build an id and an artwork URL from the item URL.
  const list = data.results.map(pokemon => {
    // pokemon.url usually ends with "/{id}/"
    const parts = pokemon.url.split('/').filter(Boolean);
    const id = parseInt(parts[parts.length - 1], 10);
    const artwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    return {
      id,
      name: pokemon.name,
      url: pokemon.url,
      sprites: {
        other: {
          'official-artwork': {
            front_default: artwork,
          },
        },
        front_default: artwork,
      },
      speciesData: null, // keep field for compatibility; fetch on demand in getPokemonDetails
    };
  });

  return list;
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
    speciesData,
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
      pp: data.pp,
    };
  } catch (error) {
    console.error('Error fetching move:', error);
    return null;
  }
}
export async function getTrainer(id) {
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/trainers/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function getRelationship(playerId, trainerId) {
  const id = `${playerId}-${trainerId}`;
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/relationships/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function updateRelationship(playerId, trainerId, delta) {
  const id = `${playerId}-${trainerId}`;
  const current = await getRelationship(playerId, trainerId);
  
  if (!current) return null;

  const updated = {
    ...current,
    friendship_score: Math.max(0, Math.min(100, current.friendship_score + (delta.friendship || 0))),
    rivalry_score: Math.max(0, Math.min(100, current.rivalry_score + (delta.rivalry || 0))),
    last_interaction: new Date().toISOString()
  };

  const response = await fetch(`${import.meta.env.VITE_DB_URL}/relationships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  });

  return response.json();
}

export async function getMessages(playerId, trainerId) {
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/messages?player_id=${playerId}&trainer_id=${trainerId}`);
  if (!response.ok) return [];
  return response.json();
}

export async function saveMessage(playerId, trainerId, role, content) {
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player_id: playerId,
      trainer_id: trainerId,
      role,
      content,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
}

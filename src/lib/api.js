const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  
  // Fetch details for each pokemon to get the image
  const detailedPromises = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return res.json();
  });

  return Promise.all(detailedPromises);
}

export async function getPokemonDetails(name) {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  const details = await response.json();
  
  // Fetch species data for multilingual info
  const speciesResponse = await fetch(details.species.url);
  const speciesData = await speciesResponse.json();
  
  return {
    ...details,
    speciesData
  };
}

export async function getAllPokemonNames() {
  const response = await fetch(`${BASE_URL}/pokemon?limit=10000`);
  const data = await response.json();
  return data.results.map(p => p.name);
}

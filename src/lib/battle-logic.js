// Helper to get a stat from a Pokemon object
export const getStat = (pokemon, statName) => {
    if (!pokemon || !pokemon.stats) return 10;
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 10;
};

// Calculate max HP for battle (boosted by 3x for longer fights)
export const calculateMaxHP = (pokemon) => {
    return getStat(pokemon, 'hp') * 3;
};

// Calculate damage for a single attack
export const calculateDamage = (attacker, defender) => {
    const att = getStat(attacker, 'attack');
    const def = getStat(defender, 'defense');

    // Damage formula: (Attack * 1.5) - (Defense * 0.5) + Random(0-10)
    // Minimum damage is 5 to prevent stalemates
    const damage = Math.max(5, Math.floor((att * 1.5) - (def * 0.5) + (Math.random() * 10)));
    
    return damage;
};

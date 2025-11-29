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
// Simplified Type Chart
const TYPE_CHART = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, ghost: 0, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, fairy: 2, steel: 0.5 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

export const getEffectiveness = (attackerType, defenderType) => {
    if (!attackerType || !defenderType) return 1;
    const attackerChart = TYPE_CHART[attackerType.toLowerCase()];
    if (!attackerChart) return 1;
    return attackerChart[defenderType.toLowerCase()] !== undefined ? attackerChart[defenderType.toLowerCase()] : 1;
};

// Calculate damage for a single attack
export const calculateDamage = (attacker, defender) => {
    const att = getStat(attacker, 'attack');
    const def = getStat(defender, 'defense');

    // Get primary types (simplified to first type for now)
    const attackerType = attacker.types[0].type.name;
    const defenderType = defender.types[0].type.name;

    const effectiveness = getEffectiveness(attackerType, defenderType);

    // Damage formula: (Attack * 1.5) - (Defense * 0.5) + Random(0-10)
    // Multiplied by Type Effectiveness
    let baseDamage = Math.max(5, Math.floor((att * 1.5) - (def * 0.5) + (Math.random() * 10)));
    const finalDamage = Math.floor(baseDamage * effectiveness);

    return { damage: finalDamage, effectiveness };
};

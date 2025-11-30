// Helper to get a stat from a Pokemon object
export const getStat = (pokemon, statName) => {
    if (!pokemon || !pokemon.stats) return 10;
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 10;
};

// Calculate max HP for battle (TCG Style: ~20 HP)
export const calculateMaxHP = (pokemon) => {
    // Base HP usually ranges 40-100. Dividing by 5 gives ~8-20 HP.
    return Math.floor(getStat(pokemon, 'hp') / 4) + 10;
};

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

// Calculate damage for a single attack (TCG Style: 1-5 Damage)
export const calculateDamage = (attacker, defender, move) => {
    // Use move type if available, otherwise fallback to Pokemon type
    const attackType = move ? move.type : attacker.types[0].type.name;
    const defenderType = defender.types[0].type.name;

    const effectiveness = getEffectiveness(attackType, defenderType);

    // TCG Damage Scale based on Power
    // Power < 50: 1 Dmg
    // Power < 75: 2 Dmg
    // Power < 100: 3 Dmg
    // Power < 125: 4 Dmg
    // Power >= 125: 5 Dmg

    const power = move ? move.power : 40;
    let baseDamage = 1;

    if (power >= 125) baseDamage = 5;
    else if (power >= 100) baseDamage = 4;
    else if (power >= 75) baseDamage = 3;
    else if (power >= 50) baseDamage = 2;

    // Apply Effectiveness (TCG Style: +1 or -1 Damage, min 1)
    let finalDamage = baseDamage;

    if (effectiveness > 1) finalDamage += 1; // Super effective = +1 Dmg
    else if (effectiveness < 1 && effectiveness > 0) finalDamage = Math.max(1, finalDamage - 1); // Not very effective = -1 Dmg (min 1)
    else if (effectiveness === 0) finalDamage = 0; // Immune

    return { damage: finalDamage, effectiveness, baseDamage };
};

// Calculate Energy Cost based on Damage (1-3 Energy)
export const calculateEnergyCost = (baseDamage) => {
    if (baseDamage >= 4) return 3;
    if (baseDamage >= 2) return 2;
    return 1;
};

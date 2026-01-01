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
    // Guard missing data: default to normal typing
    const attackerTypeSafe = attacker?.types?.[0]?.type?.name || 'normal';
    const defenderTypeSafe = defender?.types?.[0]?.type?.name || 'normal';

    // Use move type if available, otherwise fallback to Pokemon type
    const attackType = move ? move.type : attackerTypeSafe;
    const defenderType = defenderTypeSafe;

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
// Calculate Energy Cost based on Damage (1-3 Energy)
export const calculateEnergyCost = (baseDamage) => {
    if (baseDamage >= 5) return 4;
    if (baseDamage >= 4) return 3;
    if (baseDamage >= 2) return 2;
    return 1;
};

// --- NEW CARD BATTLE SYSTEM HELPERS ---

export const getTypeColor = (type) => {
    switch(type) {
        case 'fire': return '#ef4444'; // Red
        case 'grass': return '#22c55e'; // Green
        case 'water': return '#3b82f6'; // Blue
        case 'electric': return '#eab308'; // Yellow
        case 'psychic': return '#a855f7'; // Purple
        case 'rock': case 'ground': return '#78350f'; // Brown
        case 'ice': return '#67e8f9'; // Cyan
        case 'dragon': return '#6366f1'; // Indigo
        case 'dark': return '#1e293b'; // Slate
        case 'fairy': return '#f472b6'; // Pink
        case 'fighting': return '#ea580c'; // Orange
        case 'poison': return '#9333ea'; // Violet
        case 'bug': return '#65a30d'; // Lime
        case 'ghost': return '#4c1d95'; // Deep Purple
        case 'steel': return '#94a3b8'; // Blue Gray
        default: return '#64748b'; // Gray (Normal)
    }
};

/**
 * Combines two moves into a new special move
 */
export const combineMoves = (move1, move2) => {
    const isSameType = move1.type === move2.type;
    // Discounted cost for combining: (Cost1 + Cost2) - 1, min 2
    const cost1 = move1.cost || calculateEnergyCost(move1.power || 40);
    const cost2 = move2.cost || calculateEnergyCost(move2.power || 40);
    const combinedCost = Math.max(2, cost1 + cost2 - 1);

    // Calculate combined power
    const pow1 = move1.power || 40;
    const pow2 = move2.power || 40;

    const newMove = {
        cost: combinedCost,
        isCombo: true,
        accuracy: Math.min(move1.accuracy || 100, move2.accuracy || 100)
    };

    if (isSameType) {
        newMove.name = `MEGA ${move1.name}`;
        newMove.type = move1.type;
        newMove.power = Math.floor((pow1 + pow2) * 1.2); // 20% bonus
        newMove.description = "Type Fusion! Massive Damage!";
    } else if ((move1.type === 'fire' && move2.type === 'water') || (move1.type === 'water' && move2.type === 'fire')) {
        newMove.name = 'Steam Eruption';
        newMove.type = 'water';
        newMove.power = 100;
        newMove.description = "Scalding steam burns the opponent.";
    } else if ((move1.type === 'electric' && move2.type === 'water') || (move1.type === 'water' && move2.type === 'electric')) {
        newMove.name = 'Thunder Storm';
        newMove.type = 'electric';
        newMove.power = 110;
        newMove.description = "Electrified water conducts perfectly.";
    } else {
        // Generic Combo
        newMove.name = `${move1.name} & ${move2.name}`;
        newMove.type = move1.type; // Inherit from first
        newMove.power = Math.floor(pow1 + pow2);
        newMove.description = "Tactical combination attack.";
    }
    
    return newMove;
};

/**
 * Advanced Damage Calculation with Anti-Spam logic
 */
// --- MOVE LOGIC ---

// Simple move pool for development/fallback
const MOVE_POOL = {
    normal: [
        { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, cost: 1 },
        { name: 'Scratch', type: 'normal', power: 40, accuracy: 100, cost: 1 },
        { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, cost: 1 },
        { name: 'Slam', type: 'normal', power: 80, accuracy: 75, cost: 3 },
        { name: 'Hyper Beam', type: 'normal', power: 150, accuracy: 90, cost: 4 }
    ],
    fire: [
        { name: 'Ember', type: 'fire', power: 40, accuracy: 100, cost: 1 },
        { name: 'Flame Wheel', type: 'fire', power: 60, accuracy: 100, cost: 2 },
        { name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, cost: 3 },
        { name: 'Fire Blast', type: 'fire', power: 110, accuracy: 85, cost: 4 }
    ],
    water: [
        { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, cost: 1 },
        { name: 'Bubble Beam', type: 'water', power: 65, accuracy: 100, cost: 2 },
        { name: 'Surf', type: 'water', power: 90, accuracy: 100, cost: 3 },
        { name: 'Hydro Pump', type: 'water', power: 110, accuracy: 80, cost: 4 }
    ],
    grass: [
        { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, cost: 1 },
        { name: 'Razor Leaf', type: 'grass', power: 55, accuracy: 95, cost: 2 },
        { name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, cost: 4 }
    ],
    electric: [
        { name: 'Thundershock', type: 'electric', power: 40, accuracy: 100, cost: 1 },
        { name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, cost: 3 },
        { name: 'Thunder', type: 'electric', power: 110, accuracy: 70, cost: 4 }
    ]
};

const DEFAULT_MOVES = [
    { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, cost: 1 },
    { name: 'Leer', type: 'normal', power: 0, accuracy: 100, cost: 1 } // Placeholder for non-damaging
];

export const getMoves = (pokemon) => {
    if (!pokemon || !pokemon.types) return DEFAULT_MOVES;
    
    // Get moves based on types
    let moves = [];
    
    pokemon.types.forEach(t => {
        const typeName = t.type.name;
        if (MOVE_POOL[typeName]) {
            moves = [...moves, ...MOVE_POOL[typeName]];
        }
    });

    // If no specific moves found, add normal moves
    if (moves.length === 0) {
        moves = [...MOVE_POOL.normal];
    }

    // Always ensure at least 4 moves (fill with normal if needed)
    if (moves.length < 4) {
        moves = [...moves, ...MOVE_POOL.normal].slice(0, 4);
    }
    
    // Pick 4 random unique moves if we have too many
    // For stability, we'll just take the first 4 for now, 
    // or you could shuffle. Simple slice is fine for MVP.
    // Ideally we'd map this to level, but keeping it simple for Felix.
    
    // Let's filter to unique names to be safe
    const uniqueMoves = [];
    const seen = new Set();
    
    for (const m of moves) {
        if (!seen.has(m.name)) {
            uniqueMoves.push(m);
            seen.add(m.name);
        }
    }
    
    return uniqueMoves.slice(0, 4);
};

export const calculateSmartDamage = (attacker, defender, move, lastMoveName, fatigue = 0) => {
    // 1. Calculate Base Damage using existing helper
    const baseResult = calculateDamage(attacker, defender, move);
    const { damage, effectiveness } = baseResult;
    let message = "";

    // 2. Anti-Spam Penalty
    if (lastMoveName && move.name === lastMoveName) {
        damage = Math.floor(damage * 0.6); // 40% reduction
        message = "⚠️ ¡Repetitivo!";
    }

    // 3. Fatigue Penalty (Sprint 4)
    if (fatigue > 50) {
        damage = Math.floor(damage * 0.8); // 20% reduction
        message += " 🥱 Cansado!";
    } else if (fatigue > 80) {
        damage = Math.floor(damage * 0.5); // 50% reduction
        message += " 💤 ¡Muy agotado!";
    }

    return { 
        damage, 
        effectiveness, 
        message,
        isCrit: Math.random() < 0.06 // 6% crit chance
    };
};

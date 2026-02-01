import { randomService } from './RandomService';

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
    
    // Support dual types for defender
    const defenderTypes = defender?.types?.map(t => t.type.name) || ['normal'];

    // Use move type if available, otherwise fallback to Pokemon type
    const attackType = move ? move.type : attackerTypeSafe;

    // Calculate combined effectiveness (e.g. 2 * 2 = 4x, 0.5 * 2 = 1x)
    let effectiveness = 1;
    for (const type of defenderTypes) {
        effectiveness *= getEffectiveness(attackType, type);
    }

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

    if (effectiveness > 1) {
        finalDamage += 1; // Super effective = +1 Dmg
        if (effectiveness >= 4) finalDamage += 1; // Double Super Effective = +2 Dmg
    } 
    else if (effectiveness < 1 && effectiveness > 0) finalDamage = Math.max(1, finalDamage - 1); // Not very effective = -1 Dmg (min 1)
    else if (effectiveness === 0) finalDamage = 0; // Immune

    return { damage: finalDamage, effectiveness, baseDamage };
};

// Calculate Energy Cost based on Damage (1-3 Energy)
export const calculateEnergyCost = (baseDamage) => {
    if (baseDamage >= 5) return 4;
    if (baseDamage >= 4) return 3;
    if (baseDamage >= 2) return 2;
    return 1;
};

// --- NEW CARD BATTLE SYSTEM HELPERS ---

const TYPE_COLORS = {
    fire: '#ef4444',
    grass: '#22c55e',
    water: '#3b82f6',
    electric: '#eab308',
    psychic: '#a855f7',
    rock: '#78350f',
    ground: '#78350f',
    ice: '#67e8f9',
    dragon: '#6366f1',
    dark: '#1e293b',
    fairy: '#f472b6',
    fighting: '#ea580c',
    poison: '#9333ea',
    bug: '#65a30d',
    ghost: '#4c1d95',
    steel: '#94a3b8'
};

export const getTypeColor = (type) => TYPE_COLORS[type] || '#64748b';

/**
 * Combines two moves into a new special move
 */
const getFusionMove = (m1, m2) => {
    const t1 = m1.type;
    const t2 = m2.type;
    if ((t1 === 'fire' && t2 === 'water') || (t1 === 'water' && t2 === 'fire')) {
        return { name: 'Steam Eruption', type: 'water', power: 100, description: "Kokende stoom verbrandt de tegenstander." };
    }
    if ((t1 === 'electric' && t2 === 'water') || (t1 === 'water' && t2 === 'electric')) {
        return { name: 'Thunder Storm', type: 'electric', power: 110, description: "Geëlektrificeerd water geleidt perfect." };
    }
    return null;
};

const getBaseCombo = (m1, m2, isSame) => ({
    name: isSame ? `MEGA ${m1.name}` : `${m1.name} & ${m2.name}`,
    power: isSame ? Math.floor(((m1.power || 40) + (m2.power || 40)) * 1.2) : Math.floor((m1.power || 40) + (m2.power || 40)),
    description: isSame ? "Type Fusie! Enorme Schade!" : "Tactische combinatie-aanval."
});

export const combineMoves = (move1, move2) => {
    const isSameType = move1.type === move2.type;
    const cost1 = move1.cost || calculateEnergyCost(move1.power || 40);
    const cost2 = move2.cost || calculateEnergyCost(move2.power || 40);
    const combinedCost = Math.max(2, cost1 + cost2 - 1);

    const fusion = !isSameType ? getFusionMove(move1, move2) : null;
    const base = fusion || getBaseCombo(move1, move2, isSameType);

    return {
        ...base,
        type: move1.type,
        cost: combinedCost,
        isCombo: true,
        accuracy: Math.min(move1.accuracy || 100, move2.accuracy || 100)
    };
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
        { name: 'Hyper Beam', type: 'normal', power: 150, accuracy: 90, cost: 4, recoil: 0.5 }
    ],
    fire: [
        { name: 'Ember', type: 'fire', power: 40, accuracy: 100, cost: 1, status: 'burn', statusChance: 0.1 },
        { name: 'Flame Wheel', type: 'fire', power: 60, accuracy: 100, cost: 2, status: 'burn', statusChance: 0.1 },
        { name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, cost: 3, status: 'burn', statusChance: 0.1 },
        { name: 'Fire Blast', type: 'fire', power: 110, accuracy: 85, cost: 4, recoil: 0.2, status: 'burn', statusChance: 0.3 }
    ],
    water: [
        { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, cost: 1 },
        { name: 'Bubble Beam', type: 'water', power: 65, accuracy: 100, cost: 2, status: 'speed_down', statusChance: 0.1 },
        { name: 'Surf', type: 'water', power: 90, accuracy: 100, cost: 3 },
        { name: 'Hydro Pump', type: 'water', power: 110, accuracy: 80, cost: 4, recoil: 0.2 }
    ],
    grass: [
        { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, cost: 1 },
        { name: 'Razor Leaf', type: 'grass', power: 55, accuracy: 95, cost: 2 },
        { name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, cost: 4, recoil: 0.3 },
        { name: 'Sleep Powder', type: 'grass', power: 0, accuracy: 75, cost: 2, status: 'sleep', statusChance: 1.0 }
    ],
    electric: [
        { name: 'Thundershock', type: 'electric', power: 40, accuracy: 100, cost: 1, status: 'paralysis', statusChance: 0.1 },
        { name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, cost: 3, status: 'paralysis', statusChance: 0.1 },
        { name: 'Thunder', type: 'electric', power: 110, accuracy: 70, cost: 4, recoil: 0.2, status: 'paralysis', statusChance: 0.3 }
    ],
    ice: [
        { name: 'Powder Snow', type: 'ice', power: 40, accuracy: 100, cost: 1, status: 'freeze', statusChance: 0.1 },
        { name: 'Ice Beam', type: 'ice', power: 90, accuracy: 100, cost: 3, status: 'freeze', statusChance: 0.1 },
        { name: 'Blizzard', type: 'ice', power: 110, accuracy: 70, cost: 4, status: 'freeze', statusChance: 0.3 }
    ],
    fighting: [
        { name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 100, cost: 1 },
        { name: 'Brick Break', type: 'fighting', power: 75, accuracy: 100, cost: 2 },
        { name: 'Close Combat', type: 'fighting', power: 120, accuracy: 100, cost: 4, recoil: 0.3 }
    ],
    poison: [
        { name: 'Poison Sting', type: 'poison', power: 15, accuracy: 100, cost: 1, status: 'poison', statusChance: 0.3 },
        { name: 'Sludge Bomb', type: 'poison', power: 90, accuracy: 100, cost: 3, status: 'poison', statusChance: 0.3 },
        { name: 'Gunk Shot', type: 'poison', power: 120, accuracy: 80, cost: 4, status: 'poison', statusChance: 0.3 }
    ],
    ground: [
        { name: 'Mud Slap', type: 'ground', power: 20, accuracy: 100, cost: 1 },
        { name: 'Earthquake', type: 'ground', power: 100, accuracy: 100, cost: 3 },
        { name: 'Earth Power', type: 'ground', power: 90, accuracy: 100, cost: 3 }
    ],
    flying: [
        { name: 'Peck', type: 'flying', power: 35, accuracy: 100, cost: 1 },
        { name: 'Aerial Ace', type: 'flying', power: 60, accuracy: 100, cost: 2 },
        { name: 'Brave Bird', type: 'flying', power: 120, accuracy: 100, cost: 4, recoil: 0.3 }
    ],
    psychic: [
        { name: 'Confusion', type: 'psychic', power: 50, accuracy: 100, cost: 1 },
        { name: 'Psybeam', type: 'psychic', power: 65, accuracy: 100, cost: 2 },
        { name: 'Psychic', type: 'psychic', power: 90, accuracy: 100, cost: 3 }
    ],
    bug: [
        { name: 'Bug Bite', type: 'bug', power: 60, accuracy: 100, cost: 1 },
        { name: 'Signal Beam', type: 'bug', power: 75, accuracy: 100, cost: 2 },
        { name: 'X-Scissor', type: 'bug', power: 80, accuracy: 100, cost: 3 }
    ],
    rock: [
        { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, cost: 1 },
        { name: 'Rock Slide', type: 'rock', power: 75, accuracy: 90, cost: 2 },
        { name: 'Stone Edge', type: 'rock', power: 100, accuracy: 80, cost: 3 }
    ],
    ghost: [
        { name: 'Lick', type: 'ghost', power: 30, accuracy: 100, cost: 1 },
        { name: 'Shadow Ball', type: 'ghost', power: 80, accuracy: 100, cost: 3 },
        { name: 'Shadow Claw', type: 'ghost', power: 70, accuracy: 100, cost: 2 }
    ],
    dragon: [
        { name: 'Dragon Breath', type: 'dragon', power: 60, accuracy: 100, cost: 2 },
        { name: 'Dragon Claw', type: 'dragon', power: 80, accuracy: 100, cost: 3 },
        { name: 'Outrage', type: 'dragon', power: 120, accuracy: 100, cost: 4, recoil: 0.3 }
    ],
    steel: [
        { name: 'Metal Claw', type: 'steel', power: 50, accuracy: 95, cost: 1 },
        { name: 'Iron Head', type: 'steel', power: 80, accuracy: 100, cost: 3 },
        { name: 'Flash Cannon', type: 'steel', power: 80, accuracy: 100, cost: 3 }
    ],
    fairy: [
        { name: 'Fairy Wind', type: 'fairy', power: 40, accuracy: 100, cost: 1 },
        { name: 'Dazzling Gleam', type: 'fairy', power: 80, accuracy: 100, cost: 3 },
        { name: 'Moonblast', type: 'fairy', power: 95, accuracy: 100, cost: 3 }
    ]
};

const DEFAULT_MOVES = [
    { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, cost: 1 },
    { name: 'Leer', type: 'normal', power: 0, accuracy: 100, cost: 1 } // Placeholder for non-damaging
];

export const chooseBestMove = (attacker, defender, moves, energy) => {
    // Filter moves we can afford
    const affordableMoves = moves.filter(m => (m.cost || 1) <= energy);

    // If no moves affordable, return null (BattleArena should handle "Wait/Recharge")
    if (affordableMoves.length === 0) return null;

    // Score each move
    const scoredMoves = affordableMoves.map(move => {
        // Use calculateDamage to predict effectiveness (ignoring RNG/Crits for AI decision)
        const prediction = calculateDamage(attacker, defender, move);
        
        let score = prediction.damage;

        // Bonus for Super Effective
        if (prediction.effectiveness > 1) score += 2;
        
        // Bonus for STAB
        if (attacker.types?.some(t => t.type.name === move.type)) score += 1;

        // Penalty for high cost if damage isn't great (efficiency)
        const cost = move.cost || 1;
        if (cost > 2 && prediction.damage < 3) score -= 1;

        // Random jitter to make AI less predictable (0-1.5)
        score += randomService.float() * 1.5;

        return { move, score };
    });

    // Sort by score descending
    scoredMoves.sort((a, b) => b.score - a.score);

    return scoredMoves[0].move;
};

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

export const calculateSmartDamage = (attacker, defender, move, { lastMoveName, fatigue = 0, isWeakened = false, attackerStatus = null } = {}) => {
    // 0. Forced Weakness Damage
    if (isWeakened) {
        return {
            damage: 5,
            recoilDamage: 0,
            effectiveness: 1,
            message: " 😵 Verzwakt! (Max schade)",
            isCrit: false,
            appliedStatus: null
        };
    }

    // 1. Calculate Base Damage using existing helper
    const baseResult = calculateDamage(attacker, defender, move);
    let { damage } = baseResult;
    const { effectiveness } = baseResult; // Changed to const
    let message = "";

    // Status: Burn reduces attack by 50% (unless ability says otherwise, ignoring guts for now)
    if (attackerStatus === 'burn' && move.category !== 'special') { // Simplify: just reduce all damage for now
        damage = Math.floor(damage * 0.5);
        message += " (Verbrand)";
    }

    const isSpecialist = attacker.types?.some(t => t.type.name === move.type);
    if (isSpecialist) damage = Math.floor(damage * 1.5);

    const isCombo = move.isCombo;
    if (isCombo) damage = Math.floor(damage * 1.2);

    // 2. Anti-Spam Penalty
    if (lastMoveName && move.name === lastMoveName) {
        damage = Math.floor(damage * 0.6); // 40% reduction
        message = "⚠️ Herhalend!";
    }

    // 3. Fatigue Penalty (Sprint 4)
    if (fatigue > 50) {
        damage = Math.floor(damage * 0.8); // 20% reduction
        message += " 🥱 Moe!";
    } else if (fatigue > 80) {
        damage = Math.floor(damage * 0.5); // 50% reduction
        message += " 💤 Uitgeput!";
    }

    // 4. Critical Hit
    const isCrit = randomService.bool(0.06); // 6% chance
    if (isCrit) {
        damage = Math.floor(damage * 1.5);
        message += " 🎯 KRITIEK!";
    }

    // 5. Recoil / Damage Split
    let recoilDamage = 0;
    if (move.recoil) {
        recoilDamage = Math.floor(damage * move.recoil);
        damage = damage - recoilDamage; // The "Split" effect
        if (recoilDamage > 0) message += ` 💥 Split! -${recoilDamage} HP terugslag!`;
    }

    // 6. Status Effects
    let appliedStatus = null;
    if (move.status && randomService.bool(move.statusChance || 0.1)) {
        appliedStatus = move.status;
        const statusIcons = {
            burn: '🔥',
            paralysis: '⚡',
            freeze: '❄️',
            poison: '☠️',
            sleep: '💤',
            speed_down: '🐌'
        };
        const statusNames = {
            burn: 'VERBRAND',
            paralysis: 'VERLAMD',
            freeze: 'BEVROREN',
            poison: 'VERGIFTIGD',
            sleep: 'SLAAP',
            speed_down: 'SNELHEID OMLAAG'
        };
        message += ` ${statusIcons[move.status] || '✨'} ${statusNames[move.status] || move.status.toUpperCase()}!`;
    }

    return { 
        damage, 
        recoilDamage,
        effectiveness, 
        message,
        isCrit,
        appliedStatus
    };
};

export const ALTITUDE_STAGES = [
    {
        name: 'Foothills (0-500m)', altitude: 500, pokemon: ['pidgeot', 'mankey', 'growlithe'], item: 'hiking_boots',
        description: 'Gentle slopes covered in grass and small rocks', danger: 'Low'
    },
    {
        name: 'Lower Mountain (500-1000m)', altitude: 1000, pokemon: ['spearow', 'fearow', 'sandslash'],
        description: 'Steeper terrain with sparse vegetation', danger: 'Medium'
    },
    {
        name: 'Middle Mountain (1000-1500m)', altitude: 1500, pokemon: ['graveler', 'golem', 'cloyster'],
        description: 'Rocky slopes with thin air', danger: 'High'
    },
    {
        name: 'Peak (1500-2000m)', altitude: 2000, pokemon: ['articuno', 'zapdos', 'moltres'],
        description: 'The majestic summit with legendary Pokemon!', danger: 'Extreme'
    }
];

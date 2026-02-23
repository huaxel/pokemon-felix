import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbJsonPath = path.join(__dirname, '../../db.json');

async function seed() {
  try {
    const rawData = fs.readFileSync(dbJsonPath, 'utf8');
    const data = JSON.parse(rawData);

    // Seed trainers
    const insertTrainer = db.prepare(`
      INSERT OR REPLACE INTO trainers (id, name, type, personality, pokemon_team, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const trainer of data.trainers) {
      insertTrainer.run(
        trainer.id,
        trainer.name,
        trainer.type,
        trainer.personality,
        JSON.stringify(trainer.pokemon_team),
        trainer.avatar_url
      );
    }

    // Seed relationships
    const insertRelationship = db.prepare(`
      INSERT OR REPLACE INTO relationships (id, player_id, trainer_id, friendship_score, rivalry_score, relationship_type, battles_won, battles_lost, history_summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const rel of data.relationships) {
      insertRelationship.run(
        rel.id,
        rel.player_id,
        rel.trainer_id,
        rel.friendship_score,
        rel.rivalry_score,
        rel.relationship_type,
        rel.battles_won,
        rel.battles_lost,
        rel.history_summary
      );
    }

    if (process.env.NODE_ENV !== 'test') {
      console.log('Seeding completed successfully!');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Seeding failed:', error);
    }
  }
}

seed();

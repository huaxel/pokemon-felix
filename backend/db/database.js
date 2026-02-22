import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/pokemon_felix.db');

// Ensure the data directory exists
import fs from 'fs';
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS trainers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    personality TEXT,
    pokemon_team TEXT, -- JSON string
    avatar_url TEXT
  );

  CREATE TABLE IF NOT EXISTS relationships (
    id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL,
    trainer_id TEXT NOT NULL,
    friendship_score INTEGER DEFAULT 0,
    rivalry_score INTEGER DEFAULT 0,
    relationship_type TEXT,
    battles_won INTEGER DEFAULT 0,
    battles_lost INTEGER DEFAULT 0,
    history_summary TEXT,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trainer_id TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'player' or 'trainer'
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
  );

  CREATE TABLE IF NOT EXISTS memory_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trainer_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id)
  );
`);

export default db;

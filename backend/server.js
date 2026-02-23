import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/trainers', (req, res) => {
  try {
    const trainers = db.prepare('SELECT * FROM trainers').all();
    const formattedTrainers = trainers.map(t => ({
      ...t,
      pokemon_team: JSON.parse(t.pokemon_team)
    }));
    res.json(formattedTrainers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trainers/:id', (req, res) => {
  try {
    const trainer = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
    
    res.json({
      ...trainer,
      pokemon_team: JSON.parse(trainer.pokemon_team)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/relationships/:player_id/:trainer_id', (req, res) => {
  try {
    const relationship = db.prepare(`
      SELECT * FROM relationships 
      WHERE player_id = ? AND trainer_id = ?
    `).get(req.params.player_id, req.params.trainer_id);
    
    res.json(relationship || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chat/:trainer_id', (req, res) => {
  try {
    const chat = db.prepare(`
      SELECT * FROM chat_history 
      WHERE trainer_id = ? 
      ORDER BY timestamp ASC 
      LIMIT 20
    `).all(req.params.trainer_id);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

import { getTrainerResponse } from './services/llmService.js';

app.post('/api/chat/:trainer_id', async (req, res) => {
  const { content } = req.body;
  const { trainer_id } = req.params;
  
  try {
    // 1. Save user message
    db.prepare(`
      INSERT INTO chat_history (trainer_id, sender, content)
      VALUES (?, ?, ?)
    `).run(trainer_id, 'player', content);

    // 2. Get AI Response
    const { reply, action } = await getTrainerResponse(trainer_id, content);
    
    res.status(201).json({ success: true, response: reply, action });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Pokemon Felix Backend running at http://localhost:${port}`);
});

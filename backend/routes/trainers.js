import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { notFound } from '../lib/httpError.js';

export function createTrainersRouter({ db }) {
  const router = Router();

  router.get(
    '/api/trainers',
    asyncHandler(async (_req, res) => {
      const trainers = db.prepare('SELECT * FROM trainers').all();
      const formattedTrainers = trainers.map(t => ({
        ...t,
        pokemon_team: JSON.parse(t.pokemon_team),
      }));
      res.json(formattedTrainers);
    })
  );

  router.get(
    '/api/trainers/:id',
    asyncHandler(async (req, res) => {
      const trainer = db.prepare('SELECT * FROM trainers WHERE id = ?').get(req.params.id);
      if (!trainer) {
        throw notFound('Trainer not found');
      }
      res.json({
        ...trainer,
        pokemon_team: JSON.parse(trainer.pokemon_team),
      });
    })
  );

  return router;
}

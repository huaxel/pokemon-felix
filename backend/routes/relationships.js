import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';

export function createRelationshipsRouter({ db }) {
  const router = Router();

  router.get(
    '/api/relationships/:player_id/:trainer_id',
    asyncHandler(async (req, res) => {
      const relationship = db
        .prepare(
          `
      SELECT * FROM relationships 
      WHERE player_id = ? AND trainer_id = ?
    `
        )
        .get(req.params.player_id, req.params.trainer_id);

      res.json(relationship || null);
    })
  );

  return router;
}

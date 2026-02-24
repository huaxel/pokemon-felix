import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { badRequest } from '../lib/httpError.js';

export function createChatRouter({ db, getTrainerResponse }) {
  const router = Router();

  router.get(
    '/api/chat/:trainer_id',
    asyncHandler(async (req, res) => {
      const chat = db
        .prepare(
          `
      SELECT * FROM chat_history 
      WHERE trainer_id = ? 
      ORDER BY timestamp ASC 
      LIMIT 20
    `
        )
        .all(req.params.trainer_id);

      res.json(chat);
    })
  );

  router.post(
    '/api/chat/:trainer_id',
    asyncHandler(async (req, res) => {
      const { sender, content } = req.body || {};
      const { trainer_id } = req.params;

      if (!sender || !content) {
        throw badRequest('sender and content are required');
      }

      db.prepare(
        `
      INSERT INTO chat_history (trainer_id, sender, content)
      VALUES (?, ?, ?)
    `
      ).run(trainer_id, sender, content);

      const { reply, action } = await getTrainerResponse(trainer_id, content);

      res.status(201).json({ success: true, response: reply, action });
    })
  );

  return router;
}

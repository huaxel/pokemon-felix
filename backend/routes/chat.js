import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { badRequest } from '../lib/httpError.js';
import { validateChatInput } from '../utils/validation.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

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

  const chatRateLimiter = createRateLimiter({
    windowMs: 60000, // 1 minute
    max: 10, // 10 requests per window
  });

  router.post(
    '/api/chat/:trainer_id',
    chatRateLimiter,
    asyncHandler(async (req, res) => {
      const { content } = req.body || {};
      const { trainer_id } = req.params;
      const sender = 'player';

      const validation = validateChatInput(sender, content);
      if (!validation.valid) {
        const errorMessage =
          validation.error === 'Sender and content are required'
            ? 'Content is required'
            : validation.error;
        throw badRequest(errorMessage);
      }

      db.prepare(
        `
      INSERT INTO chat_history (trainer_id, sender, content)
      VALUES (?, ?, ?)
    `
      ).run(trainer_id, 'player', content);

      const { reply, action } = await getTrainerResponse(trainer_id, content);

      res.status(201).json({ success: true, response: reply, action });
    })
  );

  return router;
}

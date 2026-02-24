import express from 'express';
import cors from 'cors';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createTrainersRouter } from './routes/trainers.js';
import { createRelationshipsRouter } from './routes/relationships.js';
import { createChatRouter } from './routes/chat.js';
import { notFound } from './lib/httpError.js';

export function createApp({ db, getTrainerResponse, logger }) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestId);

  app.use(createTrainersRouter({ db }));
  app.use(createRelationshipsRouter({ db }));
  app.use(createChatRouter({ db, getTrainerResponse }));

  app.use((_req, _res, next) => next(notFound()));
  app.use(errorHandler({ logger }));

  return app;
}

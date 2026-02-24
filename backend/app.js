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

  // Secure CORS configuration
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(requestId);

  app.use(createTrainersRouter({ db }));
  app.use(createRelationshipsRouter({ db }));
  app.use(createChatRouter({ db, getTrainerResponse }));

  app.use((_req, _res, next) => next(notFound()));
  app.use(errorHandler({ logger }));

  return app;
}

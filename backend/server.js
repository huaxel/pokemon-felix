import dotenv from 'dotenv';
import db from './db/database.js';
import { createApp } from './app.js';
import { createLogger } from './lib/logger.js';
import { getTrainerResponse } from './services/llmService.js';

dotenv.config();

const port = process.env.PORT || 3001;
const logger = createLogger({ level: process.env.LOG_LEVEL || 'info' });
const app = createApp({ db, getTrainerResponse, logger });

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info(`Pokemon Felix Backend running at http://localhost:${port}`);
  }
});

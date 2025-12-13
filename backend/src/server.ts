import app from './app';
import { env } from './config/env';
import logger from './utils/logger';

const port = env.PORT || 5000;

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: any) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

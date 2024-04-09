import type { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}]: ${message}`,
  ),
);

const fileTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  levels: {
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5,
  },
  format: logFormat,
  transports: [fileTransport],
});

export class FileLogger implements LoggerService {
  log(message: string, context?: string) {
    logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    logger.verbose(message, { context });
  }
}

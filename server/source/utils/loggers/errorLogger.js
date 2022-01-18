import winston from 'winston';
import path from 'path';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const filename = path.resolve(path.join('logs', 'errors.log'));

const logFormat = printf(({ name, message, timestamp }) => `${timestamp} ${name} ${message}`);

const errorLogger = createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [new transports.File({ filename, level: 'error' })],
});

export { errorLogger };

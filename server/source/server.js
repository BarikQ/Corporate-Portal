import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
// import { io } from 'socket.io';

// Routers
import { auth, films, users } from './routers';

// Utils
import {
  logger,
  errorLogger,
  NotFoundError,
  notFoundLogger,
  validationLogger,
  sessionOptions,
} from './utils';

const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000'],
  exposedHeaders: 'X-Token',
};

app.use(session(sessionOptions));
app.use(express.json({ limit: '15mb' }));
app.use(cors(corsOptions));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/auth', auth);
app.use('/films', films);
app.use('/users', users);

// Wrong url request
app.use('*', (req, res, next) => {
  const error = new NotFoundError(`${req.method}: ${req.originalUrl}`);

  next(error);
});

// File error logger
if (process.env.NODE_ENV !== 'test') {
  app.use('*', (error, req, res, next) => {
    const { name, message, statusCode } = error;
    const errorMessage = `${name}: ${message}`;
    const log = {
      level: 'error',
      name: name,
      message: message,
    };

    switch (name) {
      case 'NotFoundError':
        notFoundLogger.error(log);
        break;
      case 'ValidationError':
        validationLogger.error(log);
        break;
      default:
        errorLogger.error(log);
    }

    const status = statusCode || 500;

    res.status(status).json({ message });
    return;
  });
}

// Console error logger
app.use('*', (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const log = {
        level: 'debug',
        method: req.method,
        url: req.originalUrl,
        payload: req.body,
      };

      logger.log(log);
    }
  } catch (error) {
    throw new Error('Logger error');
  }

  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve() + '/source/index.html');
  return;
});

export { app };

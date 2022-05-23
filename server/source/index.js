import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { Server } from 'socket.io';
import http from 'http';

import { app } from './server.js';
import { getPort } from './utils';
import { setUpSocket } from './socket/socket.js';

import './db';

dotenv.config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const PORT = getPort();

io.use((socket, next) => {
  const { userId } = socket.handshake.auth;
  console.log('kylity', socket.handshake.auth);

  if (!userId) {
    const error = new Error('User unauthorized');
    error.data = { code: 401 };

    return next(error);
  }

  socket.userId = userId;
  next();
});

setUpSocket(io);

server.listen(PORT, () => {
  console.log(`Server API is up on port ${PORT}`);
});

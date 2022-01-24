import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
console.log(process.env.CLOUD_NAME, process.env.CLOUD_KEY, process.env.CLOUD_SECRET);
dotenv.config({ path: '.env' });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

import { app } from './server.js';
import { getPort } from './utils';

import './db';

const PORT = getPort();

app.listen(PORT, () => {
  console.log(`Server API is up on port ${PORT}`);
});

import mongoose from 'mongoose';
import dg from 'debug';

import { getDB } from '../utils';

const debug = dg('db');
const { DB_URL, DB_NAME } = getDB();

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const connection = mongoose.connect(`${DB_URL}/${DB_NAME}?retryWrites=true`, mongooseOptions);

connection
  .then(() => {
    debug(`DB ${DB_NAME} connected successfully`);
  })
  .catch(({ message }) => {
    debug(`DB ${DB_NAME} connected error ${message}`);
  });

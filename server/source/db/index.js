import mongoose from 'mongoose';
import dg from 'debug';

import { getDB } from '../utils';

const debug = dg('db');
const { DB_URL, DB_NAME, SCALEGRID_URL, CLEVER_CLOUD } = getDB();

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const connection = mongoose.connect(`${CLEVER_CLOUD}/${DB_NAME}?retryWrites=true&replicaSet=rs0&w=majority`, mongooseOptions);

connection
  .then(() => {
    debug(`DB ${DB_NAME} connected successfully`);
  })
  .catch(({ message }) => {
    debug(`DB ${DB_NAME} connected error ${message}`);
  });

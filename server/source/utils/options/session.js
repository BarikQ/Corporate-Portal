import MongoStore from 'connect-mongo';
import { getJwtKey, getDB } from '..';
const { DB_URL, DB_NAME, SCALEGRID_URL, CLEVER_CLOUD } = getDB();

const mongoOptions = {
  mongoUrl: `${CLEVER_CLOUD}/${DB_NAME}?retryWrites=true`,
};

export const sessionOptions = {
  key: 'user',
  secret: getJwtKey(),
  resave: false,
  rolling: true,
  saveUninitialized: false,
  sameSite: false,
  store: MongoStore.create(mongoOptions),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  },
};

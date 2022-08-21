import { objectIterator } from '.';

export const dataDecoder = () => (req, res, next) => {
  try {
    req.body = objectIterator(req.body, (obj, key, value) => {
      if (Array.isArray(obj[key]))
        obj[key] = obj[key].map((item) => Buffer.from(item, 'base64').toString());
      else obj[key] = Buffer.from(value, 'base64').toString();

      if (key === 'technologies' && typeof obj[key] === 'string') obj[key] = obj[key].split(',');
    });

    next();
  } catch (error) {
    console.log('DECODER ERROR', error);
    res.status(500).json({ message: 'Data decoder error', error: error.message });
    return;
  }
};

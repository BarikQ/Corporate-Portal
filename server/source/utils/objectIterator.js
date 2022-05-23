export const objectIterator = (obj, callback) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      objectIterator(obj[key], callback);
    } else {
      callback(obj, key, obj[key]);
    }
  });

  return obj;
};

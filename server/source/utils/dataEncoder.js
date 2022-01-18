export const dataEncoder = () => (req, res, next) => {
  Object.keys(req.body).forEach((el) => {
    req.body[el] = Buffer.from(req.body[el]).toString('base64');
  });

  next();
};

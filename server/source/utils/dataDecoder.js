export const dataDecoder = () => (req, res, next) => {
  Object.keys(req.body).forEach((el) => {
    req.body[el] = Buffer.from(req.body[el], 'base64').toString();
  });
  
  next();
};

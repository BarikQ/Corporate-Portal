import { NotFoundError, ValidationError } from '../errors';

export const getJwtKey = () => {
  const { JWT_KEY } = process.env;

  if (!JWT_KEY) {
    throw new NotFoundError('Environment variable JWT_KEY should be specified');
  }

  const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(JWT_KEY);

  if (!isValid) {
    throw new ValidationError(
      'Environment variable JWT_KEY should have a minimum eight characters, at least one letter, one number and one special character'
    );
  }

  return JWT_KEY;
};

import { NotFoundError, ValidationError } from '../errors';

export const getPort = () => {
  const { PORT_ENV } = process.env || 3000;

  if (!PORT_ENV) {
    throw new NotFoundError('Environment variable PORT_ENV should be specified');
  }

  const isValid = /^[3-9]{1}[0-9]{3}$/.test(PORT_ENV);

  if (!isValid) {
    throw new ValidationError(
      'Environment variable PORT_ENV should a number and be between 3000 and 9999'
    );
  }

  return PORT_ENV;
};

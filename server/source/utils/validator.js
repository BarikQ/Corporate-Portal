import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from "ajv-formats"

import { ValidationError } from './errors';
import { objectCropper } from '.';

const ajv = new Ajv({ allErrors: true, $data: true, });
ajvErrors(ajv);
addFormats(ajv)

export const validator = (schema) => (req, res, next) => {

  const validate = ajv.compile(schema);
  const trimmedValidationProps = ['keyword', 'schemaPath', 'params', 'name'];

  const valid = validate(req.body);

  if (valid) {
    return next();
  }
  console.log(validate.errors);
  const validationErrors = validate.errors.reduce((currentObject, error) => {
    currentObject[error['instancePath'].slice(1)] = [error.message];

    return currentObject;
  }, {});

  const errors = validate.errors.map(({ message }) => message).join(' ,');
  const body = JSON.stringify(req.body, null, 2);
  console.log(validationErrors);

  next(new ValidationError(JSON.stringify(validationErrors), 400));
};

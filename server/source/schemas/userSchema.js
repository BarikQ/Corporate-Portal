export const createUser = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    firstName: {
      type: 'string',
      pattern: "^[a-zA-Z ,.'-]+$",
      errorMessage: "Only english letters and ' allowed",
    },
    surname: {
      type: 'string',
      pattern: "^[a-zA-Z ,.'-]+$",
      errorMessage: 'Only english letters allowed',
    },
    birthDate: {
      type: 'string',
      errorMessage: 'Date error',
    },
    city: {
      type: 'string',
      pattern: "^[a-zA-Z ,.'-]+$",
      errorMessage: 'Only english letters allowed',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 32,
      pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}',
      errorMessage:
        'Must contain at least one number and one uppercase and lowercase letter, and at 6-32 characters',
    },
    passwordRepeat: {
      type: 'string',
      const: {
        $data: '1/password',
      },
      errorMessage: 'Passwords missmatch',
    },
  },
  required: ['firstName', 'surname', 'birthDate', 'city', 'email', 'password', 'passwordRepeat'],
  additionalProperties: true,
};

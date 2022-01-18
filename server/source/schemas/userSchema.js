export const createUser = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 32,
      pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}',
      errorMessage: 'Must contain at least one number and one uppercase and lowercase letter, and at 6-32 characters',
    },
    passwordRepeat: {
      type: 'string',
      const: {
        $data: '1/password',
      },
      errorMessage: 'Passwords missmatch',
    },
  },
  required: ['email', 'password', 'passwordRepeat'],
  additionalProperties: true,
};

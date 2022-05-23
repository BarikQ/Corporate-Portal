export default function validate(name, value, formValues) {
  const { validation, repeatFor } = formValues[name];
  const errors = [];

  if (!validation) return errors;

  if (!value) {
    // errors.push('Required');
    return errors;
  }

  switch (validation) {
    case 'email':
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        errors.push('Invalid email adress');
      }
      break;
    case 'username':
      if (!/^[A-Za-z0-9_]{5,32}$/.test(value)) {
        errors.push('Must contain 5-32 characters, and not contains any special symbols exclude _');
      }
      break;
    case 'password':
      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}/.test(value)) {
        errors.push(
          'Must contain at least one number and one uppercase and lowercase letter, and at 6-32 characters'
        );
      }
      break;
    case 'name':
      if (!/^[a-z ,.'-]+$/i.test(value)) {
        errors.push('Only english letters allowed');
      }
      break;
    case 'password-repeat':
      if (value !== formValues[repeatFor].value) {
        errors.push('Passwords mismatch');
      }
      break;
    default:
      break;
  }

  return errors;
}

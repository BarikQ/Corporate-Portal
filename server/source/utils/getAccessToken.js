export function getAccessToken(email, password) {
  return `${email.split('').reverse().join('')}:${password.split('').reverse().join('')}`;
}

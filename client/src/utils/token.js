function getToken() {
  return localStorage.getItem('x-token');
}

function setToken(token) {
  localStorage.setItem('x-token', token);
}

export { getToken, setToken };

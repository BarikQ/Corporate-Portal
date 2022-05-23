export default function logout(navigate) {
  localStorage.clear('x-token');
  navigate('/');
}

import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    return localStorage.getItem('x-token');
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem('x-token', userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token,
  };
}

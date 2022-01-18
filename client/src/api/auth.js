import axios from 'axios';

const API_URL = 'http://localhost:3001';

const signUpRequest = async (event, formData) => {
  event.preventDefault();

  const data = Object.keys(formData).reduce((accumulator, key, index) => {
    accumulator[key] = btoa(formData[key].value);
    return accumulator;
  }, {});

  data.role = btoa('user');

  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: '/users',
    withCredentials: true,
    data,
  };

  const response = await axios(axiosConfig);

  return response;
};

const signInRequest = async (event, formData) => {
  event.preventDefault();

  const data = Object.keys(formData).reduce((accumulator, key, index) => {
    accumulator[key] = btoa(formData[key].value);
    return accumulator;
  }, {});

  const authHeader = btoa(`${data.email}:${data.password}`);

  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: '/auth/login',
    withCredentials: true,
    headers: { authorization: `Basic ${authHeader}` },
  };

  const response = await axios(axiosConfig);

  return response;
};

export { signInRequest, signUpRequest };

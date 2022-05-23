import axios from 'axios';

import { API_URL } from 'constants';

const authRequest = async () => {
  const axiosConfig = {
    method: 'get',
    baseURL: API_URL,
    url: '/auth',
    withCredentials: true,
  };

  const response = await axios(axiosConfig);
  console.log(response);
  return response;
};

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

const logoutRequest = async () => {
  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: '/auth/logout',
    withCredentials: true,
  };

  const response = await axios(axiosConfig);

  return response;
};

export { signInRequest, signUpRequest, authRequest, logoutRequest };

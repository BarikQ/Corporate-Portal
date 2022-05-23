import axios from 'axios';

import { API_URL } from 'constants';

const updateUserData = async (event, formData) => {
  event.preventDefault();

  const data = Object.keys(formData).reduce((accumulator, key, index) => {
    if (!Array.isArray(formData[key].value)) accumulator[key] = btoa(formData[key].value);
    else accumulator[key] = formData[key].value.map((item) => btoa(item));

    return accumulator;
  }, {});

  console.log(data);

  const axiosConfig = {
    method: 'put',
    baseURL: API_URL,
    url: `/users/${localStorage.getItem('x-token')}`,
    withCredentials: true,
    data: {
      profileData: data,
    },
  };

  const response = await axios(axiosConfig);

  return response;
};

const getUserData = async (userId) => {
  const axiosConfig = {
    method: 'get',
    baseURL: API_URL,
    url: `/users/${userId}`,
    withCredentials: true,
  };

  const response = await axios(axiosConfig);

  return response;
};

export { updateUserData, getUserData };

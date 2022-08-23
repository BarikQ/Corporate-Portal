import axios from 'axios';

import { API_URL } from 'constants';

const updateUserData = async (
  formData,
  userId = localStorage.getItem('x-token'),
  isAdminPage = false
) => {
  const data = Object.keys(formData).reduce((accumulator, key, index) => {
    if (!Array.isArray(formData[key].value)) accumulator[key] = btoa(formData[key].value);
    else accumulator[key] = formData[key].value.map((item) => btoa(item));

    return accumulator;
  }, {});

  const sendedData = { profileData: data };

  if (isAdminPage) {
    sendedData.role = data.role;
    delete data.role;
  }

  const axiosConfig = {
    method: 'put',
    baseURL: API_URL,
    url: `/users/${userId}`,
    withCredentials: true,
    data: sendedData,
    params: {
      isAdminPage,
    },
  };

  return await axios(axiosConfig);
};

const getUserData = async (userId) => {
  const axiosConfig = {
    method: 'get',
    baseURL: API_URL,
    url: `/users/${userId}`,
    withCredentials: true,
  };

  const { data } = await axios(axiosConfig);

  return data;
};

const getUsers = async (requestModifiler) => {
  const axiosConfig = {
    method: 'get',
    baseURL: API_URL,
    url: `/users`,
    withCredentials: true,
    params: {
      requested: requestModifiler,
    },
  };

  const { data } = await axios(axiosConfig);

  return data;
};

const deleteUser = async (userId = 'unset') => {
  const axiosConfig = {
    method: 'delete',
    baseURL: API_URL,
    url: `/users/${userId}`,
    withCredentials: true,
  };

  return await axios(axiosConfig);
};

const getUserChats = async (userId) => {
  const axiosConfig = {
    method: 'get',
    baseURL: API_URL,
    url: `/users/${userId}/chats`,
    withCredentials: true,
  };

  return await axios(axiosConfig);
};

const getChatMessages = async (userId, chatId) => {
  const axiosConfig = {
    method: 'get',
    baseURL: API_URL,
    url: `/users/${userId}/chats/${chatId}`,
    withCredentials: true,
  };

  return await axios(axiosConfig);
};

const addUserFriend = async (userId, friendId) => {
  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: `/users/${userId}/friends`,
    withCredentials: true,
    data: {
      userId: userId,
      friendId: friendId,
    },
  };

  const { data } = await axios(axiosConfig);

  return data;
};

const deleteUserFriend = async (userId, friendId) => {
  const axiosConfig = {
    method: 'delete',
    baseURL: API_URL,
    url: `/users/${userId}/friends`,
    withCredentials: true,
    data: {
      userId: userId,
      friendId: friendId,
    },
  };

  return await axios(axiosConfig);
};

const createUserPost = async (userId = localStorage.getItem('x-token'), data) => {
  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: `/users/${userId}/posts`,
    withCredentials: true,
    data,
  };

  return await axios(axiosConfig);
};

const updateUserPost = async (pageId, userId, postId, updates) => {
  const axiosConfig = {
    method: 'put',
    baseURL: API_URL,
    url: `/users/${pageId}/posts/${postId}`,
    withCredentials: true,
    data: {
      updates,
      userId,
    },
  };

  return await axios(axiosConfig);
};

export {
  updateUserData,
  getUserData,
  getUsers,
  deleteUser,
  getUserChats,
  getChatMessages,
  addUserFriend,
  deleteUserFriend,
  createUserPost,
  updateUserPost,
};

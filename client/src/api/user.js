import axios from 'axios';

import { API_URL } from 'constants';

const updateUserData = async (
  formData,
  userId = localStorage.getItem('x-token'),
  isAdminPage = false
) => {
  let data = null;
  let sendedData = null;

  if (!formData.privacy) {
    data = Object.keys(formData).reduce((accumulator, key, index) => {
      if (!Array.isArray(formData[key].value)) accumulator[key] = btoa(formData[key].value);
      else accumulator[key] = formData[key].value.map((item) => btoa(item));

      return accumulator;
    }, {});

    sendedData = { profileData: data };
  } else {
    sendedData = formData;
  }

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

const updateUserPrivacy = async (userId = localStorage.getItem('x-token'), data) => {
  console.log(data);

  const axiosConfig = {
    method: 'put',
    baseURL: API_URL,
    url: `/users/${userId}`,
    withCredentials: true,
    data,
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

const createUserPost = async (authorId = localStorage.getItem('x-token'), pageId, data) => {
  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: `/users/${pageId}/posts`,
    withCredentials: true,
    data: {
      ...data,
      authorId,
    },
  };

  return await axios(axiosConfig);
};

const updateUserPost = async (userId, pageId, postId, updates) => {
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

const deleteUserPost = async (userId, pageId, postId) => {
  const axiosConfig = {
    method: 'delete',
    baseURL: API_URL,
    url: `/users/${pageId}/posts/${postId}`,
    withCredentials: true,
    data: {
      userId,
    },
  };

  return await axios(axiosConfig);
};

const createPostComment = async (
  authorId = localStorage.getItem('x-token'),
  pageId,
  postId,
  data
) => {
  const axiosConfig = {
    method: 'post',
    baseURL: API_URL,
    url: `/users/${pageId}/posts/${postId}/comments`,
    withCredentials: true,
    data: {
      ...data,
      authorId,
    },
  };

  return await axios(axiosConfig);
};

const updatePostComment = async (pageId, userId, postId, commentId, updates) => {
  const axiosConfig = {
    method: 'put',
    baseURL: API_URL,
    url: `/users/${pageId}/posts/${postId}/comments/${commentId}`,
    withCredentials: true,
    data: {
      updates,
      userId,
    },
  };

  return await axios(axiosConfig);
};

const deletePostComment = async (pageId, userId, postId, commentId) => {
  const axiosConfig = {
    method: 'delete',
    baseURL: API_URL,
    url: `/users/${pageId}/posts/${postId}/comments/${commentId}`,
    withCredentials: true,
    data: {
      userId,
    },
  };

  return await axios(axiosConfig);
};

export {
  updateUserData,
  updateUserPrivacy,
  getUserData,
  getUsers,
  deleteUser,
  getUserChats,
  getChatMessages,
  addUserFriend,
  deleteUserFriend,
  createUserPost,
  updateUserPost,
  deleteUserPost,
  createPostComment,
  updatePostComment,
  deletePostComment,
};

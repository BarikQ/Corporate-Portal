import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

import { API_URL } from 'constants';

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
  },
  reducers: {
    connect: (state, { userId }) => {
      state.socket.auth = userId;
      // console.log(userId);
      // state.socket.connect();
    },
    setListener: (state, { event, cb }) => {
      state.socket.on(event, cb);
    },
    getSocket: (state) => {
      // state.value -= 1
      console.log('getSocket', state.socket);
    },
  },
});

export const { connect, setListener, getSocket } = socketSlice.actions;

export default socketSlice.reducer;

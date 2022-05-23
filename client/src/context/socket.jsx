import React from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';

import { API_URL } from 'constants';
import { setAlert } from 'store/actions';
import store from 'store/store';

const socket = io(API_URL, { autoConnect: false });
const SocketContext = React.createContext();

socket.onAny((event, ...args) => {
  // console.log(event, args);
});

socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
  store.dispatch(
    setAlert({
      message: `Connection error: ${err.message}`,
      type: 'error',
    })
  );
});

socket.on('private message', ({ message, from }) => {
  console.log('MESSAGE', message, from);
  store.dispatch(
    setAlert({
      message: `${message.senderId}: ${message.content.text}`,
      type: 'info',
    })
  );
});

export { socket, SocketContext };

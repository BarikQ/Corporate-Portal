import { io } from 'socket.io-client';

import { API_URL } from 'constants';

class Socket {
  constructor() {
    this.socket = io(API_URL, { autoConnect: false });

    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  }
}

export default Socket;

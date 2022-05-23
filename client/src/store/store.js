import { configureStore } from '@reduxjs/toolkit';

import accessReducer from './access/accessSlice';
import userReducer from './user/userSlice';
import socketReducer from './socket/socketSlice';
import alertReducer from './alert/alertSlice';

export default configureStore({
  reducer: {
    access: accessReducer,
    user: userReducer,
    socket: socketReducer,
    alert: alertReducer,
  },
});

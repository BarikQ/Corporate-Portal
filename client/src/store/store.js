import { configureStore } from '@reduxjs/toolkit';

import accessReducer from './access/accessSlice';
import userReducer from './user/userSlice';

export default configureStore({
  reducer: {
    access: accessReducer,
    user: userReducer,
  },
});

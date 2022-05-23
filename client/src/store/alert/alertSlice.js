import { createSlice } from '@reduxjs/toolkit';

export const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    value: null,
  },
  reducers: {
    setAlert: (state, action) => {
      console.log(action.payload);
      state.value = action.payload;
    },
    removeAlert: (state) => {
      state.value = null;
    },
  },
});

export const { setAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;

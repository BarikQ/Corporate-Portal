import { createSlice } from '@reduxjs/toolkit';

export const accessSlice = createSlice({
  name: 'access',
  initialState: {
    value: false,
  },
  reducers: {
    setAccess: (state, action) => {
      state.value = action.payload;
    },
    getAccess: (state) => {
      console.log('getAccess', state);
    },
  },
});

export const { setAccess, getAccess } = accessSlice.actions;

export default accessSlice.reducer;

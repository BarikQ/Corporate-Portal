import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    getId: (state) => {
      // state.value -= 1
      console.log('getId', state.id);
    },
  },
});

export const { setId, getId } = userSlice.actions;

export default userSlice.reducer;

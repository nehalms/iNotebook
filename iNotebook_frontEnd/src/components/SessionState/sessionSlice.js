import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  secretKey: null,
  permissions: [],
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin || false;
      state.permissions = action.payload.permissions || [];
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
    setSecretKey: (state, action) => {
      state.secretKey = action.payload;
    },
  },
});

export const { login, logout, setSecretKey, } = sessionSlice.actions;
export default sessionSlice.reducer;

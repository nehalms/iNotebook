import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  email: null,
  isAdmin: false,
  secretKey: null,
  permissions: [],
  isLoading: false, 
  isPinSet: false,
  isPinVerified: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload.email || null;
      state.isAdmin = action.payload.isAdmin || false;
      state.permissions = action.payload.permissions || [];
      state.isLoading = false;
      state.isPinSet = action.payload.isPinSet || false;
      state.isPinVerified = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.isAdmin = false;
      state.secretKey = null;
      state.permissions = [];
      state.isLoading = false;
      state.isPinSet = false;
      state.isPinVerified = false;
    },
    setPinVerified: (state, action) => {
      state.isPinSet = true;
      state.isPinVerified = action.payload;
    },
    setSecretKey: (state, action) => {
      state.secretKey = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setSecretKey, setLoading, setPinVerified } = sessionSlice.actions;
export default sessionSlice.reducer;
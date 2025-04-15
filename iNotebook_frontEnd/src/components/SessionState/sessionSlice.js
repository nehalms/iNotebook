import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  secretKey: null,
  permissions: [],
  isLoading: false, 
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin || false;
      state.permissions = action.payload.permissions || [];
      state.isLoading = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.secretKey = null;
      state.permissions = [];
      state.isLoading = false;
    },
    setSecretKey: (state, action) => {
      state.secretKey = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setSecretKey, setLoading } = sessionSlice.actions;
export default sessionSlice.reducer;
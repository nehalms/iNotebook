import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';

const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});

// store.subscribe(() => {
//   const state = store.getState();
//   console.log('Current state:', state);
// });

export default store;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import jobsReducer from './jobs/jobSlice';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    app: appReducer,
  },
});

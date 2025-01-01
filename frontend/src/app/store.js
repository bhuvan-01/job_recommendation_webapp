import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import jobsReducer from './jobs/jobSlice';
import appReducer from './appSlice';
import notificationsReducer from './notifications/notificationSlice';
import userReducer from './userSlice';
import jobFormReducer from './jobFormSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    app: appReducer,
    notifications: notificationsReducer,
    users: userReducer,
    jobForm: jobFormReducer,
  },
});

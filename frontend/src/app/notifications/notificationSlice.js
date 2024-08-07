import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    storeNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      state.notifications = state.notifications.map((notification) => {
        if (notification.id === action.payload.id) {
          return { ...notification, read: true };
        }
        return notification;
      });
    },
  },
});

export const { addNotification, storeNotifications, markNotificationAsRead } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;

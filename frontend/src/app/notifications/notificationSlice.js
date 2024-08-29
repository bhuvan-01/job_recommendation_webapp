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
    removeReadNotification: (state, action) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload.id);
    },
  },
});

export const { addNotification, storeNotifications, markNotificationAsRead,removeReadNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;

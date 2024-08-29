import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenuItem } from './ui/dropdown-menu';
import useSocket from '@/hooks/useSocket';
import apiClient from '@/services/apiClient';
import { storeNotifications, addNotification, markNotificationAsRead, removeReadNotification } from '@/app/notifications/notificationSlice';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get('/users/notifications');
        if (res.status === 200) {
          const sortedNotifications = res.data.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          dispatch(storeNotifications(sortedNotifications));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        dispatch(addNotification(notification));
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket, dispatch]);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    dispatch(markNotificationAsRead(notification));  // Mark notification as read
    dispatch(removeReadNotification(notification));  // Remove notification from list
  };

  return (
    <div className="max-h-80 overflow-y-auto p-2 rounded-lg shadow-lg bg-white">
      {loading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : notifications.length > 0 ? (
        // Sort notifications when rendering
        notifications.map((notification, index) => (
          <DropdownMenuItem
            key={notification.id}
            className="bg-gray-200 p-2 rounded-lg shadow-md mb-2 cursor-pointer hover:bg-gray-300"
            onClick={() => handleNotificationClick(notification)}
          >
            {notification.message}
          </DropdownMenuItem>
        ))
      ) : (
        <p className="text-center text-gray-500">No notifications</p>
      )}
    </div>
  );
};

export default Notifications;

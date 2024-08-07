import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenuItem } from './ui/dropdown-menu';
import useSocket from '@/hooks/useSocket';
import useUser from '@/hooks/useUser';
import apiClient from '@/services/apiClient';
import { storeNotifications } from '@/app/notifications/notificationSlice';

const Notifications = () => {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get('/users/notifications');

        console.log('notfns: ', res);

        if (res.status === 200) {
          dispatch(storeNotifications(res.data.notifications));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <>
      {notifications.map((notification, index) => (
        <DropdownMenuItem
          key={index}
          className='bg-gray-200 p-2 rounded-lg shadow-md mb-2'
        >
          {notification.message}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default Notifications;

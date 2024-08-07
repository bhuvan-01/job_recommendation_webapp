import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socket from '@/socket';
import { addNotification } from '@/app/notifications/notificationSlice';

const useSocket = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();
    // Join the room for the current user
    socket.emit('setup', { userId });

    // Handle incoming notifications
    socket.on('notification', (notification) => {
      console.log('received : ', notification);
      dispatch(addNotification(notification));
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, userId]);
};

export default useSocket;

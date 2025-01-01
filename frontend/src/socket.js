import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  cors: {
    origin: 'http://localhost:5000',
    credentials: true,
  },
  transports: ['websocket'],
});

export default socket;

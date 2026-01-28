// # socket initialization
import { Server } from 'socket.io';
import { socketAuth } from './middlewares/socketAuth.js';
import { registerSocketHandlers } from './socketServer.js';
import { SOCKET_EVENTS } from './events.js';

let io;

export const onlineUsers = new Map();
/*
userId => Set(socketId)
*/

export const initSocket = server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on(SOCKET_EVENTS.CONNECT, socket => {
    // online user logic
    const userId = socket.user.userId;
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    console.log('🟢 User connected:', userId);
    console.log('🟢 Socket connected:', socket.id);

    registerSocketHandlers(io, socket);
  });
};

export const getIO = () => io;

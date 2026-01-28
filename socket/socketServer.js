// # io instance & config
// Central Socket Controller

import { SOCKET_EVENTS } from './events.js';
import { chatHandler } from './handlers/chat.handler.js';
import { callHandler } from './handlers/call.handler.js';
import { onlineUsers } from './index.js';
import { cleanupCallOnDisconnect } from './utils/cleanupCall.js';

// export const registerSocketHandlers = (io, socket) => {
//   chatHandler(io, socket);
//   callHandler(io, socket, onlineUsers);
//   socket.on(SOCKET_EVENTS.DISCONNECT, () => {
//     const userId = socket.user.userId;

//     // 1. End call if exists
//     cleanupCallOnDisconnect(io, userId, onlineUsers);

//     // 2. Remove online user
//     const sockets = onlineUsers.get(userId);

//     if (sockets) {
//       sockets.delete(socket.id);

//       if (sockets.size === 0) {
//         onlineUsers.delete(userId);
//       }
//     }

//     console.log('🔴 Socket disconnected:', socket.id);
//   });
// };

// import { chatHandler } from './handlers/chat.handler.js';
// import { callHandler } from './handlers/call.handler.js';
// import { SOCKET_EVENTS } from './events.js';
// import { onlineUsers } from './index.js';
// import { cleanupCallOnDisconnect } from './utils/cleanupCall.js';

export const registerSocketHandlers = (io, socket) => {
  chatHandler(io, socket);
  callHandler(io, socket, onlineUsers);

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    const userId = socket.user.userId;

    // remove socket from user
    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);

      // only cleanup call if this was the LAST socket
      if (sockets.size === 0) {
        cleanupCallOnDisconnect(io, userId, onlineUsers);
        onlineUsers.delete(userId);
      }
    }

    console.log('🔴 Socket disconnected:', socket.id);
  });
};

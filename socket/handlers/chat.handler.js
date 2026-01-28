import { saveMessage } from '../../database/index.js';
import { SOCKET_EVENTS } from '../events.js';

export const chatHandler = (io, socket) => {
  socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId => {
    socket.join(conversationId);
  });

  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async data => {
    try {
      const { conversationId, message } = data;

      const savedMessage = await saveMessage(
        conversationId,
        socket.user.userId,
        message
      );

      io.to(conversationId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, savedMessage);
    } catch (err) {
      console.error('❌ Message save failed:', err);
      socket.emit('error', 'Message not saved');
    }
  });
};

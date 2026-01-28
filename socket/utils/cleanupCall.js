import { callStates } from '../call.state.js';
import { SOCKET_EVENTS } from '../events.js';

export const cleanupCallOnDisconnect = (io, userId, onlineUsers) => {
  const state = callStates.get(userId);
  if (!state) return;

  const peerId = state.peerId;
  const peerState = callStates.get(peerId);

  // Clear timeout if ringing
  if (state.state === 'RINGING' && state.timeout) {
    clearTimeout(state.timeout);
  }

  // Remove call state
  callStates.delete(userId);
  callStates.delete(peerId);

  // Notify peer
  const peerSocketId = onlineUsers.get(peerId);
  if (peerSocketId) {
    io.to(peerSocketId).emit(SOCKET_EVENTS.CALL_ENDED, {
      by: userId,
      reason: 'disconnect',
    });
  }
};

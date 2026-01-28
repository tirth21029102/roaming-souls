// export const callHandler = (io, socket, onlineUsers) => {
//   socket.on('call_offer', ({ to, offer }) => {
//     const targetSocketId = onlineUsers.get(to);
//     if (!targetSocketId) return;

//     io.to(targetSocketId).emit('call_offer', {
//       from: socket.user.userId,
//       offer,
//     });
//   });

//   socket.on('call_answer', ({ to, answer }) => {
//     const targetSocketId = onlineUsers.get(to);
//     if (!targetSocketId) return;

//     io.to(targetSocketId).emit('call_answer', {
//       from: socket.user.userId,
//       answer,
//     });
//   });

//   socket.on('ice_candidate', ({ to, candidate }) => {
//     const targetSocketId = onlineUsers.get(to);
//     if (!targetSocketId) return;

//     io.to(targetSocketId).emit('ice_candidate', {
//       from: socket.user.userId,
//       candidate,
//     });
//   });
// };

// import { callStates } from '../callState.js';

// const CALL_TIMEOUT_MS = 30_000;

// export const callHandler = (io, socket, onlineUsers) => {
//   socket.on('call_offer', ({ to, offer }) => {
//     const callerId = socket.user.userId;

//     // 1. Check if caller is already in a call
//     if (callStates.has(callerId)) {
//       return socket.emit('call_error', 'you are already in a call');
//     }

//     // 2. Check if callee is busy
//     if (callStates.has(to)) {
//       return socket.emit('call_busy', { to });
//     }

//     const targetSockets = onlineUsers.get(to);
//     if (!targetSockets) {
//       return socket.emit('call_error', 'User is offline');
//     }

//     // ⏱️ creatING timeout
//     const timeout = setTimeout(() => {
//       // cleanup both users
//       callStates.delete(callerId);
//       callStates.delete(to);

//       socket.emit('call_timeout', { to });
//     }, CALL_TIMEOUT_MS);

//     // 3. Set call state for both users
//     callStates.set(callerId, {
//       peerId: to,
//       state: 'RINGING',
//       timeout,
//     });

//     callStates.set(to, {
//       peerId: callerId,
//       state: 'RINGING',
//       timeout,
//     });

//     // 4. Send offer
//     for (const socketId of targetSockets) {
//       io.to(socketId).emit('call_offer', {
//         from: callerId,
//         offer,
//       });
//     }
//   });

//   socket.on('call_answer', ({ to, answer }) => {
//     const userId = socket.user.userId;
//     const callerState = callStates.get(to);
//     const calleeState = callStates.get(userId);

//     // 1. Validate call existence
//     if (
//       !callerState ||
//       !calleeState ||
//       callerState.peerId !== userId ||
//       calleeState.peerId !== to ||
//       callerState.state !== 'RINGING'
//     ) {
//       return socket.emit('call_error', 'Invalid or expired call');
//     }

//     // 2. Clear timeout (IMPORTANT)
//     clearTimeout(callerState.timeout);

//     // 3. Update state
//     callerState.state = 'IN_CALL';
//     calleeState.state = 'IN_CALL';

//     // 4. Forward answer
//     const targetSocketId = onlineUsers.get(to);
//     if (!targetSocketId) {
//       return socket.emit('call_error', 'Caller disconnected');
//     }

//     io.to(targetSocketId).emit('call_answer', {
//       from: userId,
//       answer,
//     });
//   });

//   socket.on('call_reject', ({ to }) => {
//     const userId = socket.user.userId;
//     const callerState = callStates.get(to);
//     const calleeState = callStates.get(userId);

//     // 1. Validate rejection
//     if (
//       !callerState ||
//       !calleeState ||
//       callerState.peerId !== userId ||
//       calleeState.peerId !== to ||
//       callerState.state !== 'RINGING'
//     ) {
//       return socket.emit('call_error', 'Invalid call rejection');
//     }

//     // 2. Clear timeout
//     clearTimeout(callerState.timeout);

//     // 3. Cleanup call state
//     callStates.delete(to);
//     callStates.delete(userId);

//     // 4. Notify caller
//     const callerSocketId = onlineUsers.get(to);
//     if (callerSocketId) {
//       io.to(callerSocketId).emit('call_rejected', {
//         by: userId,
//       });
//     }
//   });

//   // socket.on('call_end', () => {
//   //   const userId = socket.user.userId;
//   //   const state = callStates.get(userId);
//   //   if (!state) return;

//   //   const peerId = state.peerId;
//   //   const peerState = callStates.get(peerId);

//   //   // 1. Clear timeout if ringing
//   //   if (state.state === 'RINGING' && state.timeout) {
//   //     clearTimeout(state.timeout);
//   //   }

//   //   // 2. Cleanup state
//   //   callStates.delete(userId);
//   //   callStates.delete(peerId);

//   //   // 3. Notify peer
//   //   const peerSocketId = onlineUsers.get(peerId);
//   //   if (peerSocketId) {
//   //     io.to(peerSocketId).emit('call_ended', {
//   //       by: userId,
//   //     });
//   //   }
//   // });
//   socket.on('call_end', () => {
//     const callerUserId = socket.user.userId;
//     const callerCallState = callStates.get(callerUserId);
//     if (!callerCallState) return;

//     const receiverUserId = callerCallState.peerId;
//     const receiverCallState = callStates.get(receiverUserId);

//     // Clear ringing timeout if the caller was still ringing
//     if (callerCallState.status === 'RINGING' && callerCallState.ringTimeout) {
//       clearTimeout(callerCallState.ringTimeout);
//     }

//     // Remove call state for both users
//     callStates.delete(callerUserId);
//     callStates.delete(receiverUserId);

//     // Notify the receiver that the call has ended
//     const receiverSocketId = onlineUsers.get(receiverUserId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('call_ended', {
//         endedBy: callerUserId,
//       });
//     }
//   });
// };

import { callStates } from '../call.state.js';
import { SOCKET_EVENTS } from '../events.js';

const CALL_TIMEOUT_MS = 30_000;

export const callHandler = (io, socket, onlineUsers) => {
  const userId = socket.user.userId;
  // console.log(onlineUsers);

  // ===================== CALL OFFER =====================
  socket.on(SOCKET_EVENTS.CALL_OFFER, ({ to, offer }) => {
    if (callStates.has(userId)) {
      return socket.emit(SOCKET_EVENTS.CALL_ERROR, 'You are already in a call');
    }

    if (callStates.has(to)) {
      return socket.emit(SOCKET_EVENTS.CALL_BUSY, { to });
    }

    const targetSockets = onlineUsers.get(to);
    if (!targetSockets || targetSockets.size === 0) {
      return socket.emit(SOCKET_EVENTS.CALL_ERROR, 'User is offline');
    }

    const timeout = setTimeout(() => {
      callStates.delete(userId);
      callStates.delete(to);

      socket.emit(SOCKET_EVENTS.CALL_TIMEOUT, { to });
    }, CALL_TIMEOUT_MS);

    callStates.set(userId, {
      peerId: to,
      state: 'RINGING',
      timeout,
    });

    callStates.set(to, {
      peerId: userId,
      state: 'RINGING',
      timeout,
    });

    for (const socketId of targetSockets) {
      io.to(socketId).emit(SOCKET_EVENTS.CALL_OFFER, {
        from: userId,
        offer,
      });
    }
  });

  // ===================== CALL ANSWER =====================
  socket.on(SOCKET_EVENTS.CALL_ANSWER, ({ to, answer }) => {
    const callerState = callStates.get(to);
    const calleeState = callStates.get(userId);

    if (
      !callerState ||
      !calleeState ||
      callerState.peerId !== userId ||
      calleeState.peerId !== to ||
      callerState.state !== 'RINGING'
    ) {
      return socket.emit(SOCKET_EVENTS.CALL_ERROR, 'Invalid or expired call');
    }

    clearTimeout(callerState.timeout);

    callerState.state = 'IN_CALL';
    calleeState.state = 'IN_CALL';

    const callerSockets = onlineUsers.get(to);
    if (!callerSockets) return;

    for (const socketId of callerSockets) {
      io.to(socketId).emit(SOCKET_EVENTS.CALL_ANSWER, {
        from: userId,
        answer,
      });
    }
  });

  // ===================== CALL REJECT =====================
  socket.on(SOCKET_EVENTS.CALL_REJECTED, ({ to }) => {
    const callerState = callStates.get(to);
    const calleeState = callStates.get(userId);

    if (
      !callerState ||
      !calleeState ||
      callerState.peerId !== userId ||
      calleeState.peerId !== to ||
      callerState.state !== 'RINGING'
    ) {
      return socket.emit(SOCKET_EVENTS.CALL_ERROR, 'Invalid call rejection');
    }

    clearTimeout(callerState.timeout);

    callStates.delete(to);
    callStates.delete(userId);

    const callerSockets = onlineUsers.get(to);
    if (callerSockets) {
      for (const socketId of callerSockets) {
        io.to(socketId).emit(SOCKET_EVENTS.CALL_REJECTED, {
          by: userId,
        });
      }
    }
  });

  // ===================== CALL END =====================
  socket.on(SOCKET_EVENTS.CALL_ENDED, () => {
    const state = callStates.get(userId);
    if (!state) return;

    const peerId = state.peerId;

    if (state.state === 'RINGING' && state.timeout) {
      clearTimeout(state.timeout);
    }

    callStates.delete(userId);
    callStates.delete(peerId);

    const peerSockets = onlineUsers.get(peerId);
    if (peerSockets) {
      for (const socketId of peerSockets) {
        io.to(socketId).emit(SOCKET_EVENTS.CALL_ENDED, {
          by: userId,
        });
      }
    }
  });

  // ===================== ICE CANDIDATE =====================
  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, ({ to, candidate }) => {
    const state = callStates.get(userId);

    // Validate that this user is in a call with `to`
    if (!state || state.peerId !== to) {
      return;
    }

    const peerSockets = onlineUsers.get(to);
    if (!peerSockets) return;

    for (const socketId of peerSockets) {
      io.to(socketId).emit(SOCKET_EVENTS.ICE_CANDIDATE, {
        from: userId,
        candidate,
      });
    }
  });

  // ===================== CALL MEDIA ERROR =====================
  socket.on(SOCKET_EVENTS.CALL_MEDIA_ERROR, ({ to, message }) => {
    const state = callStates.get(userId);

    // Must be in a call or ringing with `to`
    if (!state || state.peerId !== to) return;

    // Clear timeout if still ringing
    if (state.state === 'RINGING' && state.timeout) {
      clearTimeout(state.timeout);
    }

    // Cleanup call state
    callStates.delete(userId);
    callStates.delete(to);

    const peerSockets = onlineUsers.get(to);
    if (!peerSockets) return;

    for (const socketId of peerSockets) {
      io.to(socketId).emit(SOCKET_EVENTS.CALL_ERROR, {
        from: userId,
        message: message || 'Peer media device error',
      });
    }
  });
};

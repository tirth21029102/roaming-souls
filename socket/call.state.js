export const callStates = new Map();

/*
Structure:

callStates.set(userId, {
  peerId: otherUserId,
  state: 'RINGING' | 'IN_CALL',
  timeout: TimeoutObject
});
*/

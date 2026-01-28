export const SOCKET_EVENTS = {
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',

  CALL_OFFER: 'call_offer',
  CALL_ANSWER: 'call_answer',
  ICE_CANDIDATE: 'ice_candidate',
  CALL_REJECTED: 'call_rejected',
  CALL_TIMEOUT: 'call_timeout',
  CALL_ENDED: 'call_ended',
  CALL_ERROR: 'call_error',
  CALL_BUSY: 'call_busy',
  CALL_MEDIA_ERROR: 'call_media_error',

  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
};

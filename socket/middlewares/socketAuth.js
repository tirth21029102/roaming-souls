import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import AppError from '../../utilities/appError.js';

export const socketAuth = (socket, next) => {
  try {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) return next(new AppError('Authentication required', 401));

    const cookies = cookie.parse(rawCookie);
    const accessToken = cookies.access_token;
    if (!accessToken) {
      return next(new AppError('access token missing', 401));
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('TOKEN_EXPIRED', 401));
    }
    next(new AppError('INVALID_TOKEN', 401));
  }
};

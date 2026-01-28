import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import AppError from '../utilities/appError.js';

export const protect = (req, res, next) => {
  try {
    // 1️⃣ Get raw cookie header
    const rawCookie = req.headers.cookie;
    if (!rawCookie) {
      return next(new AppError('Authentication required', 401));
    }

    // 2️⃣ Parse cookies
    const cookies = cookie.parse(rawCookie);
    const accessToken = cookies.access_token;

    if (!accessToken) {
      return next(new AppError('Access token missing', 401));
    }

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    // 4️⃣ Attach user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('TOKEN_EXPIRED', 401));
    }
    next(new AppError('INVALID_TOKEN', 401));
  }
};

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const signAccessToken = user => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const signRefreshToken = user => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export const hashToken = token => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

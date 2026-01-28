import { findRefreshToken, getAllUserFromDb } from '../database/index.js';
import jwt from 'jsonwebtoken';
import { hashToken, signAccessToken } from './token.service.js';

export const generateAccessTokenFromRefreshToken = async refreshToken => {
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const tokenhash = hashToken(refreshToken);
  const validToken = await findRefreshToken(tokenhash);
  if (!validToken) throw new Error('invalid_refresh_token');

  const [user] = await getAllUserFromDb(payload.email);
  return signAccessToken(user);
};

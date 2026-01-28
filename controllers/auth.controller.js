import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import {
  getAllUserFromDb,
  saveRefreshTokenToDb,
  deleteRefreshToken,
  insertNewUser,
  delUsersFromDb,
  markUserVerified,
} from '../database/index.js';

import AppError from '../utilities/appError.js';
import catchAsync from '../utilities/catchAsync.js';

import {
  hashToken,
  signAccessToken,
  signRefreshToken,
} from '../utilities/token.service.js';

import { generateAccessTokenFromRefreshToken } from '../utilities/generateAccFromRefresh.js';
import { sendOTPEmail } from '../utilities/sendEmail.js';
import { generateOTP } from '../utilities/generateOtp.js';

const INVALID_CREDENTIALS_MSG = 'Invalid email or password';

// ─────────────────────────────
// Signup
// ─────────────────────────────
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;
  console.log('hi i am pranav');
  if (!name || !email || !password || !file) {
    return next(
      new AppError('Please provide name, email, password and image', 400),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { otp, hashedOtp } = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const result = await insertNewUser(
    name,
    email,
    hashedPassword,
    file.filename,
    file.path,
    hashedOtp,
    otpExpiry,
  );

  if (!result) {
    return next(new AppError('Failed to create user', 500));
  }

  await sendOTPEmail(email, otp);

  res.status(201).json({
    status: 'success',
    message: 'User created successfully. Please verify your email.',
  });
});

// ─────────────────────────────
// Login
// ─────────────────────────────
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const [user] = await getAllUserFromDb(email);

  if (!user) {
    return next(new AppError(INVALID_CREDENTIALS_MSG, 401));
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return next(new AppError(INVALID_CREDENTIALS_MSG, 401));
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await saveRefreshTokenToDb({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: { user },
  });
});

// ─────────────────────────────
// Logout
// ─────────────────────────────
export const logout = catchAsync(async (req, res) => {
  const token = req.cookies.refresh_token;

  if (token) {
    await deleteRefreshToken(hashToken(token));
  }

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

// ─────────────────────────────
// Get current user (session check)
// ─────────────────────────────
export const getCurrentUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new AppError('Not authenticated', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const [user] = await getAllUserFromDb(decoded.email);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired', 401));
    }

    return next(new AppError('Invalid access token', 401));
  }
});

// ─────────────────────────────
// Refresh token
// ─────────────────────────────
export const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refresh_token;

  if (!token) {
    return next(new AppError('Refresh token missing', 401));
  }

  try {
    const newAccessToken = await generateAccessTokenFromRefreshToken(token);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed',
    });
  } catch {
    return next(new AppError('Invalid refresh token', 403));
  }
});

// ─────────────────────────────
// Verify email
// ─────────────────────────────
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError('Email and OTP are required', 400));
  }

  const [user] = await getAllUserFromDb(email);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.is_verified) {
    return next(new AppError('Email already verified', 400));
  }

  if (new Date() > user.otp_expires_at) {
    return next(new AppError('OTP expired', 400));
  }

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  if (hashedOtp !== user.email_otp) {
    return next(new AppError('Invalid OTP', 400));
  }

  await markUserVerified(email);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully',
  });
});

// ─────────────────────────────
// Admin / utility
// ─────────────────────────────
export const deleteAllUsers = catchAsync(async (req, res) => {
  await delUsersFromDb();

  res.status(200).json({
    status: 'success',
    message: 'All users deleted successfully',
  });
});

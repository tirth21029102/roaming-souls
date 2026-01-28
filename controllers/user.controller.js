import { getAllUsersFromDB, getAllUserFriends } from '../database/index.js';

import catchAsync from '../utilities/catchAsync.js';
import AppError from '../utilities/appError.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const result = await getAllUsersFromDB();

  if (!result) {
    return next(new AppError('Unable to fetch users', 400));
  }

  res.status(200).json({
    status: 'success',
    data: { result },
  });
});

export const getUserFriends = catchAsync(async (req, res, next) => {
  const result = await getAllUserFriends(req.params.id);

  if (!result) {
    return next(new AppError('Unable to fetch user friends', 400));
  }

  res.status(200).json({
    status: 'success',
    data: { result },
  });
});

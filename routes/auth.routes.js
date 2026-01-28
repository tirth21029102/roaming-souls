import express from 'express';
import {
  login,
  signup,
  logout,
  refreshToken,
  getCurrentUser,
  verifyEmail,
  deleteAllUsers,
} from '../controllers/auth.controller.js';

import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', upload.single('image'), signup);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

router.get('/me', getCurrentUser);
router.post('/verify-email', verifyEmail);

router.delete('/users', deleteAllUsers);

export default router;

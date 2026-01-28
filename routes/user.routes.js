import express from 'express';
import { getAllUsers, getUserFriends } from '../controllers/user.controller.js';

const router = express.Router();

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id/friends
router.get('/:id/friends', getUserFriends);

export default router;

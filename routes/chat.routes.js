import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createOrGetPrivateConversation,
  chatMsgsLoaderController,
} from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/private', protect, createOrGetPrivateConversation);
router.get('/:id/messages', chatMsgsLoaderController);

export default router;

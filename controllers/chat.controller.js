import { query1, query2, query3, getMsgsFromDB } from '../database/index.js';
/**
 * Create or get private conversation between logged-in user and another user
 */
export const createOrGetPrivateConversation = async (req, res, next) => {
  try {
    const userId1 = req.user.id; // logged-in user
    const { userId: userId2 } = req.body;

    if (!userId2) {
      return res.status(400).json({ message: 'userId is required' });
    }

    if (userId1 === userId2) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    /**
     * 1️⃣ Check if private conversation already exists
     */
    const existing = await query1(userId1, userId2);
    if (existing && existing.length > 0) {
      return res.json({ conversationId: existing[0].id });
    }
    /**
     * 2️⃣ Create new conversation
     */
    const conversationResult = await query2();

    const conversationId = conversationResult.insertId;
    /**
     * 3️⃣ Add participants
     */
    await query3(conversationId, userId1, userId2);

    return res.status(201).json({ conversationId });
  } catch (err) {
    next(err);
  }
};

export const chatMsgsLoaderController = async (req, res) => {
  const conversationId = req.params.id;
  const rows = await getMsgsFromDB(conversationId);
  return res.status(200).json({
    status: 'success',
    data: { rows },
  });
};

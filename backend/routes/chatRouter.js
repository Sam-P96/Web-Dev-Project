import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendChatMessage } from '../controllers/chatControllers.js';

const ChatRouter = express.Router();

// Chat is public (widget is on every page) and every message will cost an LLM call,
// so it is limited per IP. Only applies to /api/chat, not the rest of the API.
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 20,
  standardHeaders: 'draft-8', // RateLimit-* headers so the client can see when to retry
  legacyHeaders: false,
  // Default response is plain text; keep the { error } shape used everywhere else
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ error: 'Too many messages, please try again later.' });
  },
});

//ROUTES

//POST /chat
ChatRouter.post('/', chatLimiter, sendChatMessage);

export default ChatRouter;

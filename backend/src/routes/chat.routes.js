import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { rateLimit } from 'express-rate-limit';
import { sendMessage, getChatHistory, clearSession } from '../controllers/chat.controller.js';

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'Trop de messages. Attendez 1 minute.' }
});

router.use(optionalAuth);
router.post('/message', chatLimiter, sendMessage);
router.get('/history/:sessionId', getChatHistory);
router.delete('/session/:sessionId', clearSession);

export default router;

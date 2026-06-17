import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getUserFavorites, toggleFavorite, checkFavorite } from '../controllers/favorites.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', getUserFavorites);
router.post('/toggle', toggleFavorite);
router.get('/check/:siteId', checkFavorite);

export default router;

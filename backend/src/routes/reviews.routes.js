import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';
import { createReview, getSiteReviews, approveReview, deleteReview } from '../controllers/reviews.controller.js';

const router = Router();

router.get('/site/:siteId', getSiteReviews);
router.post('/', requireAuth, createReview);
router.patch('/:id/approuver', requireAuth, requireAdmin, approveReview);
router.delete('/:id', requireAuth, requireAdmin, deleteReview);

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';
import {
  getSites, getSiteBySlug, createSite, updateSite, deleteSite, getSitesForMap
} from '../controllers/sites.controller.js';

const router = Router();

router.get('/', getSites);
router.get('/map', getSitesForMap);
router.get('/:slug', getSiteBySlug);
router.post('/', requireAuth, requireAdmin, createSite);
router.put('/:id', requireAuth, requireAdmin, updateSite);
router.delete('/:id', requireAuth, requireAdmin, deleteSite);

export default router;

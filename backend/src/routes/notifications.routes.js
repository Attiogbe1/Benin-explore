import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', requireAuth, ah(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(notifications);
}));

router.patch('/tout-lu', requireAuth, ah(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, lu: false },
    data: { lu: true }
  });
  res.json({ ok: true });
}));

router.patch('/:id/lu', requireAuth, ah(async (req, res) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { lu: true }
  });
  res.json({ ok: true });
}));

export default router;

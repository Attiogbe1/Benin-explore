import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

// GET /api/service-reviews/service/:serviceId — avis d'un service
router.get('/service/:serviceId', ah(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [data, total] = await Promise.all([
    prisma.serviceReview.findMany({
      where: { serviceId: req.params.serviceId },
      include: { user: { select: { nom: true, prenom: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip, take: parseInt(limit)
    }),
    prisma.serviceReview.count({ where: { serviceId: req.params.serviceId } })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
}));

// GET /api/service-reviews/provider/:providerId — tous les avis d'un prestataire
router.get('/provider/:providerId', ah(async (req, res) => {
  const data = await prisma.serviceReview.findMany({
    where: { service: { providerId: req.params.providerId } },
    include: {
      user: { select: { nom: true, prenom: true, avatar: true } },
      service: { select: { nomFr: true, type: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  res.json(data);
}));

// POST /api/service-reviews — créer un avis (après réservation TERMINEE)
router.post('/', requireAuth, ah(async (req, res) => {
  const { reservationId, note, commentaire } = req.body;
  const userId = req.user.id;

  if (!note || note < 1 || note > 5) return res.status(400).json({ error: 'Note invalide (1-5)' });
  if (!commentaire?.trim()) return res.status(400).json({ error: 'Commentaire requis' });

  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, userId },
    include: { serviceReview: true }
  });

  if (!reservation) return res.status(404).json({ error: 'Réservation introuvable' });
  if (reservation.statut !== 'TERMINEE') return res.status(400).json({ error: 'Vous ne pouvez noter qu\'après la fin du service' });
  if (reservation.serviceReview) return res.status(409).json({ error: 'Vous avez déjà laissé un avis pour cette réservation' });

  const review = await prisma.serviceReview.create({
    data: { userId, serviceId: reservation.serviceId, reservationId, note, commentaire },
    include: { user: { select: { nom: true, prenom: true, avatar: true } } }
  });

  // Mettre à jour la note moyenne du service
  const stats = await prisma.serviceReview.aggregate({
    where: { serviceId: reservation.serviceId },
    _avg: { note: true },
    _count: { note: true }
  });
  await prisma.service.update({
    where: { id: reservation.serviceId },
    data: { noteMoyenne: stats._avg.note ?? 0, nombreAvis: stats._count.note }
  });

  res.status(201).json(review);
}));

export default router;

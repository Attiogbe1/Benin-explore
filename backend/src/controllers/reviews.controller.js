import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

export const createReview = ah(async (req, res) => {
  const { siteId, note, commentaire, photos = [] } = req.body;
  const userId = req.user.id;

  if (note < 1 || note > 5) return res.status(400).json({ error: 'La note doit être entre 1 et 5' });

  const existing = await prisma.review.findUnique({ where: { userId_siteId: { userId, siteId } } });
  if (existing) return res.status(409).json({ error: 'Avis déjà soumis pour ce site' });

  const review = await prisma.review.create({
    data: { userId, siteId, note, commentaire, photos, estApprouve: true },
    include: { user: { select: { nom: true, prenom: true, avatar: true } } }
  });

  await updateSiteRating(siteId);
  res.status(201).json(review);
});

export const getSiteReviews = ah(async (req, res) => {
  const { siteId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: { siteId, estApprouve: true },
      include: { user: { select: { nom: true, prenom: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip, take: parseInt(limit)
    }),
    prisma.review.count({ where: { siteId, estApprouve: true } })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

export const approveReview = ah(async (req, res) => {
  const review = await prisma.review.update({ where: { id: req.params.id }, data: { estApprouve: true } });
  await updateSiteRating(review.siteId);
  res.json(review);
});

export const deleteReview = ah(async (req, res) => {
  const review = await prisma.review.delete({ where: { id: req.params.id } });
  await updateSiteRating(review.siteId);
  res.json({ success: true });
});

async function updateSiteRating(siteId) {
  const result = await prisma.review.aggregate({
    where: { siteId, estApprouve: true },
    _avg: { note: true },
    _count: { note: true }
  });
  await prisma.touristSite.update({
    where: { id: siteId },
    data: { noteMoyenne: result._avg.note || 0, nombreAvis: result._count.note, popularite: { increment: 1 } }
  });
}

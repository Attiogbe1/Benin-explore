import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requirePrestataire } from '../middleware/roles.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

/* ──────────────────────────────────────────────────────────
   GET /  — liste des services disponibles (public)
────────────────────────────────────────────────────────── */
router.get('/', ah(async (req, res) => {
  const { type, maxPrix, minPrix, providerId, search, page = 1, limit = 12 } = req.query;
  const where = { disponible: true };
  if (type)       where.type = type;
  if (providerId) where.providerId = providerId;
  if (maxPrix)    where.prix = { ...where.prix, lte: parseFloat(maxPrix) };
  if (minPrix)    where.prix = { ...where.prix, gte: parseFloat(minPrix) };
  if (search) {
    where.OR = [
      { nomFr: { contains: search, mode: 'insensitive' } },
      { descriptionFr: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.service.findMany({
      where, skip, take: parseInt(limit),
      include: {
        provider: { select: { id: true, nomEntreprise: true, estVerifie: true, logo: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.service.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
}));

/* ──────────────────────────────────────────────────────────
   GET /mes-services  — services du prestataire connecté
────────────────────────────────────────────────────────── */
router.get('/mes-services', requireAuth, requirePrestataire, ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
  if (!provider) return res.status(404).json({ error: 'Profil prestataire introuvable' });

  const services = await prisma.service.findMany({
    where: { providerId: provider.id },
    include: {
      _count: { select: { reservations: true, reviews: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(services);
}));

/* ──────────────────────────────────────────────────────────
   GET /:id  — détail d'un service
────────────────────────────────────────────────────────── */
router.get('/:id', ah(async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: {
      provider: {
        select: { id: true, nomEntreprise: true, estVerifie: true, logo: true, telephone: true, email: true }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { prenom: true, nom: true, avatar: true } } }
      }
    }
  });
  if (!service) return res.status(404).json({ error: 'Service introuvable' });
  res.json(service);
}));

/* ──────────────────────────────────────────────────────────
   POST /  — créer un service (prestataire)
────────────────────────────────────────────────────────── */
router.post('/', requireAuth, requirePrestataire, ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
  if (!provider) return res.status(404).json({ error: 'Profil prestataire requis. Créez votre profil prestataire d\'abord.' });

  const { type, nomFr, nomEn, descriptionFr, descriptionEn, prix, devise, capacite, duree, images, videoUrl } = req.body;

  if (!type || !nomFr || !descriptionFr || prix === undefined) {
    return res.status(400).json({ error: 'Champs obligatoires : type, nomFr, descriptionFr, prix' });
  }
  const TYPES_VALIDES = ['HEBERGEMENT', 'TRANSPORT', 'GUIDE', 'ACTIVITE', 'RESTAURANT'];
  if (!TYPES_VALIDES.includes(type)) {
    return res.status(400).json({ error: `Type invalide. Valeurs : ${TYPES_VALIDES.join(', ')}` });
  }
  if (parseFloat(prix) < 0) {
    return res.status(400).json({ error: 'Le prix ne peut pas être négatif' });
  }

  const service = await prisma.service.create({
    data: {
      providerId: provider.id,
      type,
      nomFr: nomFr.trim(),
      nomEn: (nomEn || nomFr).trim(),
      descriptionFr: descriptionFr.trim(),
      descriptionEn: (descriptionEn || '').trim(),
      prix: parseFloat(prix),
      devise: devise || 'XOF',
      capacite: capacite ? parseInt(capacite) : null,
      duree: duree ? parseInt(duree) : null,
      images: Array.isArray(images) ? images : [],
      videoUrl: videoUrl || null,
      disponible: true
    }
  });
  res.status(201).json(service);
}));

/* ──────────────────────────────────────────────────────────
   PUT /:id  — modifier un service (propriétaire seulement)
────────────────────────────────────────────────────────── */
router.put('/:id', requireAuth, requirePrestataire, ah(async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service introuvable' });

  if (req.user.role !== 'ADMIN') {
    const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
    if (!provider || service.providerId !== provider.id) {
      return res.status(403).json({ error: 'Non autorisé — ce service ne vous appartient pas' });
    }
  }

  const { type, nomFr, nomEn, descriptionFr, descriptionEn, prix, devise, capacite, duree, images, videoUrl, disponible } = req.body;

  if (type) {
    const TYPES_VALIDES = ['HEBERGEMENT', 'TRANSPORT', 'GUIDE', 'ACTIVITE', 'RESTAURANT'];
    if (!TYPES_VALIDES.includes(type)) {
      return res.status(400).json({ error: `Type invalide. Valeurs : ${TYPES_VALIDES.join(', ')}` });
    }
  }

  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: {
      ...(type !== undefined && { type }),
      ...(nomFr !== undefined && { nomFr: nomFr.trim() }),
      ...(nomEn !== undefined && { nomEn: nomEn.trim() }),
      ...(descriptionFr !== undefined && { descriptionFr: descriptionFr.trim() }),
      ...(descriptionEn !== undefined && { descriptionEn: descriptionEn.trim() }),
      ...(prix !== undefined && { prix: parseFloat(prix) }),
      ...(devise !== undefined && { devise }),
      ...(capacite !== undefined && { capacite: capacite ? parseInt(capacite) : null }),
      ...(duree !== undefined && { duree: duree ? parseInt(duree) : null }),
      ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(disponible !== undefined && { disponible: Boolean(disponible) }),
    }
  });
  res.json(updated);
}));

/* ──────────────────────────────────────────────────────────
   PATCH /:id/disponibilite  — activer / désactiver
────────────────────────────────────────────────────────── */
router.patch('/:id/disponibilite', requireAuth, requirePrestataire, ah(async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service introuvable' });

  if (req.user.role !== 'ADMIN') {
    const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
    if (!provider || service.providerId !== provider.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
  }

  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: { disponible: !service.disponible }
  });
  res.json({ disponible: updated.disponible });
}));

/* ──────────────────────────────────────────────────────────
   DELETE /:id  — supprimer un service (propriétaire ou admin)
────────────────────────────────────────────────────────── */
router.delete('/:id', requireAuth, requirePrestataire, ah(async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service introuvable' });

  if (req.user.role !== 'ADMIN') {
    const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
    if (!provider || service.providerId !== provider.id) {
      return res.status(403).json({ error: 'Non autorisé — ce service ne vous appartient pas' });
    }
  }

  const activeRes = await prisma.reservation.count({
    where: { serviceId: req.params.id, statut: { in: ['EN_ATTENTE', 'CONFIRMEE', 'EN_COURS'] } }
  });
  if (activeRes > 0) {
    return res.status(400).json({
      error: `Impossible de supprimer : ${activeRes} réservation(s) active(s) en cours`
    });
  }

  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ message: 'Service supprimé avec succès' });
}));

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requirePrestataire } from '../middleware/roles.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

/* ──────────────────────────────────────────────────────────
   GET /  — liste des prestataires vérifiés (public)
────────────────────────────────────────────────────────── */
router.get('/', ah(async (req, res) => {
  const { type, search, page = 1, limit = 12 } = req.query;
  const where = { estVerifie: true };

  if (search) {
    where.OR = [
      { nomEntreprise: { contains: search, mode: 'insensitive' } },
      { descriptionFr:  { contains: search, mode: 'insensitive' } }
    ];
  }
  if (type) where.services = { some: { type, disponible: true } };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.provider.findMany({
      where, skip, take: parseInt(limit),
      include: {
        services: { where: { disponible: true }, select: { type: true, prix: true, nomFr: true } },
        _count: { select: { reservations: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.provider.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
}));

/* ──────────────────────────────────────────────────────────
   GET /mon-profil  — profil du prestataire connecté
────────────────────────────────────────────────────────── */
router.get('/mon-profil', requireAuth, ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({
    where: { userId: req.user.id },
    include: {
      services: {
        include: { _count: { select: { reservations: true, reviews: true } } },
        orderBy: { createdAt: 'desc' }
      },
      _count: { select: { reservations: true } }
    }
  });
  if (!provider) return res.status(404).json({ error: 'Profil prestataire introuvable' });
  res.json(provider);
}));

/* ──────────────────────────────────────────────────────────
   GET /mes-reservations  — réservations reçues (prestataire)
────────────────────────────────────────────────────────── */
router.get('/mes-reservations', requireAuth, requirePrestataire, ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
  if (!provider) return res.status(404).json({ error: 'Profil prestataire introuvable' });

  const { statut, page = 1, limit = 20 } = req.query;
  const where = { providerId: provider.id };
  if (statut) where.statut = statut;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.reservation.findMany({
      where, skip, take: parseInt(limit),
      include: {
        service: { select: { nomFr: true, type: true, prix: true } },
        user:    { select: { nom: true, prenom: true, email: true, telephone: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.reservation.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
}));

/* ──────────────────────────────────────────────────────────
   GET /stats  — statistiques du prestataire connecté
────────────────────────────────────────────────────────── */
router.get('/stats', requireAuth, requirePrestataire, ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user.id } });
  if (!provider) return res.status(404).json({ error: 'Profil prestataire introuvable' });

  const [
    totalReservations,
    reservationsEnCours,
    revenu,
    totalServices,
    servicesActifs
  ] = await Promise.all([
    prisma.reservation.count({ where: { providerId: provider.id } }),
    prisma.reservation.count({
      where: { providerId: provider.id, statut: { in: ['EN_ATTENTE', 'CONFIRMEE', 'EN_COURS'] } }
    }),
    prisma.reservation.aggregate({
      where: { providerId: provider.id, statut: { in: ['CONFIRMEE', 'TERMINEE'] } },
      _sum: { prixTotal: true }
    }),
    prisma.service.count({ where: { providerId: provider.id } }),
    prisma.service.count({ where: { providerId: provider.id, disponible: true } }),
  ]);

  const reservationsRecentes = await prisma.reservation.findMany({
    where: { providerId: provider.id },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      service: { select: { nomFr: true } },
      user:    { select: { prenom: true, nom: true } }
    }
  });

  res.json({
    stats: {
      totalReservations,
      reservationsEnCours,
      revenu: revenu._sum.prixTotal || 0,
      totalServices,
      servicesActifs
    },
    reservationsRecentes
  });
}));

/* ──────────────────────────────────────────────────────────
   GET /:id  — profil public d'un prestataire
────────────────────────────────────────────────────────── */
router.get('/:id', ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({
    where: { id: req.params.id },
    include: {
      services: { where: { disponible: true }, orderBy: { createdAt: 'desc' } },
      _count: { select: { reservations: true } }
    }
  });
  if (!provider) return res.status(404).json({ error: 'Prestataire introuvable' });
  res.json(provider);
}));

/* ──────────────────────────────────────────────────────────
   POST /  — devenir prestataire
────────────────────────────────────────────────────────── */
router.post('/', requireAuth, ah(async (req, res) => {
  const exists = await prisma.provider.findUnique({ where: { userId: req.user.id } });
  if (exists) return res.status(409).json({ error: 'Vous avez déjà un profil prestataire' });

  const { nomEntreprise, descriptionFr, descriptionEn, telephone, email, adresse, siteWeb, logo } = req.body;

  if (!nomEntreprise?.trim() || !descriptionFr?.trim() || !telephone?.trim() || !email?.trim() || !adresse?.trim()) {
    return res.status(400).json({
      error: 'Champs obligatoires : nomEntreprise, descriptionFr, telephone, email, adresse'
    });
  }

  const provider = await prisma.provider.create({
    data: {
      userId: req.user.id,
      nomEntreprise: nomEntreprise.trim(),
      descriptionFr: descriptionFr.trim(),
      descriptionEn: (descriptionEn || '').trim(),
      telephone: telephone.trim(),
      email: email.trim(),
      adresse: adresse.trim(),
      siteWeb: siteWeb || null,
      logo: logo || null,
      estVerifie: false
    }
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { role: 'PRESTATAIRE' }
  });

  res.status(201).json(provider);
}));

/* ──────────────────────────────────────────────────────────
   PUT /:id  — modifier le profil prestataire (propriétaire)
────────────────────────────────────────────────────────── */
router.put('/:id', requireAuth, requirePrestataire, ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({ where: { id: req.params.id } });
  if (!provider) return res.status(404).json({ error: 'Prestataire introuvable' });

  if (req.user.role !== 'ADMIN' && provider.userId !== req.user.id) {
    return res.status(403).json({ error: 'Non autorisé — ce profil ne vous appartient pas' });
  }

  const { nomEntreprise, descriptionFr, descriptionEn, telephone, email, adresse, siteWeb, logo, images } = req.body;

  const updated = await prisma.provider.update({
    where: { id: req.params.id },
    data: {
      ...(nomEntreprise !== undefined && { nomEntreprise: nomEntreprise.trim() }),
      ...(descriptionFr !== undefined && { descriptionFr: descriptionFr.trim() }),
      ...(descriptionEn !== undefined && { descriptionEn: descriptionEn.trim() }),
      ...(telephone !== undefined && { telephone: telephone.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(adresse !== undefined && { adresse: adresse.trim() }),
      ...(siteWeb !== undefined && { siteWeb }),
      ...(logo !== undefined && { logo }),
      ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
    }
  });
  res.json(updated);
}));

/* ──────────────────────────────────────────────────────────
   PATCH /:id/verifier  — vérifier/rejeter un prestataire (admin)
────────────────────────────────────────────────────────── */
router.patch('/:id/verifier', requireAuth, requireAdmin, ah(async (req, res) => {
  const { estVerifie } = req.body;
  if (typeof estVerifie !== 'boolean') {
    return res.status(400).json({ error: 'estVerifie doit être true ou false' });
  }

  const updated = await prisma.provider.update({
    where: { id: req.params.id },
    data: { estVerifie },
    include: { user: { select: { id: true, prenom: true, nom: true, email: true } } }
  });

  await prisma.notification.create({
    data: {
      userId: updated.userId,
      type: 'profil_prestataire',
      titre: estVerifie ? 'Profil prestataire validé ✅' : 'Profil prestataire refusé',
      message: estVerifie
        ? 'Félicitations ! Votre profil a été validé. Vous pouvez maintenant publier vos services.'
        : 'Votre profil prestataire a été refusé. Veuillez le compléter et soumettre à nouveau.',
      lien: '/profil/prestataire'
    }
  });

  res.json(updated);
}));

export default router;

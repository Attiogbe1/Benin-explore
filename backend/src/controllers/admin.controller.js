import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

/* ═══════════════════════════════════════════════════════════
   STATISTIQUES DASHBOARD
═══════════════════════════════════════════════════════════ */
export const getDashboardStats = ah(async (req, res) => {
  const [users, sites, reservations, pendingReviews, services, providers, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.touristSite.count({ where: { estActif: true } }),
    prisma.reservation.count(),
    prisma.review.count({ where: { estApprouve: false } }),
    prisma.service.count(),
    prisma.provider.count(),
    prisma.reservation.aggregate({
      where: { statut: { in: ['CONFIRMEE', 'TERMINEE'] } },
      _sum: { prixTotal: true }
    })
  ]);

  const recentReservations = await prisma.reservation.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      user:    { select: { nom: true, prenom: true, avatar: true } },
      service: { select: { nomFr: true, type: true } },
      provider: { select: { nomEntreprise: true } }
    }
  });

  // Réservations par mois (6 derniers mois)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const reservationsByMonth = await prisma.reservation.groupBy({
    by: ['createdAt'],
    where: { createdAt: { gte: sixMonthsAgo } },
    _count: { id: true },
    _sum: { prixTotal: true }
  });

  res.json({
    stats: {
      users,
      sites,
      reservations,
      pendingReviews,
      services,
      providers,
      revenue: revenue._sum.prixTotal || 0
    },
    recentReservations,
    reservationsByMonth
  });
});

/* ═══════════════════════════════════════════════════════════
   GESTION UTILISATEURS
═══════════════════════════════════════════════════════════ */
export const getAllUsers = ah(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const where = {};
  if (role)   where.role = role;
  if (search) {
    where.OR = [
      { email:  { contains: search, mode: 'insensitive' } },
      { nom:    { contains: search, mode: 'insensitive' } },
      { prenom: { contains: search, mode: 'insensitive' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, nom: true, prenom: true, role: true,
        isActive: true, createdAt: true, avatar: true,
        _count: { select: { reservations: true, reviews: true } }
      },
      skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

export const toggleUserStatus = ah(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  if (user.role === 'ADMIN') return res.status(403).json({ error: 'Impossible de désactiver un admin' });

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: !user.isActive },
    select: { id: true, isActive: true, email: true }
  });
  res.json(updated);
});

/* ═══════════════════════════════════════════════════════════
   GESTION PRESTATAIRES
═══════════════════════════════════════════════════════════ */
export const getAllProviders = ah(async (req, res) => {
  const { page = 1, limit = 20, search, estVerifie } = req.query;
  const where = {};
  if (estVerifie !== undefined) where.estVerifie = estVerifie === 'true';
  if (search) {
    where.OR = [
      { nomEntreprise: { contains: search, mode: 'insensitive' } },
      { email:         { contains: search, mode: 'insensitive' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.provider.findMany({
      where, skip, take: parseInt(limit),
      include: {
        user: { select: { email: true, nom: true, prenom: true } },
        _count: { select: { services: true, reservations: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.provider.count({ where })
  ]);

  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

export const verifyProvider = ah(async (req, res) => {
  const { estVerifie } = req.body;
  if (typeof estVerifie !== 'boolean') {
    return res.status(400).json({ error: 'estVerifie doit être true ou false' });
  }

  const provider = await prisma.provider.findUnique({ where: { id: req.params.id } });
  if (!provider) return res.status(404).json({ error: 'Prestataire introuvable' });

  const updated = await prisma.provider.update({
    where: { id: req.params.id },
    data: { estVerifie }
  });

  await prisma.notification.create({
    data: {
      userId: provider.userId,
      type: 'profil_prestataire',
      titre: estVerifie ? '✅ Profil prestataire validé' : 'Profil prestataire refusé',
      message: estVerifie
        ? 'Félicitations ! Votre profil a été validé. Publiez vos services dès maintenant.'
        : 'Votre profil a été refusé. Mettez-le à jour et soumettez à nouveau.',
      lien: '/profil/prestataire'
    }
  });

  res.json(updated);
});

export const deleteProvider = ah(async (req, res) => {
  const provider = await prisma.provider.findUnique({ where: { id: req.params.id } });
  if (!provider) return res.status(404).json({ error: 'Prestataire introuvable' });

  // Désactiver le rôle de l'utilisateur
  await prisma.user.update({
    where: { id: provider.userId },
    data: { role: 'TOURISTE' }
  });
  await prisma.provider.delete({ where: { id: req.params.id } });
  res.json({ message: 'Prestataire supprimé' });
});

/* ═══════════════════════════════════════════════════════════
   GESTION SERVICES
═══════════════════════════════════════════════════════════ */
export const getAllServices = ah(async (req, res) => {
  const { page = 1, limit = 20, type, disponible } = req.query;
  const where = {};
  if (type)       where.type = type;
  if (disponible !== undefined) where.disponible = disponible === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.service.findMany({
      where, skip, take: parseInt(limit),
      include: {
        provider: { select: { nomEntreprise: true } },
        _count: { select: { reservations: true, reviews: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.service.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

export const adminDeleteService = ah(async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service introuvable' });

  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ message: 'Service supprimé' });
});

/* ═══════════════════════════════════════════════════════════
   GESTION SITES TOURISTIQUES
═══════════════════════════════════════════════════════════ */
export const adminCreateSite = ah(async (req, res) => {
  const {
    slug, nomFr, nomEn, nomEs, nomDe,
    descriptionFr, descriptionEn, descriptionEs, descriptionDe,
    histoireFr, histoireEn, adresse, latitude, longitude,
    horaires, tarifs, accessibilite, gratuit, enfants, avecGuide,
    imagesCouverture, images, videoUrl, audioGuideFr, audioGuideEn,
    regionId, categoryId, estVedette
  } = req.body;

  if (!slug || !nomFr || !descriptionFr || !adresse || !latitude || !longitude || !regionId || !categoryId) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  const site = await prisma.touristSite.create({
    data: {
      slug: slug.toLowerCase().trim(),
      nomFr: nomFr.trim(), nomEn: (nomEn || nomFr).trim(),
      nomEs: (nomEs || nomFr).trim(), nomDe: (nomDe || nomFr).trim(),
      descriptionFr: descriptionFr.trim(),
      descriptionEn: (descriptionEn || '').trim(),
      descriptionEs: (descriptionEs || '').trim(),
      descriptionDe: (descriptionDe || '').trim(),
      histoireFr: histoireFr || null, histoireEn: histoireEn || null,
      adresse: adresse.trim(),
      latitude: parseFloat(latitude), longitude: parseFloat(longitude),
      horaires: horaires || null, tarifs: tarifs || null,
      accessibilite: accessibilite ?? true,
      gratuit: gratuit ?? false,
      enfants: enfants ?? true,
      avecGuide: avecGuide ?? false,
      imagesCouverture: Array.isArray(imagesCouverture) ? imagesCouverture : [],
      images: Array.isArray(images) ? images : [],
      videoUrl: videoUrl || null,
      audioGuideFr: audioGuideFr || null,
      audioGuideEn: audioGuideEn || null,
      regionId, categoryId,
      estVedette: estVedette ?? false,
      estActif: true
    }
  });
  res.status(201).json(site);
});

export const adminUpdateSite = ah(async (req, res) => {
  const site = await prisma.touristSite.findUnique({ where: { id: req.params.id } });
  if (!site) return res.status(404).json({ error: 'Site introuvable' });

  const updated = await prisma.touristSite.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

export const adminDeleteSite = ah(async (req, res) => {
  const site = await prisma.touristSite.findUnique({ where: { id: req.params.id } });
  if (!site) return res.status(404).json({ error: 'Site introuvable' });

  await prisma.touristSite.update({
    where: { id: req.params.id },
    data: { estActif: false }
  });
  res.json({ message: 'Site désactivé' });
});

/* ═══════════════════════════════════════════════════════════
   GESTION AVIS
═══════════════════════════════════════════════════════════ */
export const getPendingReviews = ah(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { estApprouve: false },
    include: {
      user: { select: { nom: true, prenom: true, avatar: true } },
      site: { select: { nomFr: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reviews);
});

export const getAllReservations = ah(async (req, res) => {
  const { page = 1, limit = 20, statut } = req.query;
  const where = {};
  if (statut) where.statut = statut;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.reservation.findMany({
      where, skip, take: parseInt(limit),
      include: {
        user:     { select: { nom: true, prenom: true, email: true } },
        service:  { select: { nomFr: true, type: true } },
        provider: { select: { nomEntreprise: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.reservation.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

/* ═══════════════════════════════════════════════════════════
   GESTION BLOG
═══════════════════════════════════════════════════════════ */
export const adminGetAllPosts = ah(async (req, res) => {
  const { page = 1, limit = 20, estPublie } = req.query;
  const where = {};
  if (estPublie !== undefined) where.estPublie = estPublie === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

export const adminCreatePost = ah(async (req, res) => {
  const { titreFr, titreEn, contenuFr, contenuEn, imageCover, auteur, categorie, estPublie } = req.body;
  if (!titreFr || !contenuFr || !auteur || !categorie) {
    return res.status(400).json({ error: 'Champs obligatoires : titreFr, contenuFr, auteur, categorie' });
  }

  // Génération du slug depuis le titre
  const slug = titreFr.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Unicité du slug
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const post = await prisma.blogPost.create({
    data: {
      slug: finalSlug,
      titreFr: titreFr.trim(),
      titreEn: (titreEn || titreFr).trim(),
      contenuFr: contenuFr.trim(),
      contenuEn: (contenuEn || '').trim(),
      imageCover: imageCover || null,
      auteur: auteur.trim(),
      categorie: categorie.trim(),
      estPublie: estPublie ?? false
    }
  });
  res.status(201).json(post);
});

export const adminUpdatePost = ah(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Article introuvable' });

  const updated = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

export const adminDeletePost = ah(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Article introuvable' });

  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ message: 'Article supprimé' });
});

/* ═══════════════════════════════════════════════════════════
   GESTION ALERTES SÉCURITÉ
═══════════════════════════════════════════════════════════ */
export const getSecurityAlerts = ah(async (req, res) => {
  const alerts = await prisma.securityAlert.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(alerts);
});

export const createSecurityAlert = ah(async (req, res) => {
  const { messageFr, messageEn, severite, regionSlug, expireAt } = req.body;
  if (!messageFr || !severite) {
    return res.status(400).json({ error: 'Champs obligatoires : messageFr, severite' });
  }
  const SEVERITES = ['info', 'warning', 'danger'];
  if (!SEVERITES.includes(severite)) {
    return res.status(400).json({ error: `severite invalide. Valeurs : ${SEVERITES.join(', ')}` });
  }

  const alert = await prisma.securityAlert.create({
    data: {
      messageFr: messageFr.trim(),
      messageEn: (messageEn || messageFr).trim(),
      severite,
      regionSlug: regionSlug || null,
      estActive: true,
      expireAt: expireAt ? new Date(expireAt) : null
    }
  });
  res.status(201).json(alert);
});

export const updateSecurityAlert = ah(async (req, res) => {
  const alert = await prisma.securityAlert.findUnique({ where: { id: req.params.id } });
  if (!alert) return res.status(404).json({ error: 'Alerte introuvable' });

  const updated = await prisma.securityAlert.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

export const deleteSecurityAlert = ah(async (req, res) => {
  const alert = await prisma.securityAlert.findUnique({ where: { id: req.params.id } });
  if (!alert) return res.status(404).json({ error: 'Alerte introuvable' });

  await prisma.securityAlert.delete({ where: { id: req.params.id } });
  res.json({ message: 'Alerte supprimée' });
});

/* ═══════════════════════════════════════════════════════════
   GESTION BADGES (GAMIFICATION)
═══════════════════════════════════════════════════════════ */
export const getAllBadges = ah(async (req, res) => {
  const badges = await prisma.badge.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { nomFr: 'asc' }
  });
  res.json(badges);
});

export const createBadge = ah(async (req, res) => {
  const { nomFr, nomEn, descriptionFr, icone, condition } = req.body;
  if (!nomFr || !descriptionFr || !icone || !condition) {
    return res.status(400).json({ error: 'Champs obligatoires : nomFr, descriptionFr, icone, condition' });
  }
  const badge = await prisma.badge.create({
    data: { nomFr, nomEn: nomEn || nomFr, descriptionFr, icone, condition }
  });
  res.status(201).json(badge);
});

export const awardBadge = ah(async (req, res) => {
  const { userId } = req.params;
  const { badgeId } = req.body;

  const [user, badge] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.badge.findUnique({ where: { id: badgeId } })
  ]);
  if (!user)  return res.status(404).json({ error: 'Utilisateur introuvable' });
  if (!badge) return res.status(404).json({ error: 'Badge introuvable' });

  const userBadge = await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId } },
    create: { userId, badgeId },
    update: {}
  });

  await prisma.notification.create({
    data: {
      userId,
      type: 'badge',
      titre: `🏆 Badge obtenu : ${badge.nomFr}`,
      message: badge.descriptionFr,
      lien: '/profil'
    }
  });

  res.status(201).json(userBadge);
});

/* ═══════════════════════════════════════════════════════════
   ANCIEN — garder la compatibilité
═══════════════════════════════════════════════════════════ */
export const getAllUsersLegacy = getAllUsers;
export const toggleUserStatusLegacy = toggleUserStatus;
export const getPendingReviewsLegacy = getPendingReviews;

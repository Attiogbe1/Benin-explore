import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

/* ──────────────────────────────────────────────────────────
   GET /badges  — liste de tous les badges disponibles
────────────────────────────────────────────────────────── */
router.get('/badges', ah(async (req, res) => {
  const badges = await prisma.badge.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { nomFr: 'asc' }
  });
  res.json(badges);
}));

/* ──────────────────────────────────────────────────────────
   GET /mes-badges  — badges de l'utilisateur connecté
────────────────────────────────────────────────────────── */
router.get('/mes-badges', requireAuth, ah(async (req, res) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: req.user.id },
    include: { badge: true },
    orderBy: { obtenuLe: 'desc' }
  });
  res.json(userBadges);
}));

/* ──────────────────────────────────────────────────────────
   GET /classement  — top 10 utilisateurs par points
   (points = 10×avis + 5×favoris + 20×réservations terminées)
────────────────────────────────────────────────────────── */
router.get('/classement', ah(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true, prenom: true, nom: true, avatar: true,
      _count: { select: { reviews: true, favorites: true, reservations: true } }
    },
    take: 50
  });

  const ranked = users
    .map(u => ({
      id: u.id,
      prenom: u.prenom,
      nom: u.nom,
      avatar: u.avatar,
      points: u._count.reviews * 10 + u._count.favorites * 5 + u._count.reservations * 20
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  res.json(ranked);
}));

/* ──────────────────────────────────────────────────────────
   GET /mes-points  — points et progression de l'utilisateur
────────────────────────────────────────────────────────── */
router.get('/mes-points', requireAuth, ah(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      _count: { select: { reviews: true, favorites: true, reservations: true } },
      badges: { include: { badge: true } }
    }
  });

  const points = user._count.reviews * 10 + user._count.favorites * 5 + user._count.reservations * 20;

  // Niveaux
  const niveaux = [
    { nom: 'Découvreur',  minPts: 0    },
    { nom: 'Voyageur',    minPts: 50   },
    { nom: 'Bronze',      minPts: 150  },
    { nom: 'Argent',      minPts: 400  },
    { nom: 'Or',          minPts: 1000 },
    { nom: 'Ambassadeur', minPts: 3000 },
  ];

  const niveauActuel = niveaux.filter(n => n.minPts <= points).pop();
  const niveauSuivant = niveaux.find(n => n.minPts > points);

  const progression = niveauSuivant
    ? Math.round(((points - niveauActuel.minPts) / (niveauSuivant.minPts - niveauActuel.minPts)) * 100)
    : 100;

  res.json({
    points,
    niveau: niveauActuel.nom,
    niveauSuivant: niveauSuivant?.nom || null,
    ptsManquants: niveauSuivant ? niveauSuivant.minPts - points : 0,
    progression,
    stats: {
      avis: user._count.reviews,
      favoris: user._count.favorites,
      reservations: user._count.reservations
    },
    badges: user.badges.map(ub => ({ ...ub.badge, obtenuLe: ub.obtenuLe }))
  });
}));

export default router;

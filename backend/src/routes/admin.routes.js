import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';
import {
  getDashboardStats,
  getAllUsers, toggleUserStatus,
  getAllProviders, verifyProvider, deleteProvider,
  getAllServices, adminDeleteService,
  adminCreateSite, adminUpdateSite, adminDeleteSite,
  getPendingReviews, getAllReservations,
  adminGetAllPosts, adminCreatePost, adminUpdatePost, adminDeletePost,
  getSecurityAlerts, createSecurityAlert, updateSecurityAlert, deleteSecurityAlert,
  getAllBadges, createBadge, awardBadge
} from '../controllers/admin.controller.js';
import { approveReview, deleteReview } from '../controllers/reviews.controller.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();
router.use(requireAuth, requireAdmin);

/* ── Dashboard ─────────────────────────────────────────── */
router.get('/stats', getDashboardStats);

/* ── Utilisateurs ──────────────────────────────────────── */
router.get('/utilisateurs', getAllUsers);
router.patch('/utilisateurs/:id/statut', toggleUserStatus);

/* ── Prestataires ──────────────────────────────────────── */
router.get('/prestataires', getAllProviders);
router.patch('/prestataires/:id/verifier', verifyProvider);
router.delete('/prestataires/:id', deleteProvider);

/* ── Services ──────────────────────────────────────────── */
router.get('/services', getAllServices);
router.delete('/services/:id', adminDeleteService);

/* ── Sites touristiques ─────────────────────────────────── */
router.post('/sites',         adminCreateSite);
router.put('/sites/:id',      adminUpdateSite);
router.delete('/sites/:id',   adminDeleteSite);

/* ── Réservations ──────────────────────────────────────── */
router.get('/reservations', getAllReservations);

/* ── Avis ──────────────────────────────────────────────── */
router.get('/avis-en-attente',      getPendingReviews);
router.patch('/avis/:id/approuver', approveReview);
router.delete('/avis/:id',          deleteReview);

/* ── Blog ──────────────────────────────────────────────── */
router.get('/blog',          adminGetAllPosts);
router.post('/blog',         adminCreatePost);
router.put('/blog/:id',      adminUpdatePost);
router.delete('/blog/:id',   adminDeletePost);

/* ── Alertes sécurité ──────────────────────────────────── */
router.get('/alertes',           getSecurityAlerts);
router.post('/alertes',          createSecurityAlert);
router.patch('/alertes/:id',     updateSecurityAlert);
router.delete('/alertes/:id',    deleteSecurityAlert);

/* ── Gamification / Badges ─────────────────────────────── */
router.get('/badges',                   getAllBadges);
router.post('/badges',                  createBadge);
router.post('/badges/:userId/attribuer', awardBadge);

/* ── Catégories ─────────────────────────────────────────── */
router.post('/categories', ah(async (req, res) => {
  const { nomFr, nomEn, nomEs, nomDe, slug, icone, couleur, type } = req.body;
  if (!nomFr || !slug || !type) {
    return res.status(400).json({ error: 'Champs obligatoires : nomFr, slug, type' });
  }
  const cat = await prisma.category.create({
    data: { nomFr, nomEn: nomEn || nomFr, nomEs: nomEs || nomFr, nomDe: nomDe || nomFr, slug, icone: icone || 'landmark', couleur: couleur || '#E8982A', type }
  });
  res.status(201).json(cat);
}));

router.put('/categories/:id', ah(async (req, res) => {
  const cat = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
  res.json(cat);
}));

/* ── Régions ─────────────────────────────────────────────── */
router.post('/regions', ah(async (req, res) => {
  const { nomFr, nomEn, slug, description, latitude, longitude } = req.body;
  if (!nomFr || !slug || !latitude || !longitude) {
    return res.status(400).json({ error: 'Champs obligatoires : nomFr, slug, latitude, longitude' });
  }
  const region = await prisma.region.create({
    data: { nomFr, nomEn: nomEn || nomFr, slug, description: description || null, latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
  });
  res.status(201).json(region);
}));

router.put('/regions/:id', ah(async (req, res) => {
  const region = await prisma.region.update({ where: { id: req.params.id }, data: req.body });
  res.json(region);
}));

export default router;

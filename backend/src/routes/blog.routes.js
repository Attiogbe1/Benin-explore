import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

/* ──────────────────────────────────────────────────────────
   GET /  — articles publiés (public, paginé, filtrable)
────────────────────────────────────────────────────────── */
router.get('/', ah(async (req, res) => {
  const { page = 1, limit = 10, categorie, search } = req.query;
  const where = { estPublie: true };
  if (categorie) where.categorie = categorie;
  if (search) {
    where.OR = [
      { titreFr: { contains: search, mode: 'insensitive' } },
      { contenuFr: { contains: search, mode: 'insensitive' } },
      { auteur:    { contains: search, mode: 'insensitive' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, slug: true, titreFr: true, titreEn: true,
        imageCover: true, auteur: true, categorie: true, createdAt: true
      }
    }),
    prisma.blogPost.count({ where })
  ]);
  res.json({ data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
}));

/* ──────────────────────────────────────────────────────────
   GET /categories  — catégories existantes (pour filtres)
────────────────────────────────────────────────────────── */
router.get('/categories', ah(async (req, res) => {
  const cats = await prisma.blogPost.findMany({
    where: { estPublie: true },
    distinct: ['categorie'],
    select: { categorie: true }
  });
  res.json(cats.map(c => c.categorie));
}));

/* ──────────────────────────────────────────────────────────
   GET /:slug  — article complet (public)
────────────────────────────────────────────────────────── */
router.get('/:slug', ah(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!post || !post.estPublie) return res.status(404).json({ error: 'Article introuvable' });
  res.json(post);
}));

/* ──────────────────────────────────────────────────────────
   POST /  — créer un article (admin)
────────────────────────────────────────────────────────── */
router.post('/', requireAuth, requireAdmin, ah(async (req, res) => {
  const { titreFr, titreEn, contenuFr, contenuEn, imageCover, auteur, categorie, estPublie } = req.body;

  if (!titreFr || !contenuFr || !auteur || !categorie) {
    return res.status(400).json({ error: 'Champs obligatoires : titreFr, contenuFr, auteur, categorie' });
  }

  // Génération slug depuis le titre français
  const baseSlug = titreFr.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const existing = await prisma.blogPost.findUnique({ where: { slug: baseSlug } });
  const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

  const post = await prisma.blogPost.create({
    data: {
      slug,
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
}));

/* ──────────────────────────────────────────────────────────
   PUT /:id  — modifier un article (admin)
────────────────────────────────────────────────────────── */
router.put('/:id', requireAuth, requireAdmin, ah(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Article introuvable' });

  const updated = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
}));

/* ──────────────────────────────────────────────────────────
   PATCH /:id/publier  — publier / dépublier (admin)
────────────────────────────────────────────────────────── */
router.patch('/:id/publier', requireAuth, requireAdmin, ah(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Article introuvable' });

  const updated = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: { estPublie: !post.estPublie }
  });
  res.json({ estPublie: updated.estPublie });
}));

/* ──────────────────────────────────────────────────────────
   DELETE /:id  — supprimer un article (admin)
────────────────────────────────────────────────────────── */
router.delete('/:id', requireAuth, requireAdmin, ah(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Article introuvable' });

  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ message: 'Article supprimé' });
}));

export default router;

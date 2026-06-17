import { Router } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { nomFr: 'asc' } });
  res.json(categories);
});

router.get('/:slug', async (req, res) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });
  if (!category) return res.status(404).json({ error: 'Catégorie introuvable' });
  res.json(category);
});

export default router;

import { Router } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

router.get('/', async (req, res) => {
  const regions = await prisma.region.findMany({ orderBy: { nomFr: 'asc' } });
  res.json(regions);
});

router.get('/:slug', async (req, res) => {
  const region = await prisma.region.findUnique({
    where: { slug: req.params.slug },
    include: { sites: { where: { estActif: true }, take: 6 } }
  });
  if (!region) return res.status(404).json({ error: 'Région introuvable' });
  res.json(region);
});

export default router;

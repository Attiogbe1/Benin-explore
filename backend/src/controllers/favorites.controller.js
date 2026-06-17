import { prisma } from '../config/database.js';

export async function getUserFavorites(req, res) {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user.id },
    include: {
      site: {
        select: {
          id: true, slug: true, nomFr: true, nomEn: true,
          imagesCouverture: true, noteMoyenne: true, nombreAvis: true,
          region: { select: { nomFr: true } },
          category: { select: { nomFr: true, icone: true, couleur: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(favorites);
}

export async function toggleFavorite(req, res) {
  const { siteId } = req.body;
  const userId = req.user.id;

  const existing = await prisma.favorite.findUnique({
    where: { userId_siteId: { userId, siteId } }
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return res.json({ isFavorite: false });
  }

  await prisma.favorite.create({ data: { userId, siteId } });
  res.json({ isFavorite: true });
}

export async function checkFavorite(req, res) {
  const { siteId } = req.params;
  const userId = req.user.id;

  const favorite = await prisma.favorite.findUnique({
    where: { userId_siteId: { userId, siteId } }
  });

  res.json({ isFavorite: !!favorite });
}

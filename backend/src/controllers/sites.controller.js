import { prisma } from '../config/database.js';

export async function getSites(req, res) {
  const {
    page = 1, limit = 12,
    categorie, region, search,
    gratuit, populaire, vedette,
    sort = 'popularite'
  } = req.query;

  const where = { estActif: true };
  if (categorie) where.category = { slug: categorie };
  if (region) where.region = { slug: region };
  if (gratuit === 'true') where.gratuit = true;
  if (vedette === 'true') where.estVedette = true;
  if (search) {
    where.OR = [
      { nomFr: { contains: search, mode: 'insensitive' } },
      { nomEn: { contains: search, mode: 'insensitive' } },
      { descriptionFr: { contains: search, mode: 'insensitive' } },
      { adresse: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {
    popularite: { popularite: 'desc' },
    note: { noteMoyenne: 'desc' },
    recent: { createdAt: 'desc' },
    nom: { nomFr: 'asc' }
  }[sort] || { popularite: 'desc' };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    prisma.touristSite.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        region: { select: { nomFr: true, nomEn: true, slug: true } },
        category: { select: { nomFr: true, nomEn: true, slug: true, icone: true, couleur: true } }
      }
    }),
    prisma.touristSite.count({ where })
  ]);

  res.json({
    data,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit))
  });
}

export async function getSiteBySlug(req, res) {
  const { slug } = req.params;

  const site = await prisma.touristSite.findUnique({
    where: { slug },
    include: {
      region: true,
      category: true,
      reviews: {
        where: { estApprouve: true },
        include: {
          user: { select: { nom: true, prenom: true, avatar: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!site || !site.estActif) {
    return res.status(404).json({ error: 'Site introuvable' });
  }

  await prisma.touristSite.update({
    where: { slug },
    data: { nombreVues: { increment: 1 } }
  });

  res.json(site);
}

export async function createSite(req, res) {
  const data = req.body;
  const site = await prisma.touristSite.create({ data });
  res.status(201).json(site);
}

export async function updateSite(req, res) {
  const { id } = req.params;
  const site = await prisma.touristSite.update({
    where: { id },
    data: req.body
  });
  res.json(site);
}

export async function deleteSite(req, res) {
  const { id } = req.params;
  await prisma.touristSite.update({
    where: { id },
    data: { estActif: false }
  });
  res.json({ success: true });
}

export async function getSitesForMap(req, res) {
  const sites = await prisma.touristSite.findMany({
    where: { estActif: true },
    select: {
      id: true, slug: true, nomFr: true, nomEn: true,
      latitude: true, longitude: true,
      imagesCouverture: true, noteMoyenne: true,
      category: { select: { nomFr: true, icone: true, couleur: true } }
    }
  });
  res.json(sites);
}

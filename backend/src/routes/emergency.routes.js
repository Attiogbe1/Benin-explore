import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';
import { prisma } from '../config/database.js';
import { ah } from '../utils/asyncHandler.js';

const router = Router();

/* ──────────────────────────────────────────────────────────
   GET /alertes  — alertes actives (public)
────────────────────────────────────────────────────────── */
router.get('/alertes', ah(async (req, res) => {
  const { region } = req.query;
  const where = {
    estActive: true,
    OR: [{ expireAt: null }, { expireAt: { gt: new Date() } }]
  };
  if (region) where.regionSlug = region;

  const alertes = await prisma.securityAlert.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  res.json(alertes);
}));

/* ──────────────────────────────────────────────────────────
   GET /contacts  — numéros & hôpitaux (public, statique)
────────────────────────────────────────────────────────── */
router.get('/contacts', (req, res) => {
  res.json({
    urgences: [
      { nom: 'Police Nationale',                  numero: '117',               type: 'police'      },
      { nom: 'SAMU / Urgences médicales',         numero: '15',                type: 'medical'     },
      { nom: 'Pompiers',                          numero: '118',               type: 'pompiers'    },
      { nom: 'Gendarmerie Nationale',             numero: '197',               type: 'gendarmerie' },
      { nom: 'Ambassade de France (Cotonou)',     numero: '+229 21 30 02 25',  type: 'ambassade'   },
      { nom: 'Urgences européennes',              numero: '+229 21 31 45 67',  type: 'international' }
    ],
    hopitaux: [
      { nom: 'CNHU-HKM Cotonou',              telephone: '+229 21 30 01 55', ville: 'Cotonou'       },
      { nom: 'Hôpital Saint Luc',             telephone: '+229 21 31 45 67', ville: 'Cotonou'       },
      { nom: 'CHD Borgou — Parakou',          telephone: '+229 23 61 06 50', ville: 'Parakou'       },
      { nom: 'HZ Abomey-Calavi',              telephone: '+229 21 36 00 55', ville: 'Abomey-Calavi' }
    ]
  });
});

/* ──────────────────────────────────────────────────────────
   ADMIN — Gestion des alertes de sécurité
────────────────────────────────────────────────────────── */

// GET /admin/alertes  — toutes les alertes (y compris expirées)
router.get('/admin/alertes', requireAuth, requireAdmin, ah(async (req, res) => {
  const alertes = await prisma.securityAlert.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(alertes);
}));

// POST /admin/alertes  — créer une alerte
router.post('/admin/alertes', requireAuth, requireAdmin, ah(async (req, res) => {
  const { messageFr, messageEn, severite, regionSlug, expireAt } = req.body;
  if (!messageFr || !severite) {
    return res.status(400).json({ error: 'Champs obligatoires : messageFr, severite' });
  }
  const SEVERITES = ['info', 'warning', 'danger'];
  if (!SEVERITES.includes(severite)) {
    return res.status(400).json({ error: `severite invalide. Valeurs : ${SEVERITES.join(', ')}` });
  }

  const alerte = await prisma.securityAlert.create({
    data: {
      messageFr: messageFr.trim(),
      messageEn: (messageEn || messageFr).trim(),
      severite,
      regionSlug: regionSlug || null,
      estActive:  true,
      expireAt:   expireAt ? new Date(expireAt) : null
    }
  });
  res.status(201).json(alerte);
}));

// PATCH /admin/alertes/:id  — modifier une alerte
router.patch('/admin/alertes/:id', requireAuth, requireAdmin, ah(async (req, res) => {
  const alerte = await prisma.securityAlert.findUnique({ where: { id: req.params.id } });
  if (!alerte) return res.status(404).json({ error: 'Alerte introuvable' });

  const updated = await prisma.securityAlert.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
}));

// DELETE /admin/alertes/:id  — supprimer une alerte
router.delete('/admin/alertes/:id', requireAuth, requireAdmin, ah(async (req, res) => {
  const alerte = await prisma.securityAlert.findUnique({ where: { id: req.params.id } });
  if (!alerte) return res.status(404).json({ error: 'Alerte introuvable' });

  await prisma.securityAlert.delete({ where: { id: req.params.id } });
  res.json({ message: 'Alerte supprimée' });
}));

/* ──────────────────────────────────────────────────────────
   Contacts d'urgence personnels (utilisateur connecté)
────────────────────────────────────────────────────────── */

// GET /mes-contacts — contacts d'urgence de l'utilisateur
router.get('/mes-contacts', requireAuth, ah(async (req, res) => {
  const contacts = await prisma.emergencyContact.findMany({
    where: { userId: req.user.id }
  });
  res.json(contacts);
}));

// POST /mes-contacts — ajouter un contact d'urgence
router.post('/mes-contacts', requireAuth, ah(async (req, res) => {
  const { nom, telephone, email } = req.body;
  if (!nom || !telephone) {
    return res.status(400).json({ error: 'Champs obligatoires : nom, telephone' });
  }
  const contact = await prisma.emergencyContact.create({
    data: { userId: req.user.id, nom: nom.trim(), telephone: telephone.trim(), email: email || null }
  });
  res.status(201).json(contact);
}));

// DELETE /mes-contacts/:id — supprimer un contact
router.delete('/mes-contacts/:id', requireAuth, ah(async (req, res) => {
  const contact = await prisma.emergencyContact.findUnique({ where: { id: req.params.id } });
  if (!contact || contact.userId !== req.user.id) {
    return res.status(404).json({ error: 'Contact introuvable' });
  }
  await prisma.emergencyContact.delete({ where: { id: req.params.id } });
  res.json({ message: 'Contact supprimé' });
}));

export default router;

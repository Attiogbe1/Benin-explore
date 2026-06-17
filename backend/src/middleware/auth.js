import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: 'Authentification requise' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, nom: true, prenom: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Compte inactif ou introuvable' });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, nom: true, prenom: true }
      });
    }
  } catch {}
  next();
}

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { sendWelcomeEmail } from '../services/email.service.js';

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

export async function register(req, res) {
  const { email, password, nom, prenom, langue = 'fr' } = req.body;

  if (!email || !password || !nom || !prenom) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Mot de passe trop court (min 8 caractères)' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, nom, prenom, langue },
    select: { id: true, email: true, nom: true, prenom: true, role: true, langue: true }
  });

  sendWelcomeEmail(user).catch(() => {});

  const token = generateToken(user.id);
  res.status(201).json({ token, user });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  if (!user.isActive) {
    return res.status(403).json({ error: 'Compte désactivé' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

  const token = generateToken(user.id);
  const { passwordHash, ...userSafe } = user;
  res.json({ token, user: userSafe });
}

export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, email: true, nom: true, prenom: true,
      avatar: true, role: true, langue: true, bio: true, pays: true,
      telephone: true, createdAt: true
    }
  });
  res.json(user);
}

export async function updateProfile(req, res) {
  const { nom, prenom, bio, pays, telephone, langue, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { nom, prenom, bio, pays, telephone, langue, avatar },
    select: {
      id: true, email: true, nom: true, prenom: true,
      avatar: true, role: true, langue: true, bio: true, pays: true, telephone: true
    }
  });

  res.json(user);
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (newPassword?.length < 8) {
    return res.status(400).json({ error: 'Nouveau mot de passe trop court' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });

  res.json({ success: true });
}

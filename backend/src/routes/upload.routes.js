import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/image', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé' });

  const outputName = `opt_${req.file.filename.replace(/\.[^/.]+$/, '')}.webp`;
  const outputPath = path.join(path.dirname(req.file.path), outputName);

  await sharp(req.file.path)
    .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);

  fs.unlink(req.file.path, () => {});

  res.json({ url: `/uploads/${outputName}` });
});

router.post('/images', requireAuth, upload.array('images', 10), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'Aucun fichier envoyé' });

  const urls = await Promise.all(req.files.map(async (file) => {
    const outputName = `opt_${file.filename.replace(/\.[^/.]+$/, '')}.webp`;
    const outputPath = path.join(path.dirname(file.path), outputName);
    await sharp(file.path).resize(1200, 900, { fit: 'inside' }).webp({ quality: 82 }).toFile(outputPath);
    fs.unlink(file.path, () => {});
    return `/uploads/${outputName}`;
  }));

  res.json({ urls });
});

export default router;

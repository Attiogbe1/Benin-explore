import 'dotenv/config';
import { execSync } from 'child_process';

process.on('uncaughtException',  (err) => console.error('[uncaughtException]',  err));
process.on('unhandledRejection', (err) => console.error('[unhandledRejection]', err));

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { rateLimit } from 'express-rate-limit';
import { initSocket } from './config/socket.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import sitesRoutes from './routes/sites.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import regionsRoutes from './routes/regions.routes.js';
import providersRoutes from './routes/providers.routes.js';
import servicesRoutes from './routes/services.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import chatRoutes from './routes/chat.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import emergencyRoutes from './routes/emergency.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import adminRoutes from './routes/admin.routes.js';
import blogRoutes from './routes/blog.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import serviceReviewsRoutes from './routes/service_reviews.routes.js';
import gamificationRoutes from './routes/gamification.routes.js';

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/regions', regionsRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/service-reviews', serviceReviewsRoutes);
app.use('/api/gamification', gamificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} occupé — libération automatique...`);
    try {
      if (process.platform === 'win32') {
        const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
        const match = out.match(/LISTENING\s+(\d+)/);
        if (match?.[1]) execSync(`taskkill /PID ${match[1]} /F`, { stdio: 'ignore' });
      } else {
        execSync(`fuser -k ${PORT}/tcp`, { stdio: 'ignore' });
      }
    } catch { /* process already gone */ }
    setTimeout(() => httpServer.listen(PORT), 600);
  } else {
    console.error('Erreur serveur :', err);
    process.exit(1);
  }
});

httpServer.listen(PORT, () => {
  console.log(`🚀 BeninExplore API démarrée sur le port ${PORT}`);
  console.log(`📖 Env: ${process.env.NODE_ENV}`);
});

// Fermeture propre pour nodemon (évite EADDRINUSE au redémarrage)
function shutdown() {
  httpServer.close(() => process.exit(0));
}
process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);

export default app;

# Déploiement BeninExplore

## Frontend
- Hébergement recommandé : Render, Railway, Fly.io, Vercel, ou tout hébergeur Node.js.
- Script de démarrage : `npm start`
- Build : `npm run build`
- Variable d'environnement à définir :
  - `VITE_API_BASE_URL=https://votre-backend.example.com`

## Backend
- Hébergement recommandé : Render, Railway, Fly.io, VPS, ou tout hébergeur Node.js.
- Script de démarrage : `npm start`
- Variables d'environnement à définir :
  - `DATABASE_URL=...`
  - `PORT=3001`
  - `FRONTEND_URL=https://votre-frontend.example.com`
  - `JWT_SECRET=...`
  - `ANTHROPIC_API_KEY=...`
  - `NODE_ENV=production`

## Notes
- Le frontend utilise maintenant `VITE_API_BASE_URL` pour appeler l’API de production.
- Le backend expose `/api/health` pour vérifier la disponibilité.

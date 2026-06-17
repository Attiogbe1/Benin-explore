# BeninExplore — Guide de démarrage

## Prérequis
- Node.js 20+
- PostgreSQL 16+
- Clé API Anthropic (https://console.anthropic.com)

---

## 1. Configuration Backend

```bash
cd backend
cp .env.example .env
```

Remplir `.env` :
```
DATABASE_URL="postgresql://user:pass@localhost:5432/benin_explore"
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=votre_secret_tres_long_minimum_32_chars
ANTHROPIC_API_KEY=sk-ant-votre_cle_ici
NODE_ENV=development
```

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers PostgreSQL
npm run db:push

# Injecter les données initiales (sites, catégories, admin)
npm run db:seed

# Démarrer le backend
npm run dev
```

Le backend tourne sur http://localhost:3001

**Compte admin créé par le seed :**
- Email : `admin@beninexplore.bj`
- Mot de passe : `Admin@BeninExplore2024`

---

## 2. Configuration Frontend

```bash
cd frontend
npm run dev
```

Le frontend tourne sur http://localhost:5173

---

## 3. Accès

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Site principal |
| http://localhost:5173/admin | Panel admin |
| http://localhost:5173/map | Carte interactive |
| http://localhost:3001/api/health | Health check API |
| http://localhost:3001 + npx prisma studio | Interface base de données |

---

## 4. Variables optionnelles

```
OPENWEATHER_API_KEY=clé_météo       # Pour la météo
SMTP_HOST=smtp.gmail.com             # Pour les emails
GOOGLE_CLIENT_ID=...                 # Pour Google OAuth
```

---

## 5. Déploiement Railway

1. Créer 2 services Railway : `backend` et `frontend`
2. Ajouter le service PostgreSQL Railway
3. Copier les variables d'env dans Railway Variables
4. `ORIGIN=https://votre-frontend.railway.app` (frontend)
5. `FRONTEND_URL=https://votre-frontend.railway.app` (backend)

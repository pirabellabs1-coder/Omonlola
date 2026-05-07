# Omonlola AI

Site Next.js + back-office sécurisé pour la gestion du contenu (réalisations, témoignages, FAQ, tarifs, leads, paramètres SEO).

## Développement local

```bash
npm install
npm run dev
```

Les identifiants admin sont générés dans `.env.local` (non committé). Pour en générer de nouveaux :

```bash
node scripts/generate-credentials.js
```

L'admin est ensuite accessible à `http://localhost:3000/manage/<ADMIN_PATH>`.

## Architecture du data layer

- **Local dev** : stockage JSON dans `.data/<name>.json`
- **Production (Vercel)** : Vercel KV (Upstash Redis) si `KV_REST_API_URL` est défini, sinon `/tmp` (éphémère)
- **Uploads d'images** :
  - Local dev : `public/uploads/`
  - Production : Vercel Blob si `BLOB_READ_WRITE_TOKEN` est défini

## Déploiement sur Vercel

### 1. Variables d'environnement obligatoires

Dans `Project Settings → Environment Variables`, ajoutez :

| Variable | Description |
|---|---|
| `ADMIN_PATH` | Slug secret de l'URL admin (ex : `0f6590a01a2003e8`) |
| `ADMIN_USER` | Email administrateur |
| `ADMIN_PASSWORD` | Mot de passe administrateur (≥ 24 caractères) |
| `SESSION_SECRET` | Secret HMAC pour les sessions (random hex 64 chars) |

### 2. Persistance des données (recommandé)

#### Vercel KV (base de données clé-valeur)

1. Allez dans `Storage → Create Database → KV`
2. Connectez la base au projet — les variables `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_URL` sont auto-injectées
3. Redéployez

#### Vercel Blob (stockage d'images)

1. Allez dans `Storage → Create Database → Blob`
2. Connectez le store au projet — la variable `BLOB_READ_WRITE_TOKEN` est auto-injectée
3. Redéployez

### 3. Déploiement initial via CLI

```bash
npx vercel link
npx vercel deploy --prod
```

### Notes de sécurité

- Le chemin `/admin` retourne 404 (rewriter middleware)
- L'admin est sur `/manage/<ADMIN_PATH>` — slug aléatoire à 64 bits
- Sessions HTTP-only avec `crypto.timingSafeEqual` pour le password compare
- Rate-limit : 5 tentatives échouées par IP / 5 min
- Les API admin sont protégées à 2 niveaux : middleware (cookie présent) + route handler (`requireAuth()`)

## Structure

```
app/
  api/                     # API routes (auth, CRUD, stats, track, upload)
  manage/[token]/          # Espace admin (slug secret)
  review/[token]/          # Page publique pour laisser un témoignage
  page.tsx                 # Home (Server Component dynamique)
components/
  sections/                # Sections de la home
  admin/                   # Pages et composants admin
  Tracker.tsx              # Tracking des views, scroll, events
  Toast.tsx, Navbar.tsx, Footer.tsx, etc.
lib/
  store.ts                 # Data store (KV + file fallback)
  auth.ts                  # Sessions + requireAuth helper
  types.ts                 # Types TypeScript partagés
  track.ts                 # Helper client pour tracking
  getPublic.ts             # Helpers serveur pour la home
  getSettings.ts           # Settings → metadata SEO
middleware.ts              # Filtre /admin, /manage, et /api/*
```

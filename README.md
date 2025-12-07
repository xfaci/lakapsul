# La Kapsul — la plateforme des artistes qui veulent shipper

Marketplace SaaS pour connecter artistes independants et prestataires (studios, inges son, beatmakers). Front Next.js deja shippe, backend Supabase-ready, branding premium et UX moderne. Objectif : permettre a un artiste de booker un pro fiable en moins de 3 clics, et a un prestataire de tout piloter depuis un dashboard.

## Ce que propose le produit
- Parcours public inspire SaaS : hero expressif, call-to-action, pricing, CGU, navigation themable.
- Recherche et fiches prestataires avec liste de services, categories et tarifs.
- Espace artiste : tableau de bord, reservations, stats, favoris.
- Espace prestataire : gestion des services (mocks + switch Supabase), calendrier, profil public partageable.
- Experience UI : design system shadcn/ui, framer-motion pour les transitions, theming light/dark, icones lucide.
- Socle data : Supabase (Postgres + Auth + Storage) connecte via `@supabase/ssr`; fallback mocks pour developper sans base.

## Architecture et stack
- Frontend : Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand pour l'etat, shadcn/ui.
- Animations : framer-motion; charts via Recharts; formulaires et selects via Radix.
- Auth/data : Supabase SSR. Prisma et Vercel Postgres disponibles si besoin de serveurs custom.
- Backend : dossier `backend/` avec squelette Node/Express (routes, services, sockets) non branche par defaut.
- Qualite : ESLint 9, TypeScript strict.

## Getting started
Prerequis : Node 20+, npm.
```bash
npm install
npm run dev
```
L'app tourne sur http://localhost:3000.

### Variables d'environnement
Creer un fichier `.env.local` a la racine :
```
NEXT_PUBLIC_SUPABASE_URL=<url_supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```
Pour activer Storage : ajouter un bucket `avatars` et `portfolio` dans Supabase.

### Scripts
- `npm run dev` : serveur Next en mode dev.
- `npm run build` : build production.
- `npm run start` : serveur production (apres build).
- `npm run lint` : verification lint.

## Structure
- `app/(public)/` : landing, pricing, recherche, fiches prestataires.
- `app/(auth)/` : login/signup.
- `app/(artist)/` : dashboard artiste.
- `app/provider/` : dashboard prestataire.
- `components/` : design system shadcn + UI feature.
- `lib/` : utils, mocks, clients Supabase (server/browser), server actions.
- `store/` : stores Zustand.
- `types/` : types partages (User, Service, Booking, Review, etc.).
- `backend/` : squelette API Node/Express.

## Data et branchement Supabase
- Table `services` attend : `id`, `provider_id` (uuid), `name`, `description`, `price` (centimes), `duration` (minutes), `category`, timestamps.
- `app/actions/get-services.ts` lit Supabase et retombe sur les mocks si absence de donnees.
- Guide detaillé : `backend_guide.md` + `backend-instructions.md` pour les migrations et endpoints.

## Roadmap produit (suggestions)
- Checkout securise et messaging en temps reel (artists x providers).
- Calendar sync (Google/Apple) et paiement milestone.
- Reviews verifiees et score de fiabilite.
- Mode decouverte : playlists de prestataires par genre/ville.

## Deploiement
- Frontend : Vercel recommande. Renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les env du projet.
- Donnees : injecter des services dans Supabase avant mise en ligne pour alimenter les pages providers.

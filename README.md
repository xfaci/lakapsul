# La Kapsul — plateforme SaaS musique

Frontend Next.js (App Router) et socle backend (skeleton) pour connecter artistes et prestataires : création de services, réservation, dashboards et profils publics.

## Fonctionnalités principales
- Parcours public : landing, recherche, fiches prestataires avec liste des services.
- Espaces privés artistes et prestataires : dashboards, réservations, gestion des services (mock + branchement Supabase pour les services).
- UI design system basé sur shadcn/ui, framer-motion pour les animations, Zustand pour l’état global.
- Intégration Supabase (PostgreSQL + Auth) prête pour remplacer les mocks.

## Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, framer-motion.
- Supabase (Postgres + Auth + Storage) via `@supabase/ssr`.
- ESLint 9, TypeScript 5.

## Démarrage rapide (frontend)
Prérequis : Node 20+, npm.

```bash
npm install
npm run dev
```
Application sur http://localhost:3000.

### Variables d’environnement
Créer `.env.local` à la racine :
```
NEXT_PUBLIC_SUPABASE_URL=<url_supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

## Commandes utiles
- `npm run dev` : serveur de dev Next.
- `npm run lint` : lint TypeScript/React.
- `npm run build` : build production.

## Structure du repo
- `app/` : routes Next (App Router)
  - `(public)/` landing, recherche, fiches prestataires.
  - `(auth)/` login/signup.
  - `(artist)/` dashboard artiste.
  - `(provider)/` dashboard prestataire.
- `components/` : UI shadcn + composants partagés/features.
- `lib/` : utils, mocks, clients Supabase (`supabase-server`, `supabase-browser`), actions serveur.
- `store/` : stores Zustand.
- `types/` : types partagés (User, Service, Booking, Review…).
- `backend/` : squelette d’API Node/Express (routes, services, sockets) non branché par défaut.

## Supabase (remplacement des mocks)
- Table `services` attend : `id`, `provider_id` (uuid), `name`, `description`, `price` (centimes), `duration` (minutes), `category`, timestamps.
- L’action serveur `app/actions/get-services.ts` lit Supabase et retombe sur les mocks si aucun enregistrement ou erreur.

## Déploiement
- Vercel recommandé pour le frontend : renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les env du projet.
- Vérifier `npm run build` avant déploiement. Supabase doit contenir des données de services pour alimenter les pages provider.

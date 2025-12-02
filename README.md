# Music SaaS Platform - Frontend

Bienvenue sur le dépôt frontend de la plateforme SaaS musicale. Ce projet est construit avec Next.js 14, TypeScript, Tailwind CSS et shadcn/ui.

## 📂 Structure du Projet

Voici l'architecture détaillée des dossiers et leur rôle :

### `app/`
Cœur de l'application (App Router).
- **`(public)/`** : Routes accessibles à tous (Landing page, Recherche, Profils publics).
- **`(artist)/`** : Espace privé pour les artistes (Dashboard, Messagerie, Paiements).
- **`(provider)/`** : Espace privé pour les prestataires (Gestion services, Calendrier, Stats).
- **`(auth)/`** : Pages d'authentification (Connexion, Inscription).
- **`layout.tsx`** : Layout racine (Fontes, Providers globaux).
- **`globals.css`** : Styles globaux et directives Tailwind.

### `components/`
Bibliothèque de composants React.
- **`ui/`** : Composants atomiques de shadcn/ui (Button, Input, Card...).
- **`shared/`** : Composants partagés (Header, Footer, Navigation).
- **`features/`** : Composants métier complexes (AudioPlayer, ChatInterface, BookingCalendar).

### `lib/`
Logique métier et utilitaires.
- **`api.ts`** : Client HTTP configuré (Axios/Fetch) pour les appels backend.
- **`utils.ts`** : Fonctions utilitaires (formatage dates, classes CSS).
- **`constants.ts`** : Constantes globales (URLs, clés de config).

### `hooks/`
Hooks React personnalisés.
- **`use-auth.ts`** : Gestion de l'authentification.
- **`use-booking.ts`** : Logique de réservation.
- **`use-chat.ts`** : Logique de messagerie temps réel.

### `store/`
Gestion d'état global avec **Zustand**.
- **`user-store.ts`** : Infos utilisateur connecté.
- **`player-store.ts`** : État du lecteur audio (lecture, pause, piste).

### `types/`
Définitions TypeScript partagées.
- **`index.ts`** : Types principaux (User, Service, Booking, Message).

## 🚀 Démarrage

```bash
npm install
npm run dev
```

# Instructions Backend - Projet La Kapsul

Ce document sert de spécification technique pour l'implémentation du backend de la plateforme La Kapsul. L'objectif est de fournir une API robuste, sécurisée et performante pour alimenter le frontend Next.js existant.

## 1. Stack Technique Recommandée

*   **Langage/Framework**: Node.js avec NestJS (pour sa structure et sa scalabilité) ou Express (pour sa simplicité).
*   **Base de données**: PostgreSQL (relationnel, robuste).
*   **ORM**: Prisma (Type-safe, facile à utiliser avec TypeScript).
*   **Authentification**: Supabase Auth ou NextAuth.js (avec adaptateur Prisma).
*   **Stockage Fichiers**: AWS S3 ou Supabase Storage (pour les images, audio).
*   **Temps Réel**: Socket.io (pour le chat et les notifications).

## 2. Architecture de la Base de Données (Schéma Prisma)

Voici les principaux modèles à implémenter :

### Users
*   `id`: UUID
*   `email`: String (Unique)
*   `password`: String (Hashed)
*   `role`: Enum (ARTIST, PROVIDER, ADMIN)
*   `profile`: Relation One-to-One vers Profile
*   `createdAt`, `updatedAt`

### Profiles
*   `id`: UUID
*   `userId`: FK vers User
*   `username`: String (Unique)
*   `bio`: String
*   `avatarUrl`: String
*   `coverUrl`: String
*   `location`: String
*   `skills`: String[] (Tags: "Beatmaker", "Ingé Son", etc.)
*   `rating`: Float
*   `reviewCount`: Int
*   `media`: Relation One-to-Many vers Media
*   `services`: Relation One-to-Many vers Service

### Services (Offres des prestataires)
*   `id`: UUID
*   `profileId`: FK vers Profile
*   `title`: String
*   `description`: String
*   `price`: Float
*   `duration`: Int (minutes)
*   `type`: Enum (RECORDING, MIXING, MASTERING, BEATMAKING)

### Bookings (Réservations)
*   `id`: UUID
*   `artistId`: FK vers User (Client)
*   `providerId`: FK vers User (Prestataire)
*   `serviceId`: FK vers Service
*   `date`: DateTime
*   `status`: Enum (PENDING, CONFIRMED, COMPLETED, CANCELLED)
*   `amount`: Float

### Media (Portfolio)
*   `id`: UUID
*   `profileId`: FK vers Profile
*   `type`: Enum (IMAGE, AUDIO)
*   `url`: String
*   `title`: String
*   `metadata`: JSON (durée, plays, etc.)

### Forum
*   `Category`: id, name, slug
*   `Thread`: id, title, content, authorId, categoryId, views, createdAt
*   `Post`: id, content, threadId, authorId, createdAt (Réponses)

### Chat
*   `Conversation`: id, participants (Many-to-Many Users)
*   `Message`: id, conversationId, senderId, content, readAt, createdAt

## 3. API Endpoints (REST)

### Authentification
*   `POST /auth/register`: Création de compte
*   `POST /auth/login`: Connexion (JWT)
*   `GET /auth/me`: Récupérer l'utilisateur courant

### Profils
*   `GET /profiles`: Recherche avec filtres (skills, location)
*   `GET /profiles/:username`: Détails complets
*   `PUT /profiles/me`: Mise à jour du profil
*   `POST /profiles/me/media`: Upload de média

### Services & Booking
*   `GET /services`: Liste des services d'un provider
*   `POST /bookings`: Créer une réservation
*   `GET /bookings/me`: Liste de mes réservations (Artiste ou Provider)
*   `PATCH /bookings/:id/status`: Accepter/Refuser (Provider only)

### Forum
*   `GET /forum/categories`: Liste des catégories
*   `GET /forum/threads`: Liste des sujets (pagination, filtres)
*   `POST /forum/threads`: Créer un sujet
*   `GET /forum/threads/:id`: Voir un sujet et ses réponses
*   `POST /forum/threads/:id/reply`: Répondre

## 4. Fonctionnalités Spécifiques

### Dashboard Provider
*   Calculer les statistiques (Revenu mensuel, Nombre de réservations) via des requêtes d'agrégation SQL/Prisma.
*   Générer les données pour les graphiques (revenus par jour/semaine).

### Temps Réel (WebSockets)
*   **Chat**: Quand un message est envoyé, l'émettre via Socket.io aux participants de la room.
*   **Notifications**: Notifier le provider quand une nouvelle réservation arrive.

### Sécurité
*   Valider toutes les entrées avec Zod ou class-validator.
*   Rate limiting sur les routes sensibles.
*   Protection CSRF/CORS appropriée.

## 5. Instructions pour l'IA Backend

"Tu es un expert Backend. Ta tâche est d'implémenter l'API décrite ci-dessus. Commence par initialiser le projet NestJS, configure Prisma avec le schéma fourni, et implémente les modules un par un (Auth, Users, Profiles, Bookings, Forum). Assure-toi que chaque endpoint est testé et documenté (Swagger)."

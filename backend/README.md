# La Kapsul - Backend API

API Backend Fastify + Prisma pour la plateforme La Kapsul.

## Prérequis

- Node.js 18+
- PostgreSQL (ou Supabase)

## Installation

```bash
cd backend
npm install
```

## Configuration

Créez un fichier `.env` dans `/backend` avec:

```bash
# Database - Supabase ou PostgreSQL local
DATABASE_URL="postgresql://postgres:MOT_DE_PASSE@db.VOTRE_PROJET.supabase.co:5432/postgres"

# JWT - Changez en production!
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_EXPIRES_IN="7d"

# Client URL
CLIENT_URL="http://localhost:3000"
```

## Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la BDD
npm run db:push

# Visualiser les données (optionnel)
npm run db:studio
```

## Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## API Documentation

Swagger UI disponible sur: `http://localhost:4000/docs`

## Endpoints Principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/signup` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur actuel |
| GET | `/api/providers` | Liste des prestataires |
| GET | `/api/providers/:id` | Détails prestataire |
| POST | `/api/bookings` | Créer réservation |
| GET | `/api/bookings/me` | Mes réservations |
| GET | `/api/forum/threads` | Sujets du forum |
| POST | `/api/forum/threads` | Créer un sujet |

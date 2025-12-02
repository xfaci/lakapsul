# Guide d'Implémentation Backend (La Kapsul)

Ce document décrit les étapes nécessaires pour implémenter le backend de La Kapsul en utilisant Supabase (PostgreSQL + Auth).

## 1. Configuration Supabase

1.  Créer un nouveau projet sur [Supabase](https://supabase.com/).
2.  Récupérer les clés API (`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`) et les ajouter dans un fichier `.env.local`.

## 2. Schéma de Base de Données

Exécutez les requêtes SQL suivantes dans l'éditeur SQL de Supabase pour créer les tables.

### Users (Extension de auth.users)
```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('ARTIST', 'PROVIDER')),
  bio text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activez RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

### Services
```sql
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.profiles(id) not null,
  name text not null,
  description text,
  price integer not null, -- en centimes
  duration integer, -- en minutes
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Bookings
```sql
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) not null,
  artist_id uuid references public.profiles(id) not null,
  provider_id uuid references public.profiles(id) not null,
  status text check (status in ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')) default 'PENDING',
  date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 3. Authentification

1.  Activer les fournisseurs **Google** et **SoundCloud** dans l'onglet Authentication > Providers de Supabase.
2.  Configurer les URLs de redirection (ex: `http://localhost:3000/auth/callback`).

## 4. API Routes (Next.js)

Créez des Server Actions ou des Route Handlers pour interagir avec la DB.

Exemple `app/actions/get-services.ts`:
```typescript
import { createClient } from '@/utils/supabase/server';

export async function getServices() {
  const supabase = createClient();
  const { data, error } = await supabase.from('services').select('*');
  return data;
}
```

## 5. Stockage (Storage)

1.  Créer un bucket `avatars` pour les photos de profil.
2.  Créer un bucket `portfolio` pour les extraits audio/vidéo.

## 6. Prochaines Étapes

-   [ ] Installer `@supabase/ssr` dans le projet Next.js.
-   [ ] Créer le client Supabase (Browser & Server).
-   [ ] Remplacer les données mockées (`MOCK_PROVIDERS`) par les appels DB.

## 7. Dashboard Data Requirements (New)

Pour alimenter le nouveau tableau de bord artiste :
-   **Stats Endpoint**: Besoin d'une route pour récupérer :
    -   Nombre de projets actifs.
    -   Nombre de réservations à venir.
    -   Dépenses du mois en cours (vs mois précédent).
    -   Activité récente (notifications ou logs).
-   **Chart Data**: Besoin d'une route pour récupérer les données historiques (plays, revenus, etc.) pour les graphiques.


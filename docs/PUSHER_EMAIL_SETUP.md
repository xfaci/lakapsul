# 🔧 Configuration Pusher & Email - La Kapsul

Guide de configuration pour les notifications temps réel (Pusher) et le système d'emails (Gmail SMTP).

---

## 📧 Configuration Email avec Gmail

### 1. Créer un mot de passe d'application Gmail

1. Va sur https://myaccount.google.com/security
2. Active la **vérification en 2 étapes** si pas déjà fait
3. Va sur https://myaccount.google.com/apppasswords
4. Sélectionne "App: Mail" et "Appareil: Autre (La Kapsul)"
5. Clique "Générer" → copie le mot de passe de 16 caractères

### 2. Variables Vercel à ajouter

Dans Vercel Dashboard → Settings → Environment Variables :

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=lakapsulapp@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  (mot de passe d'application)
EMAIL_FROM=La Kapsul <lakapsulapp@gmail.com>
NEXT_PUBLIC_APP_URL=https://lakapsul.vercel.app
```

**Quand tu auras le domaine .fr, change:**
```
NEXT_PUBLIC_APP_URL=https://lakapsul.fr
EMAIL_FROM=La Kapsul <noreply@lakapsul.fr>
```

### 3. Installer Nodemailer

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 4. Créer le service email

Créer `lib/email.ts` :

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lakapsul.vercel.app';
    
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'La Kapsul <lakapsulapp@gmail.com>',
            to,
            subject,
            html: html.replace(/{{APP_URL}}/g, appUrl),
        });
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
}

// Templates
export const emailTemplates = {
    welcome: (name: string) => ({
        subject: 'Bienvenue sur La Kapsul ! 🎵',
        html: `
            <h1>Bienvenue ${name} !</h1>
            <p>Ton compte La Kapsul a été créé avec succès.</p>
            <p><a href="{{APP_URL}}/search">Découvrir les prestataires</a></p>
        `,
    }),
    
    bookingConfirmed: (data: { service: string; provider: string; date: string }) => ({
        subject: 'Réservation confirmée ✅',
        html: `
            <h1>Ta réservation est confirmée !</h1>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Prestataire:</strong> ${data.provider}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><a href="{{APP_URL}}/dashboard">Voir mes réservations</a></p>
        `,
    }),
    
    newBookingRequest: (data: { artist: string; service: string; date: string }) => ({
        subject: 'Nouvelle demande de réservation 📅',
        html: `
            <h1>Nouvelle réservation !</h1>
            <p><strong>De:</strong> ${data.artist}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><a href="{{APP_URL}}/provider/bookings">Gérer mes réservations</a></p>
        `,
    }),
    
    passwordReset: (resetUrl: string) => ({
        subject: 'Réinitialisation de mot de passe',
        html: `
            <h1>Réinitialise ton mot de passe</h1>
            <p>Clique sur le lien ci-dessous (expire dans 1 heure) :</p>
            <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
            <p>Si tu n'as pas demandé cette réinitialisation, ignore cet email.</p>
        `,
    }),
};
```

---

## 📡 Configuration Pusher (Temps Réel)

### 1. Créer un compte Pusher

1. Va sur https://pusher.com et créé un compte gratuit
2. Crée une nouvelle app "La Kapsul"
3. Sélectionne cluster "eu" (Europe)
4. Copie les clés depuis le dashboard

### 2. Variables Vercel à ajouter

```
PUSHER_APP_ID=1234567
PUSHER_KEY=abc123def456
PUSHER_SECRET=xyz789secret
PUSHER_CLUSTER=eu
NEXT_PUBLIC_PUSHER_KEY=abc123def456
NEXT_PUBLIC_PUSHER_CLUSTER=eu
```

### 3. Installer Pusher

```bash
npm install pusher pusher-js
```

### 4. Créer le client Pusher (serveur)

Créer `lib/pusher-server.ts` :

```typescript
import Pusher from 'pusher';

export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

// Helper functions
export async function notifyNewMessage(userId: string, message: {
    id: string;
    content: string;
    senderName: string;
}) {
    await pusherServer.trigger(`user-${userId}`, 'new-message', message);
}

export async function notifyNewBooking(providerId: string, booking: {
    id: string;
    artistName: string;
    serviceName: string;
    date: string;
}) {
    await pusherServer.trigger(`user-${providerId}`, 'new-booking', booking);
}
```

### 5. Créer le hook client

Créer `hooks/use-pusher.ts` :

```typescript
'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useUserStore } from '@/store/user-store';
import { toast } from 'sonner';

let pusherClient: Pusher | null = null;

export function usePusher() {
    const { user, isAuthenticated } = useUserStore();

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        // Initialize Pusher
        if (!pusherClient) {
            pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            });
        }

        // Subscribe to user's channel
        const channel = pusherClient.subscribe(`user-${user.id}`);

        // Listen for new messages
        channel.bind('new-message', (data: { content: string; senderName: string }) => {
            toast.info(`💬 ${data.senderName}: ${data.content.substring(0, 50)}...`);
        });

        // Listen for new bookings (providers only)
        channel.bind('new-booking', (data: { artistName: string; serviceName: string }) => {
            toast.success(`📅 Nouvelle réservation de ${data.artistName} pour ${data.serviceName}`);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [isAuthenticated, user?.id]);
}
```

### 6. Utiliser dans le layout

Dans `app/layout.tsx` ou un composant wrapper :

```tsx
'use client';

import { usePusher } from '@/hooks/use-pusher';

export function PusherProvider({ children }: { children: React.ReactNode }) {
    usePusher();
    return <>{children}</>;
}
```

---

## 📋 Checklist Variables Vercel

### Email (Gmail)
- [ ] `EMAIL_HOST` = smtp.gmail.com
- [ ] `EMAIL_PORT` = 587
- [ ] `EMAIL_USER` = lakapsulapp@gmail.com
- [ ] `EMAIL_PASSWORD` = (mot de passe app 16 caractères)
- [ ] `EMAIL_FROM` = La Kapsul <lakapsulapp@gmail.com>
- [ ] `NEXT_PUBLIC_APP_URL` = https://lakapsul.vercel.app

### Pusher
- [ ] `PUSHER_APP_ID` = (depuis dashboard Pusher)
- [ ] `PUSHER_KEY` = (depuis dashboard Pusher)
- [ ] `PUSHER_SECRET` = (depuis dashboard Pusher)
- [ ] `PUSHER_CLUSTER` = eu
- [ ] `NEXT_PUBLIC_PUSHER_KEY` = (même que PUSHER_KEY)
- [ ] `NEXT_PUBLIC_PUSHER_CLUSTER` = eu

---

## 🔄 Migration vers lakapsul.fr

Quand le domaine sera prêt, change ces variables :

```
NEXT_PUBLIC_APP_URL=https://lakapsul.fr
```

Et optionnellement :
```
EMAIL_FROM=La Kapsul <noreply@lakapsul.fr>
```

> 💡 Si tu veux garder Gmail comme expéditeur mais avec le domaine .fr pour les liens, c'est possible. Seule la variable `NEXT_PUBLIC_APP_URL` affecte les liens dans les emails.

---

## 🧪 Tester

### Test Email
```bash
curl -X POST https://lakapsul.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "ton@email.com"}'
```

### Test Pusher
Ouvre 2 onglets sur /messages et envoie un message - tu devrais voir la notification apparaître dans l'autre onglet.

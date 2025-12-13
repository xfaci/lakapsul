# 📧 Email System Setup Guide

Complete guide to configure email functionality for La Kapsul.

---

## 1. Recommended Provider: Resend

[Resend](https://resend.com) is recommended for Vercel projects - excellent DX and free tier.

### Setup Steps

1. **Create account** at https://resend.com
2. **Verify domain** `lakapsul.fr` (or use default `onboarding@resend.dev` for testing)
3. **Get API Key** from dashboard
4. **Add to Vercel** environment variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM=La Kapsul <noreply@lakapsul.fr>
   ```

### Install SDK
```bash
npm install resend
```

---

## 2. Email Service Implementation

Create `lib/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'La Kapsul <noreply@lakapsul.fr>',
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
}
```

---

## 3. Email Templates

### Welcome Email
```typescript
export function welcomeEmail(name: string) {
    return `
        <h1>Bienvenue sur La Kapsul, ${name} ! 🎵</h1>
        <p>Votre compte a été créé avec succès.</p>
        <p>Commencez dès maintenant à explorer notre plateforme.</p>
        <a href="https://lakapsul.fr/search">Trouver un prestataire</a>
    `;
}
```

### Password Reset Email
```typescript
export function passwordResetEmail(resetUrl: string) {
    return `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe.</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `;
}
```

### Booking Confirmation
```typescript
export function bookingConfirmationEmail(booking: {
    service: string;
    provider: string;
    date: string;
    amount: number;
}) {
    return `
        <h1>Votre réservation est confirmée ✅</h1>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Prestataire:</strong> ${booking.provider}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Montant:</strong> ${booking.amount}€</p>
    `;
}
```

---

## 4. Forgot Password Implementation

### Database Schema (already exists)
Add to `schema.prisma` if not present:
```prisma
model PasswordReset {
    id        String   @id @default(cuid())
    userId    String
    user      User     @relation(fields: [userId], references: [id])
    token     String   @unique
    expiresAt DateTime
    createdAt DateTime @default(now())
}
```

### API Route: `/api/auth/forgot-password`
```typescript
import { prisma } from '@/lib/prisma';
import { sendEmail, passwordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
    const { email } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Return success even if not found (security)
        return Response.json({ success: true });
    }
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    
    await prisma.passwordReset.create({
        data: { userId: user.id, token, expiresAt }
    });
    
    const resetUrl = `https://lakapsul.fr/reset-password?token=${token}`;
    await sendEmail({
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: passwordResetEmail(resetUrl)
    });
    
    return Response.json({ success: true });
}
```

---

## 5. Environment Variables Checklist

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender address (e.g., `La Kapsul <noreply@lakapsul.fr>`) |

---

## 6. Alternative Providers

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| **Resend** | 3,000/month | Best for Vercel |
| **SendGrid** | 100/day | Robust, enterprise |
| **Mailgun** | 5,000/month | Good deliverability |
| **Postmark** | 100/month | Fast, reliable |

---

## 7. Domain Setup for lakapsul.fr

When you get the domain, add these DNS records in Resend:

| Type | Name | Value |
|------|------|-------|
| TXT | @ | resend-verification=xxx |
| MX | mail | feedback-smtp.lakapsul.fr |
| CNAME | resend._domainkey | xxx.dkim.resend.dev |

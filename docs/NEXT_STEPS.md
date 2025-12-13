# 🚀 La Kapsul - Next Steps & Roadmap

## 📊 Current Status
- **Site:** lakapsul.vercel.app (bientôt lakapsul.fr)
- **Stack:** Next.js 15, Prisma, Supabase, Vercel
- **Tests:** Search ✅, Profiles ✅, Auth ✅, Booking ✅, Admin ✅

---

## 🔥 Priority 1: Production Ready

### Domain Migration (lakapsul.fr)
- [ ] Acheter/configurer le domaine lakapsul.fr
- [ ] Configurer DNS vers Vercel
- [ ] Mettre à jour les OAuth redirect URLs (Google, Discord)
- [ ] Configurer HTTPS automatique

### Email System
- [ ] Créer un compte Resend
- [ ] Vérifier le domaine lakapsul.fr
- [ ] Implémenter `lib/email.ts`
- [ ] Ajouter reset password dans `/api/auth/forgot-password`
- [ ] Emails: bienvenue, réservation, notifications

### Paiements
- [ ] Intégrer Stripe Connect (pour payer les prestataires)
- [ ] Créer `/api/payments/checkout`
- [ ] Créer `/api/payments/webhook` 
- [ ] Page de paiement après confirmation booking
- [ ] Dashboard revenus prestataires

---

## 🎯 Priority 2: Features Core

### Reviews & Ratings
- [ ] Intégrer ReviewForm sur la page booking success
- [ ] Permettre l'édition des reviews
- [ ] Modération des reviews par admin

### Messaging
- [ ] Notifications en temps réel (Pusher/Ably)
- [ ] Pièces jointes (audio, images)
- [ ] Marquer comme lu/non lu

### Calendrier & Disponibilités
- [ ] Prestataires définissent leurs dispos
- [ ] Vue calendrier sur profil provider
- [ ] Blocage créneaux réservés

### Portfolio Prestataires
- [ ] Upload audio (SoundCloud/YouTube embeds)
- [ ] Galerie photos
- [ ] Vidéos (projets réalisés)

---

## 📈 Priority 3: Growth Features

### Boost & Visibilité
- [ ] Page `/boost` avec tarifs
- [ ] Badge "Partenaire vérifié"
- [ ] Mise en avant sur la homepage
- [ ] Intégration paiement boost

### SEO & Marketing
- [ ] Sitemap dynamique
- [ ] Meta tags par page
- [ ] Blog/Actualités
- [ ] Landing pages par ville

### AI Chatbot
- [ ] Implémenter selon guide AI_CHATBOT_SETUP.md
- [ ] Widget sur toutes les pages
- [ ] Recommandations intelligentes

---

## 🛡️ Priority 4: Sécurité & Performance

### Sécurité
- [ ] Rate limiting sur les APIs
- [ ] Protection CSRF
- [ ] Validation Zod sur toutes les APIs
- [ ] Audit logs admin

### Performance
- [ ] Images optimisées (Next/Image)
- [ ] Lazy loading components
- [ ] Cache Redis pour queries fréquentes
- [ ] Bundle analysis

### Monitoring
- [ ] Sentry pour error tracking
- [ ] Analytics (Vercel/Plausible)
- [ ] Uptime monitoring

---

## 📱 Priority 5: Mobile & Apps

### PWA
- [ ] Service worker
- [ ] Install prompt
- [ ] Notifications push

### Apps Natives (futur)
- [ ] React Native ou Expo
- [ ] Notifications push natives
- [ ] Paiement in-app

---

## 📅 Timeline Suggérée

| Semaine | Focus |
|---------|-------|
| 1 | Domain + Emails + Stripe basic |
| 2 | Paiements complets + Reviews |
| 3 | Calendrier + Portfolio |
| 4 | SEO + Chatbot + Polish |

---

## 📧 Contact & Support

- **Admin:** admin@lakapsul.com (sera @lakapsul.fr)
- **Technique:** Configurer email support

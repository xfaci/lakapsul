"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
    return (
        <div className="container py-16 max-w-4xl">
            <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle className="text-3xl">Politique de Confidentialité</CardTitle>
                    <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                    <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
                    <p className="text-muted-foreground mb-4">
                        La Kapsul SAS (&quot;nous&quot;, &quot;notre&quot;, &quot;nos&quot;) s&apos;engage à protéger la vie privée des utilisateurs de notre plateforme.
                        Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">2. Données collectées</h2>
                    <p className="text-muted-foreground mb-4">Nous collectons les données suivantes :</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Informations d&apos;identification (nom, prénom, email)</li>
                        <li>Informations de profil (photo, bio, localisation)</li>
                        <li>Données de paiement (via Stripe, nous ne stockons pas vos données bancaires)</li>
                        <li>Historique des réservations et des messages</li>
                        <li>Données de navigation (cookies, adresse IP)</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">3. Utilisation des données</h2>
                    <p className="text-muted-foreground mb-4">Vos données sont utilisées pour :</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Fournir et améliorer nos services</li>
                        <li>Traiter vos paiements et réservations</li>
                        <li>Communiquer avec vous (notifications, support)</li>
                        <li>Assurer la sécurité de la plateforme</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">4. Partage des données</h2>
                    <p className="text-muted-foreground mb-4">
                        Nous ne vendons pas vos données. Nous les partageons uniquement avec :
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Stripe (pour les paiements)</li>
                        <li>Supabase (hébergement des données)</li>
                        <li>Vercel (hébergement du site)</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-3">5. Vos droits (RGPD)</h2>
                    <p className="text-muted-foreground mb-4">
                        Conformément au RGPD, vous avez le droit de :
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Accéder à vos données personnelles</li>
                        <li>Les rectifier ou les supprimer</li>
                        <li>Limiter leur traitement</li>
                        <li>Vous opposer à leur utilisation</li>
                        <li>Les exporter (portabilité)</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                        Pour exercer ces droits, contactez-nous à : <strong>privacy@lakapsul.com</strong>
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">6. Cookies</h2>
                    <p className="text-muted-foreground mb-4">
                        Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies analytiques
                        pour améliorer votre expérience. Vous pouvez les désactiver dans les paramètres de votre navigateur.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact</h2>
                    <p className="text-muted-foreground mb-4">
                        Pour toute question concernant cette politique, contactez-nous à :<br />
                        <strong>Email :</strong> contact@lakapsul.com<br />
                        <strong>Adresse :</strong> Paris, France
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

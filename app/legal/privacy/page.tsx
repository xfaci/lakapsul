import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="container max-w-4xl">
                <Button variant="ghost" size="sm" asChild className="mb-6">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Link>
                </Button>

                <div className="text-center mb-12">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
                    <p className="text-muted-foreground">Dernière mise à jour : Décembre 2024</p>
                </div>

                <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-8 prose prose-invert max-w-none">
                    <h2>1. Collecte des données</h2>
                    <p>
                        Nous collectons les données que vous nous fournissez lors de votre inscription :
                    </p>
                    <ul>
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Informations de profil (bio, avatar, compétences)</li>
                        <li>Données de réservation</li>
                    </ul>

                    <h2>2. Utilisation des données</h2>
                    <p>Vos données sont utilisées pour :</p>
                    <ul>
                        <li>Gérer votre compte</li>
                        <li>Traiter vos réservations</li>
                        <li>Vous envoyer des notifications</li>
                        <li>Améliorer nos services</li>
                    </ul>

                    <h2>3. Partage des données</h2>
                    <p>
                        Nous ne vendons jamais vos données. Elles peuvent être partagées avec :
                    </p>
                    <ul>
                        <li>Les prestataires lors d&apos;une réservation</li>
                        <li>Notre partenaire de paiement (Stripe)</li>
                        <li>Les autorités si requis par la loi</li>
                    </ul>

                    <h2>4. Sécurité</h2>
                    <p>
                        Nous utilisons le chiffrement SSL et des mesures de sécurité
                        pour protéger vos données. Les mots de passe sont hashés.
                    </p>

                    <h2>5. Cookies</h2>
                    <p>
                        Nous utilisons des cookies essentiels pour le fonctionnement
                        du site et des cookies analytics pour améliorer l&apos;expérience.
                    </p>

                    <h2>6. Vos droits (RGPD)</h2>
                    <p>Conformément au RGPD, vous avez le droit de :</p>
                    <ul>
                        <li>Accéder à vos données</li>
                        <li>Rectifier vos données</li>
                        <li>Supprimer vos données</li>
                        <li>Exporter vos données</li>
                        <li>Retirer votre consentement</li>
                    </ul>

                    <h2>7. Conservation</h2>
                    <p>
                        Vos données sont conservées tant que votre compte est actif,
                        puis supprimées après 3 ans d&apos;inactivité.
                    </p>

                    <h2>8. Contact DPO</h2>
                    <p>
                        Pour exercer vos droits : <a href="mailto:privacy@lakapsul.fr">privacy@lakapsul.fr</a>
                    </p>
                </Card>
            </div>
        </div>
    );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Conditions Générales d&apos;Utilisation</h1>
                    <p className="text-muted-foreground">Dernière mise à jour : Décembre 2024</p>
                </div>

                <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-8 prose prose-invert max-w-none">
                    <h2>1. Objet</h2>
                    <p>
                        Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation
                        de la plateforme La Kapsul, accessible via le site lakapsul.fr.
                    </p>

                    <h2>2. Définitions</h2>
                    <ul>
                        <li><strong>Plateforme</strong> : Le site web La Kapsul</li>
                        <li><strong>Utilisateur</strong> : Toute personne inscrite sur la plateforme</li>
                        <li><strong>Artiste</strong> : Utilisateur cherchant des services musicaux</li>
                        <li><strong>Prestataire</strong> : Utilisateur offrant des services musicaux</li>
                    </ul>

                    <h2>3. Inscription</h2>
                    <p>
                        L&apos;inscription sur La Kapsul est gratuite. L&apos;utilisateur s&apos;engage à fournir
                        des informations exactes et à maintenir son compte sécurisé.
                    </p>

                    <h2>4. Services</h2>
                    <p>
                        La Kapsul met en relation des artistes et des prestataires de services musicaux.
                        La plateforme n&apos;est pas partie aux contrats conclus entre utilisateurs.
                    </p>

                    <h2>5. Réservations et Paiements</h2>
                    <p>
                        Les réservations sont effectuées via la plateforme. Le paiement est sécurisé
                        par notre partenaire Stripe. Les prestataires reçoivent les fonds après
                        réalisation du service.
                    </p>

                    <h2>6. Annulation</h2>
                    <p>
                        Les conditions d&apos;annulation sont définies par chaque prestataire.
                        En cas d&apos;annulation par le prestataire, l&apos;artiste est intégralement remboursé.
                    </p>

                    <h2>7. Responsabilité</h2>
                    <p>
                        La Kapsul n&apos;est pas responsable de la qualité des services fournis par
                        les prestataires. Nous mettons tout en œuvre pour vérifier les profils
                        et modérer les avis.
                    </p>

                    <h2>8. Propriété Intellectuelle</h2>
                    <p>
                        Chaque utilisateur reste propriétaire de ses contenus. En publiant sur
                        La Kapsul, vous accordez une licence d&apos;utilisation pour l&apos;affichage
                        sur la plateforme.
                    </p>

                    <h2>9. Contact</h2>
                    <p>
                        Pour toute question : <a href="mailto:support@lakapsul.fr">support@lakapsul.fr</a>
                    </p>
                </Card>
            </div>
        </div>
    );
}

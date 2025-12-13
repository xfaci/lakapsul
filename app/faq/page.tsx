import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { HelpCircle, Search, CreditCard, Calendar, Shield, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        category: "Général",
        icon: HelpCircle,
        questions: [
            {
                q: "Qu'est-ce que La Kapsul ?",
                a: "La Kapsul est une plateforme qui connecte les artistes musicaux avec des prestataires professionnels : studios d'enregistrement, ingénieurs du son, beatmakers, et bien plus.",
            },
            {
                q: "L'inscription est-elle gratuite ?",
                a: "Oui ! L'inscription est 100% gratuite pour les artistes. Les prestataires peuvent créer un compte gratuitement et ne paient qu'une commission sur les réservations confirmées.",
            },
            {
                q: "Comment fonctionne La Kapsul ?",
                a: "1. Inscris-toi gratuitement\n2. Parcours les profils des prestataires\n3. Réserve le service qui te convient\n4. Confirme et paie en ligne\n5. Réalise ton projet musical !",
            },
        ],
    },
    {
        category: "Réservations",
        icon: Calendar,
        questions: [
            {
                q: "Comment réserver un service ?",
                a: "Trouve un prestataire, choisis un service, sélectionne une date et un créneau horaire, puis confirme ta réservation. Tu recevras un email de confirmation.",
            },
            {
                q: "Puis-je annuler une réservation ?",
                a: "Oui, tu peux annuler jusqu'à 24h avant la date prévue. Au-delà, des frais d'annulation peuvent s'appliquer selon les conditions du prestataire.",
            },
            {
                q: "Que se passe-t-il si le prestataire annule ?",
                a: "En cas d'annulation par le prestataire, tu seras intégralement remboursé et nous t'aiderons à trouver une alternative.",
            },
        ],
    },
    {
        category: "Paiements",
        icon: CreditCard,
        questions: [
            {
                q: "Quels moyens de paiement acceptez-vous ?",
                a: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) via notre partenaire Stripe, qui garantit des paiements 100% sécurisés.",
            },
            {
                q: "Quand suis-je débité ?",
                a: "Le paiement est prélevé au moment de la confirmation de la réservation. Le prestataire reçoit les fonds après la réalisation du service.",
            },
            {
                q: "Comment fonctionne le remboursement ?",
                a: "Les remboursements sont traités sous 5 à 10 jours ouvrés et crédités sur ton moyen de paiement original.",
            },
        ],
    },
    {
        category: "Sécurité",
        icon: Shield,
        questions: [
            {
                q: "Mes données sont-elles protégées ?",
                a: "Absolument. Nous utilisons un chiffrement SSL et ne stockons jamais tes informations de paiement. Conforme RGPD.",
            },
            {
                q: "Comment sont vérifiés les prestataires ?",
                a: "Tous les prestataires passent par un processus de vérification : identité, qualifications, et portfolio. Nous vérifions également les avis.",
            },
        ],
    },
    {
        category: "Support",
        icon: MessageCircle,
        questions: [
            {
                q: "Comment contacter le support ?",
                a: "Tu peux nous contacter via la messagerie intégrée, par email à support@lakapsul.fr, ou via nos réseaux sociaux.",
            },
            {
                q: "Quel est le délai de réponse ?",
                a: "Nous répondons généralement sous 24h ouvrées. Pour les urgences, utilise le chat en direct.",
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="container max-w-4xl">
                {/* Back button */}
                <Button variant="ghost" size="sm" asChild className="mb-6">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Link>
                </Button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Foire aux Questions</h1>
                    <p className="text-muted-foreground text-lg">
                        Retrouve les réponses aux questions les plus fréquentes
                    </p>
                </div>

                {/* Search hint */}
                <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-4 mb-8 flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                        Tu ne trouves pas ta réponse ? Contacte-nous sur{" "}
                        <a href="mailto:support@lakapsul.fr" className="text-primary hover:underline">
                            support@lakapsul.fr
                        </a>
                    </span>
                </Card>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {faqs.map((category) => (
                        <Card key={category.category} className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <category.icon className="h-6 w-6 text-primary" />
                                <h2 className="text-xl font-semibold">{category.category}</h2>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                {category.questions.map((faq, index) => (
                                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                                        <AccordionTrigger className="text-left hover:no-underline">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

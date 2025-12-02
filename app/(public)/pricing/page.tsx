"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="container py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Tarifs simples et transparents</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Rejoignez La Kapsul et commencez à développer votre activité musicale.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Artist Plan */}
                <div className="rounded-3xl border bg-card p-8 shadow-sm flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Artistes</h3>
                        <p className="text-muted-foreground">Pour les créateurs de musique</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">Gratuit</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Recherche illimitée</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Réservation sécurisée</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Messagerie avec les pros</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Support client 7j/7</span>
                        </li>
                    </ul>
                    <Button size="xl" asChild className="w-full">
                        <Link href="/signup">Créer un compte artiste</Link>
                    </Button>
                </div>

                {/* Provider Plan */}
                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-lg flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl text-sm font-medium">
                        Populaire
                    </div>
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Prestataires</h3>
                        <p className="text-muted-foreground">Pour les studios et ingénieurs</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">10%</span>
                        <span className="text-muted-foreground ml-2">de commission</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Visibilité accrue</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Gestion des réservations</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Paiements sécurisés</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Protection contre les annulations</span>
                        </li>
                    </ul>
                    <Button size="xl" asChild className="w-full">
                        <Link href="/signup">Devenir prestataire</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

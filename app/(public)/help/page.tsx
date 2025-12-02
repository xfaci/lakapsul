"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="container py-24 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Centre d'aide</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Comment pouvons-nous vous aider ?
                </p>
                <div className="relative max-w-lg mx-auto">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Rechercher une réponse..." className="pl-10 h-12 text-lg" />
                </div>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Questions fréquentes</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Comment réserver un studio ?</AccordionTrigger>
                            <AccordionContent>
                                Pour réserver un studio, recherchez le prestataire idéal via notre moteur de recherche, sélectionnez vos dates et effectuez une demande de réservation. Le prestataire a 24h pour accepter.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Quels sont les frais de service ?</AccordionTrigger>
                            <AccordionContent>
                                L'inscription est gratuite pour les artistes. Nous prélevons une commission de 10% uniquement sur les réservations effectuées par les prestataires.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Comment se passe le paiement ?</AccordionTrigger>
                            <AccordionContent>
                                Le paiement est sécurisé et cantonné jusqu'à la fin de la prestation. Le prestataire est payé une fois le service validé.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>
            </div>
        </div>
    );
}

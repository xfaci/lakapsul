"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Search, UserCheck } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "1. Recherchez",
        description: "Parcourez notre catalogue de studios, ingénieurs et beatmakers vérifiés. Filtrez par style, budget et localisation.",
    },
    {
        icon: Calendar,
        title: "2. Réservez",
        description: "Sélectionnez vos dates et options. Notre système de réservation est instantané et sécurisé.",
    },
    {
        icon: UserCheck,
        title: "3. Collaborez",
        description: "Échangez avec le prestataire via notre messagerie intégrée pour préparer votre session.",
    },
    {
        icon: CheckCircle2,
        title: "4. Validez",
        description: "Une fois le service terminé, validez la prestation et laissez un avis pour aider la communauté.",
    },
];

export default function HowItWorksPage() {
    return (
        <div className="container py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Comment ça marche ?</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    La Kapsul simplifie la création musicale en connectant les artistes aux meilleurs professionnels.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-muted -z-10" />

                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col items-center text-center bg-background p-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 border-4 border-background relative z-10">
                            <step.icon className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

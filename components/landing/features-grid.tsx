"use client";

import { motion } from "framer-motion";
import { Mic2, Music2, Sliders, Star, Users, Zap } from "lucide-react";

const features = [
    {
        icon: Mic2,
        title: "Studios d'Enregistrement",
        description: "Accédez à des cabines professionnelles équipées pour capturer votre meilleure performance.",
        className: "md:col-span-2 md:row-span-2",
        gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        icon: Sliders,
        title: "Mixage & Mastering",
        description: "Confiez vos pistes à des ingénieurs experts pour un son radio-ready.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
        icon: Music2,
        title: "Beatmaking",
        description: "Trouvez l'instrumentale parfaite ou collaborez avec des beatmakers.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
        icon: Users,
        title: "Communauté",
        description: "Rejoignez une communauté d'artistes passionnés.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
        icon: Zap,
        title: "Rapide & Sécurisé",
        description: "Réservation instantanée et paiements sécurisés.",
        className: "md:col-span-2 md:row-span-1",
        gradient: "from-red-500/20 to-rose-500/20",
    },
];

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Tout ce dont vous avez besoin
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Une suite complète de services pour accompagner votre carrière musicale.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all ${feature.className}`}
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="p-3 w-fit rounded-2xl bg-primary/10 text-primary mb-4">
                                    <feature.icon className="h-6 w-6" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

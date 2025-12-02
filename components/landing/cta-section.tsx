"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" />
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

            <div className="container relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-blue-600 p-8 md:p-16 text-center text-primary-foreground overflow-hidden relative shadow-2xl shadow-primary/20 border border-white/20"
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Prêt à lancer votre prochain projet ?
                        </h2>
                        <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                            Rejoignez des milliers d&apos;artistes et de professionnels qui font confiance à La Kapsul pour créer la musique de demain.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="xl" variant="secondary" asChild className="text-lg px-8 h-14 rounded-full shadow-lg">
                                <Link href="/signup">
                                    Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

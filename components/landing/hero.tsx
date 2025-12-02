"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-16">
            {/* Liquid Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
                <div className="absolute top-[20%] right-[20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-2000" />
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-xl bg-white/5 mb-8 shadow-lg shadow-primary/5"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]"></span>
                    La plateforme n°1 pour les artistes indépendants
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-sm"
                >
                    Élevez votre musique <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient-x">
                        au niveau supérieur
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
                >
                    Trouvez les meilleurs studios, ingénieurs du son et beatmakers.
                    <br className="hidden md:block" /> Une expérience fluide, sécurisée et professionnelle.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Button size="xl" asChild className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                        <Link href="/search">
                            Trouver un pro <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="xl" variant="outline" asChild className="text-lg px-8 h-14 rounded-full backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <Link href="/signup">
                            <Play className="mr-2 h-5 w-5 fill-current" />
                            Je suis prestataire
                        </Link>
                    </Button>
                </motion.div>

                {/* Floating UI Elements Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    className="mt-20 relative w-full max-w-5xl perspective-1000"
                >
                    <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] ring-1 ring-white/10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-purple-500/10 opacity-50" />

                        {/* Mockup Content */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center relative z-10">
                            {/* Card 1 */}
                            <div className="rounded-xl bg-white/5 p-4 shadow-lg border border-white/5 backdrop-blur-md transform hover:-translate-y-2 transition-transform duration-500">
                                <div className="h-32 rounded-lg bg-white/5 mb-4 animate-pulse" />
                                <div className="h-4 w-3/4 rounded bg-white/5 mb-2" />
                                <div className="h-3 w-1/2 rounded bg-white/5" />
                            </div>
                            {/* Card 2 (Featured) */}
                            <div className="rounded-xl bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-2xl border border-white/10 backdrop-blur-xl scale-110 z-10 hover:scale-115 transition-transform duration-500">
                                <div className="h-32 rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 mb-4 shadow-inner" />
                                <div className="h-4 w-3/4 rounded bg-white/10 mb-2" />
                                <div className="h-3 w-1/2 rounded bg-white/5" />
                            </div>
                            {/* Card 3 */}
                            <div className="rounded-xl bg-white/5 p-4 shadow-lg border border-white/5 backdrop-blur-md transform hover:-translate-y-2 transition-transform duration-500 hidden md:block">
                                <div className="h-32 rounded-lg bg-white/5 mb-4 animate-pulse" />
                                <div className="h-4 w-3/4 rounded bg-white/5 mb-2" />
                                <div className="h-3 w-1/2 rounded bg-white/5" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

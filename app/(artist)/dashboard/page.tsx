"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MessageSquare, Sparkles, Heart, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="relative min-h-screen">
            {/* Liquid Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse-slow"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute top-[20%] right-[20%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/10 rounded-full blur-[60px] md:blur-[100px] mix-blend-screen animate-pulse-slow"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            <div className="relative z-10 space-y-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Bonjour, TrapKevFR 👋</h1>
                        <p className="text-muted-foreground">Voici ce qui se passe sur votre profil.</p>
                    </div>
                    <Button asChild variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10">
                        <Link href="/provider/dashboard">Passer en mode Prestataire</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Bookings & Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link
                                href="/search"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card/30 backdrop-blur-lg border-white/10 hover:bg-accent/50 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Search className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Trouver un pro</span>
                            </Link>
                            <Link
                                href="/messages"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card/30 backdrop-blur-lg border-white/10 hover:bg-accent/50 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Messages</span>
                            </Link>
                            <Link
                                href="/ai-assistant"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card/30 backdrop-blur-lg border-white/10 hover:bg-accent/50 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Assistant IA</span>
                            </Link>
                            <Link
                                href="/favorites"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card/30 backdrop-blur-lg border-white/10 hover:bg-accent/50 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                    <Heart className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Favoris</span>
                            </Link>
                        </div>

                        {/* Upcoming Sessions */}
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Prochaines sessions
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Mock Data */}
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-col flex-col items-center justify-center text-xs font-bold">
                                                <span className="text-primary">12</span>
                                                <span className="text-muted-foreground uppercase text-[10px]">DEC</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Session Studio A</h3>
                                                <p className="text-sm text-muted-foreground">Avec StudioTrapKing • 14:00 - 18:00</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                                            Détails
                                        </Button>
                                    </div>
                                ))}
                                <div className="pt-2 text-center">
                                    <Button variant="link" className="text-primary">
                                        Voir tout le calendrier
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Messages & Stats */}
                    <div className="space-y-8">
                        {/* Recent Messages */}
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="font-semibold">Messages récents</h2>
                                <Link href="/messages" className="text-xs text-primary hover:underline">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="p-4 space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <Link
                                        key={i}
                                        href="#"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                            SK
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm">Studio King</span>
                                                <span className="text-[10px] text-muted-foreground">14:02</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                Salut, c'est bon pour la session de demain ?
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Card>

                        {/* Promo Banner */}
                        <div className="rounded-xl bg-gradient-to-br from-primary to-purple-600 p-6 text-primary-foreground shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="h-24 w-24" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Besoin d'un coup de boost ?</h3>
                            <p className="text-sm opacity-90 mb-4 relative z-10">
                                Découvrez nos services de promotion pour faire décoller votre dernier titre.
                            </p>
                            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none relative z-10">
                                Voir les offres
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

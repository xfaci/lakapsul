"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MessageSquare, Sparkles, Heart, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Booking = {
    id: string;
    date: string;
    endDate: string | null;
    status: string;
    service: { title: string };
    provider: { profile: { displayName: string | null } | null };
};

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch("/api/bookings?type=artist", {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: "no-store",
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data.bookings ?? []);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="relative min-h-screen">
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
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard artiste</h1>
                        <p className="text-muted-foreground">Vos prochaines sessions et vos favoris.</p>
                    </div>
                    <Button asChild variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10">
                        <Link href="/provider/dashboard">Passer en mode Prestataire</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
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

                        <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Prochaines sessions
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {loading && <div className="text-sm text-muted-foreground">Chargement...</div>}
                                {!loading && bookings.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Aucune réservation pour le moment.</div>
                                )}
                                {bookings.slice(0, 4).map((booking) => {
                                    const start = new Date(booking.date);
                                    const end = booking.endDate ? new Date(booking.endDate) : null;
                                    const day = start.getDate().toString().padStart(2, "0");
                                    const month = start.toLocaleString("fr-FR", { month: "short" }).toUpperCase();
                                    return (
                                        <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-primary/20 flex flex-col items-center justify-center text-xs font-bold">
                                                    <span className="text-primary">{day}</span>
                                                    <span className="text-muted-foreground uppercase text-[10px]">{month}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{booking.service.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Avec {booking.provider.profile?.displayName ?? "Prestataire"} • {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        {end ? ` - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                                                Détails
                                            </Button>
                                        </div>
                                    );
                                })}
                                <div className="pt-2 text-center">
                                    <Button variant="link" className="text-primary">
                                        Voir tout le calendrier
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="font-semibold">Messages récents</h2>
                                <Link href="/messages" className="text-xs text-primary hover:underline">
                                    Voir tout
                                </Link>
                            </div>
                            <div className="p-4 space-y-2 text-sm text-muted-foreground">
                                Messagerie en cours d'activation.
                            </div>
                        </Card>

                        <div className="rounded-xl bg-gradient-to-br from-primary to-purple-600 p-6 text-primary-foreground shadow-2xl relative overflow-hidden group">
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

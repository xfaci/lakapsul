"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Euro, CalendarCheck, Eye, TrendingUp, Users, Activity, CalendarX, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Booking = {
    id: string;
    amount: number;
    status: string;
    artist: { profile: { displayName: string | null } | null };
    service: { title: string };
    date: string;
};

type Service = {
    id: string;
    title: string;
    price: number;
    duration: number;
};

export default function ProviderDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const [bookingsRes, servicesRes] = await Promise.all([
                    fetch("/api/bookings?type=provider", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }),
                    fetch("/api/services", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }),
                ]);
                if (bookingsRes.ok) {
                    const data = await bookingsRes.json();
                    setBookings(data.bookings ?? []);
                }
                if (servicesRes.ok) {
                    const data = await servicesRes.json();
                    setServices(data.services ?? []);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const revenue = useMemo(
        () => bookings.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED").reduce((sum, b) => sum + b.amount, 0),
        [bookings]
    );

    const chartData = useMemo(() => {
        const grouped: Record<string, number> = {};
        bookings.forEach((b) => {
            const day = new Date(b.date).toLocaleDateString("fr-FR", { weekday: "short" });
            grouped[day] = (grouped[day] ?? 0) + b.amount;
        });
        return Object.keys(grouped).map((k) => ({ name: k, value: grouped[k] }));
    }, [bookings]);

    return (
        <div className="space-y-8">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord prestataire</h1>
                        <p className="text-muted-foreground">Suivez vos réservations et vos offres.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                            <CalendarX className="mr-2 h-4 w-4" /> Bloquer une date
                        </Button>
                        <Button className="shadow-lg shadow-primary/20" asChild>
                            <Link href="/provider/services">
                                <Plus className="mr-2 h-4 w-4" /> Créer une offre
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Euro className="h-24 w-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-sm text-muted-foreground">Revenu confirmé</h3>
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{revenue.toFixed(2)}€</div>
                        <p className="text-xs text-green-500 font-medium">{bookings.length} réservations</p>
                    </Card>

                    <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CalendarCheck className="h-24 w-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-sm text-muted-foreground">Réservations</h3>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{bookings.length}</div>
                        <p className="text-xs text-blue-500 font-medium">En cours / confirmées</p>
                    </Card>

                    <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Eye className="h-24 w-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-sm text-muted-foreground">Offres publiées</h3>
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Activity className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{services.length}</div>
                        <p className="text-xs text-purple-500 font-medium">Services actifs</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-lg">Performance</h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.length ? chartData : [{ name: "Aucun", value: 0 }]}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px" }}
                                            itemStyle={{ color: "#fff" }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="oklch(var(--primary))"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10">
                            <h3 className="font-semibold text-lg mb-4">Dernières réservations</h3>
                            <div className="space-y-4">
                                {bookings.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Aucune réservation pour le moment.</div>
                                )}
                                {bookings.slice(0, 5).map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{booking.artist.profile?.displayName ?? "Client"}</p>
                                            <p className="text-xs text-muted-foreground">{booking.service.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">{booking.amount}€</p>
                                            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10">
                            <h3 className="font-semibold text-lg mb-4">Notifications</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                    Nouvelles demandes : {bookings.filter((b) => b.status === "PENDING").length}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    Réservations confirmées : {bookings.filter((b) => b.status === "CONFIRMED").length}
                                </div>
                            </div>
                        </Card>

                        <div className="rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Passez au niveau supérieur 🚀</h3>
                            <p className="text-sm opacity-90 mb-4 relative z-10">
                                Publiez vos services et obtenez vos premières réservations.
                            </p>
                            <Link
                                href="/provider/services"
                                className="inline-block w-full text-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-lg py-2 text-sm font-bold transition-colors relative z-10"
                            >
                                Ajouter un service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Star, CreditCard, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/user-store";

type Stats = {
    users: { total: number; artists: number; providers: number; admins: number; recentSignups: number };
    services: { active: number };
    bookings: { total: number; pending: number; completed: number };
    reviews: { total: number; avgRating: number };
    revenue: { total: number };
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated || user?.role !== "ADMIN") {
            router.push("/login");
            return;
        }

        async function fetchStats() {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("/api/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    setError("Accès non autorisé");
                    return;
                }
                const data = await res.json();
                setStats(data);
            } catch {
                setError("Erreur de chargement");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [_hasHydrated, isAuthenticated, user, router]);

    if (!_hasHydrated || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-destructive">{error}</p>
            </div>
        );
    }

    const statCards = [
        {
            title: "Utilisateurs",
            value: stats?.users.total || 0,
            subtitle: `+${stats?.users.recentSignups || 0} cette semaine`,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Prestataires",
            value: stats?.users.providers || 0,
            subtitle: `${stats?.services.active || 0} services actifs`,
            icon: Briefcase,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Réservations",
            value: stats?.bookings.total || 0,
            subtitle: `${stats?.bookings.pending || 0} en attente`,
            icon: Calendar,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            title: "Avis",
            value: stats?.reviews.total || 0,
            subtitle: `Note moyenne: ${stats?.reviews.avgRating.toFixed(1) || "0"}/5`,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
        },
        {
            title: "Revenu Total",
            value: `${stats?.revenue.total.toLocaleString() || 0}€`,
            subtitle: `${stats?.bookings.completed || 0} réservations terminées`,
            icon: CreditCard,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Artistes",
            value: stats?.users.artists || 0,
            subtitle: "Utilisateurs actifs",
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme La Kapsul</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="p-6 bg-card/30 backdrop-blur-lg border-white/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/30 backdrop-blur-lg border-white/10">
                <h2 className="font-semibold mb-4">Actions rapides</h2>
                <div className="flex flex-wrap gap-3">
                    <a href="/admin/users" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                        Gérer les utilisateurs
                    </a>
                    <a href="/admin/providers" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                        Vérifier les prestataires
                    </a>
                    <a href="/api/admin/seed?secret=lakapsul-seed-2024" target="_blank" className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm transition-colors">
                        Ajouter données test
                    </a>
                </div>
            </Card>
        </div>
    );
}

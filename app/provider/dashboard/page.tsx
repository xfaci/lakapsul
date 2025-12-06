"use client";

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

const data = [
    { name: "Lun", value: 400 },
    { name: "Mar", value: 300 },
    { name: "Mer", value: 550 },
    { name: "Jeu", value: 450 },
    { name: "Ven", value: 650 },
    { name: "Sam", value: 800 },
    { name: "Dim", value: 700 },
];

export default function ProviderDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Liquid Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            <div className="relative z-10 space-y-8">
                {/* Welcome & Quick Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Bonjour, StudioTrapKing 👋</h1>
                        <p className="text-muted-foreground">Voici ce qui se passe aujourd'hui.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                            <CalendarX className="mr-2 h-4 w-4" /> Bloquer une date
                        </Button>
                        <Button className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Créer une offre
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Euro className="h-24 w-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-sm text-muted-foreground">Revenu Mensuel</h3>
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">2,400.00€</div>
                        <p className="text-xs text-green-500 font-medium">+20.1% vs mois dernier</p>
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
                        <div className="text-3xl font-bold mb-1">25</div>
                        <p className="text-xs text-blue-500 font-medium">+12% vs mois dernier</p>
                    </Card>

                    <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Eye className="h-24 w-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-sm text-muted-foreground">Vues Profil</h3>
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Activity className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">950</div>
                        <p className="text-xs text-purple-500 font-medium">+18% vs mois dernier</p>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-lg">Performance</h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
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
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                                            JD
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">John Doe</p>
                                            <p className="text-xs text-muted-foreground">Session Enregistrement (2h)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">120.00€</p>
                                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                                            Payé
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                                            AL
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Alice L.</p>
                                            <p className="text-xs text-muted-foreground">Mixage Stereo</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">150.00€</p>
                                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                                            En attente
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Sidebar: Upcoming & Notifications */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10">
                            <h3 className="font-semibold text-lg mb-4">À venir</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 relative pl-4 border-l-2 border-primary">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Session Studio A</p>
                                        <p className="text-xs text-muted-foreground">Aujourd'hui, 14:00 - 16:00</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px]">
                                                JD
                                            </div>
                                            <span className="text-xs text-muted-foreground">John Doe</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative pl-4 border-l-2 border-purple-500">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Mixage Projet X</p>
                                        <p className="text-xs text-muted-foreground">Demain, 10:00</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px]">
                                                AL
                                            </div>
                                            <span className="text-xs text-muted-foreground">Alice L.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/10">
                            <h3 className="font-semibold text-lg mb-4">Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm">
                                            Nouveau message de <span className="font-medium text-foreground">TrapKevFR</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Il y a 2h</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm">
                                            Paiement reçu de <span className="font-medium text-foreground">John Doe</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Il y a 5h</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Passez au niveau supérieur 🚀</h3>
                            <p className="text-sm opacity-90 mb-4 relative z-10">
                                Obtenez plus de visibilité et de clients avec le Boost.
                            </p>
                            <Link
                                href="/provider/boost"
                                className="inline-block w-full text-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-lg py-2 text-sm font-bold transition-colors relative z-10"
                            >
                                Découvrir les offres
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

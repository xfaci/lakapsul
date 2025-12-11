"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Wallet, TrendingUp, Clock, CheckCircle, AlertCircle,
    Loader2, ExternalLink, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";

type Payout = {
    id: string;
    amount: number;
    commission: number;
    netAmount: number;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    scheduledAt: string;
    processedAt: string | null;
    booking: {
        service: { title: string };
        artist: { profile: { displayName: string | null } | null };
    };
};

type ConnectStatus = {
    connected: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted?: boolean;
};

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [stats, setStats] = useState({ pending: 0, completed: 0, total: 0 });
    const { isAuthenticated, _hasHydrated, user } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated || user?.role !== "PROVIDER") {
            router.push("/login");
            return;
        }

        loadData();
    }, [_hasHydrated, isAuthenticated, user, router]);

    async function loadData() {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            // Load Connect status
            const connectRes = await fetch("/api/stripe/connect", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (connectRes.ok) {
                const data = await connectRes.json();
                setConnectStatus(data);
            }

            // Load payouts
            const payoutsRes = await fetch("/api/bookings?type=provider&payouts=true", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (payoutsRes.ok) {
                const data = await payoutsRes.json();
                // Mock payouts for now since we need the payout API
                setPayouts([]);
            }

            // Calculate stats (mock for now)
            setStats({ pending: 0, completed: 0, total: 0 });
        } catch (err) {
            console.error("Error loading payouts:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleConnect() {
        setConnecting(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("/api/stripe/connect", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Connect error:", err);
        } finally {
            setConnecting(false);
        }
    }

    const getStatusBadge = (status: Payout["status"]) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">En attente</Badge>;
            case "PROCESSING":
                return <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">En cours</Badge>;
            case "COMPLETED":
                return <Badge variant="default" className="bg-green-500/20 text-green-500">Versé</Badge>;
            case "FAILED":
                return <Badge variant="destructive">Échoué</Badge>;
        }
    };

    if (!_hasHydrated || loading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
                <div className="h-64 w-full bg-muted/30 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-primary" />
                    Revenus
                </h1>
                <p className="text-muted-foreground">Gérez vos paiements et suivez vos revenus</p>
            </div>

            {/* Connect Status */}
            {!connectStatus?.payoutsEnabled && (
                <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Configurez vos paiements</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Connectez votre compte bancaire pour recevoir vos revenus sous 24h
                                    </p>
                                </div>
                            </div>
                            <Button onClick={handleConnect} disabled={connecting}>
                                {connecting ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                )}
                                Configurer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {connectStatus?.payoutsEnabled && (
                <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Compte bancaire connecté</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">En attente</p>
                                <p className="text-2xl font-bold">{stats.pending.toFixed(2)} €</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Versé ce mois</p>
                                <p className="text-2xl font-bold">{stats.completed.toFixed(2)} €</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total gagné</p>
                                <p className="text-2xl font-bold">{stats.total.toFixed(2)} €</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline info */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg">Délai de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">1</div>
                            <span className="text-sm">Réservation payée</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs font-bold">2</div>
                            <span className="text-sm">En attente (24h max)</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold">3</div>
                            <span className="text-sm">Versé sur votre compte</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payouts list */}
            <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle>Historique des paiements</CardTitle>
                </CardHeader>
                <CardContent>
                    {payouts.length === 0 ? (
                        <div className="text-center py-12">
                            <Wallet className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">Aucun paiement pour le moment</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Vos revenus apparaîtront ici après chaque réservation payée
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payouts.map((payout) => (
                                <div
                                    key={payout.id}
                                    className="flex items-center justify-between p-4 border border-white/10 rounded-lg"
                                >
                                    <div>
                                        <div className="font-medium">{payout.booking.service.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {payout.booking.artist.profile?.displayName || "Artiste"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary">+{payout.netAmount.toFixed(2)} €</div>
                                        <div className="text-xs text-muted-foreground">
                                            Commission: -{payout.commission.toFixed(2)} €
                                        </div>
                                    </div>
                                    <div>{getStatusBadge(payout.status)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

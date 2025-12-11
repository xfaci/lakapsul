"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2, Check, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { UserAvatar } from "@/components/ui/user-avatar";

type Booking = {
    id: string;
    date: string;
    endDate: string | null;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    artist: {
        profile: {
            displayName: string | null;
            avatarUrl: string | null;
        } | null;
    };
    service: {
        title: string;
        price: number;
    };
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        async function loadBookings() {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Session expirée");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/bookings?type=provider", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data.bookings ?? []);
                } else {
                    setError("Erreur de chargement");
                }
            } catch {
                setError("Erreur de connexion");
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, [_hasHydrated, isAuthenticated, router]);

    const getStatusBadge = (status: Booking["status"]) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">En attente</Badge>;
            case "CONFIRMED":
                return <Badge variant="default" className="bg-green-500/20 text-green-500">Confirmé</Badge>;
            case "CANCELLED":
                return <Badge variant="destructive">Annulé</Badge>;
            case "COMPLETED":
                return <Badge variant="outline">Terminé</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    async function updateBookingStatus(bookingId: string, status: "CONFIRMED" | "CANCELLED") {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`/api/bookings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId, status }),
            });

            if (res.ok) {
                setBookings(prev =>
                    prev.map(b => b.id === bookingId ? { ...b, status } : b)
                );
            }
        } catch (err) {
            console.error("Error updating booking:", err);
        }
    }

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
                    <Calendar className="h-8 w-8 text-primary" />
                    Réservations
                </h1>
                <p className="text-muted-foreground">Suivez vos demandes et sessions à venir.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <Card className="bg-card/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle>Toutes les réservations</CardTitle>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">Aucune réservation pour le moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => {
                                const date = new Date(booking.date);
                                const endDate = booking.endDate ? new Date(booking.endDate) : null;

                                return (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <UserAvatar
                                                name={booking.artist.profile?.displayName}
                                                src={booking.artist.profile?.avatarUrl}
                                                size="md"
                                            />
                                            <div className="flex flex-col gap-1">
                                                <div className="font-semibold">{booking.service.title}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span>Avec {booking.artist.profile?.displayName || "Artiste"}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {date.toLocaleDateString("fr-FR")} à {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                                        {endDate && ` - ${endDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-medium text-primary">
                                                    {booking.service.price} €
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {getStatusBadge(booking.status)}
                                            {booking.status === "PENDING" && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-500 hover:bg-green-500/10"
                                                        onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-500 hover:bg-red-500/10"
                                                        onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                            <Button variant="outline" size="sm">Détails</Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

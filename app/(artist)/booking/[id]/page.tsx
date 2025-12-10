"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, DollarSign, MapPin, Shield } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ServiceDetail = {
    id: string;
    providerId: string;
    title: string;
    description: string | null;
    price: number;
    duration: number;
    profile?: { userId: string; username: string | null; displayName: string | null };
};

export default function BookingPage({ params }: { params: { id: string } }) {
    const [service, setService] = useState<ServiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/services/${params.id}`, { cache: "no-store" });
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setService(data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params.id]);

    async function submitBooking() {
        setError(null);
        setSuccess(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Veuillez vous connecter pour réserver.");
            return;
        }

        if (!date) {
            setError("Choisissez une date/heure.");
            return;
        }

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ serviceId: params.id, date, notes }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Impossible de créer la réservation.");
            return;
        }
        setSuccess("Demande envoyée. Le prestataire va confirmer.");
        router.refresh();
    }

    if (!loading && !service) {
        notFound();
    }

    return (
        <div className="container py-10">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
                <Card className="bg-card/50 backdrop-blur">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Offre de service</p>
                                <CardTitle className="text-2xl mt-1">{service?.title ?? "Chargement..."}</CardTitle>
                                {service && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                        <MapPin className="h-4 w-4" />
                                        Prestataire : {service.profile?.displayName ?? service.profile?.username ?? "Inconnu"}
                                    </div>
                                )}
                            </div>
                            {service && (
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Tarif</p>
                                    <p className="text-3xl font-bold text-primary">{service.price}€</p>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <Clock className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Durée</p>
                                    <p className="font-medium">{service?.duration ?? 0} min</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <DollarSign className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Paiement sécurisé</p>
                                    <p className="font-medium">À venir</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <Shield className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Annulation</p>
                                    <p className="font-medium">48h avant la session</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {service?.description || "Aucune description fournie pour le moment."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit sticky top-24 bg-card/60 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Réserver ce service</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-md p-2">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-sm text-green-500 bg-green-500/10 border border-green-500/30 rounded-md p-2">
                                {success}
                            </div>
                        )}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Durée</p>
                                <p className="font-medium">{service?.duration ?? 0} minutes</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date souhaitée</label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                rows={3}
                                placeholder="Précisez vos attentes, références, matériel, etc."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" onClick={submitBooking} disabled={loading}>
                            Envoyer la demande
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

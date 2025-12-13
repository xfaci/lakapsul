"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Loader2, CheckCircle, ArrowLeft, CreditCard, Star } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ReviewForm } from "@/components/features/reviews/review-form";
import Link from "next/link";

type Service = {
    id: string;
    title: string;
    description: string | null;
    price: number;
    duration: number;
    type: string;
    profile: {
        userId: string;
        displayName: string | null;
        avatarUrl: string | null;
        location: string | null;
    };
};

export default function BookingPage() {
    const params = useParams();
    const serviceId = params.id as string;
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [showReview, setShowReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    // Form state
    const [date, setDate] = useState("");
    const [time, setTime] = useState("14:00");
    const [notes, setNotes] = useState("");

    const { isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        async function loadService() {
            try {
                const res = await fetch(`/api/services/${serviceId}`);
                if (res.ok) {
                    const data = await res.json();
                    setService(data.service);
                } else {
                    setError("Service non trouvé");
                }
            } catch (err) {
                console.error("Error loading service:", err);
                setError("Erreur de chargement");
            } finally {
                setLoading(false);
            }
        }

        loadService();
    }, [_hasHydrated, isAuthenticated, serviceId, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!date || !time || !service) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setSubmitting(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Session expirée");
            setSubmitting(false);
            return;
        }

        const bookingDate = new Date(`${date}T${time}`);
        const endDate = new Date(bookingDate.getTime() + service.duration * 60000);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    providerId: service.profile.userId,
                    date: bookingDate.toISOString(),
                    endDate: endDate.toISOString(),
                    amount: service.price,
                    notes: notes.trim() || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Erreur lors de la réservation");
                return;
            }

            const data = await res.json();
            setBookingId(data.booking?.id || null);
            setSuccess(true);
        } catch (err) {
            console.error("Error creating booking:", err);
            setError("Erreur de connexion");
        } finally {
            setSubmitting(false);
        }
    }

    if (!_hasHydrated || loading) {
        return (
            <div className="container max-w-2xl py-10">
                <div className="h-96 bg-muted/30 rounded-xl animate-pulse" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="container max-w-2xl py-20 space-y-6">
                <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-12 text-center">
                    <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Réservation confirmée !</h1>
                    <p className="text-muted-foreground mb-6">
                        Votre demande a été envoyée à {service?.profile.displayName}.<br />
                        Vous recevrez une notification dès confirmation.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">Retour au dashboard</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/messages">Mes messages</Link>
                        </Button>
                    </div>
                </Card>

                {/* Review Section */}
                {service && !reviewSubmitted && (
                    <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                        {!showReview ? (
                            <div className="text-center">
                                <Star className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Que pensez-vous de {service.profile.displayName} ?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Votre avis aide la communauté à choisir
                                </p>
                                <Button onClick={() => setShowReview(true)} variant="outline">
                                    Laisser un avis
                                </Button>
                            </div>
                        ) : (
                            <ReviewForm
                                targetId={service.profile.userId}
                                bookingId={bookingId || undefined}
                                onSuccess={() => setReviewSubmitted(true)}
                            />
                        )}
                    </Card>
                )}

                {reviewSubmitted && (
                    <Card className="bg-green-500/10 border-green-500/20 p-6 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-400">Merci pour votre avis !</p>
                    </Card>
                )}
            </div>
        );
    }

    if (!service) {
        return (
            <div className="container max-w-2xl py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
                <Button asChild>
                    <Link href="/search">Rechercher des services</Link>
                </Button>
            </div>
        );
    }

    // Get tomorrow's date as minimum
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="container relative z-10 max-w-2xl py-10 space-y-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href={`/provider/${service.profile.userId}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour au profil
                    </Link>
                </Button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Réserver</h1>
                        <p className="text-muted-foreground">{service.title}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={minDate}
                                            required
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Heure</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (optionnel)</Label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Informations supplémentaires pour le prestataire..."
                                        rows={4}
                                        className="bg-white/5 border-white/10 resize-none"
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <CreditCard className="h-4 w-4 mr-2" />
                                    )}
                                    Confirmer la réservation
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    Le paiement sera demandé après confirmation du prestataire
                                </p>
                            </form>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div>
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    src={service.profile.avatarUrl}
                                    name={service.profile.displayName}
                                    size="md"
                                />
                                <div>
                                    <div className="font-medium">{service.profile.displayName}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {service.profile.location}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div>
                                <h3 className="font-semibold">{service.title}</h3>
                                {service.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {service.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {service.duration} min
                                </span>
                            </div>

                            <hr className="border-white/10" />

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total</span>
                                <span className="text-2xl font-bold text-primary">{service.price} €</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

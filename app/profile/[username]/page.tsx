"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    MapPin, Star, Calendar, Clock, MessageSquare, Heart,
    Loader2, CheckCircle, Share2
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";

type Provider = {
    id: string;
    profile: {
        displayName: string | null;
        avatarUrl: string | null;
        coverUrl: string | null;
        bio: string | null;
        location: string | null;
        rating: number;
        reviewCount: number;
        skills: string[];
    } | null;
    services: {
        id: string;
        title: string;
        description: string | null;
        price: number;
        duration: number;
        type: string;
    }[];
};

type Review = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: {
        profile: {
            displayName: string | null;
            avatarUrl: string | null;
        } | null;
    };
};

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const [provider, setProvider] = useState<Provider | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const { user, isAuthenticated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        async function loadProfile() {
            try {
                // Fetch provider by username
                const res = await fetch(`/api/providers?search=${username}`);
                if (res.ok) {
                    const data = await res.json();
                    const found = data.providers?.find(
                        (p: Provider) => p.profile?.displayName?.toLowerCase().replace(/\s+/g, '_') === username.toLowerCase()
                    );
                    if (found) {
                        setProvider(found);
                        loadReviews(found.id);
                    }
                }
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoading(false);
            }
        }

        async function loadReviews(targetId: string) {
            try {
                const res = await fetch(`/api/reviews?targetId=${targetId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews || []);
                }
            } catch (err) {
                console.error("Error loading reviews:", err);
            }
        }

        loadProfile();
    }, [username]);

    async function toggleFavorite() {
        if (!isAuthenticated || !provider) {
            router.push("/login");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            if (isFavorite) {
                await fetch(`/api/favorites?providerId=${provider.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await fetch("/api/favorites", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ providerId: provider.id }),
                });
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    }

    async function submitReview() {
        if (!isAuthenticated || !provider) return;

        setSubmittingReview(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    targetId: provider.id,
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setReviews((prev) => [data.review, ...prev]);
                setShowReviewForm(false);
                setReviewComment("");
            }
        } catch (err) {
            console.error("Error submitting review:", err);
        } finally {
            setSubmittingReview(false);
        }
    }

    async function startConversation() {
        if (!isAuthenticated || !provider) {
            router.push("/login");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await fetch("/api/conversations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ participantId: provider.id }),
            });
            router.push("/messages");
        } catch (err) {
            console.error("Error starting conversation:", err);
        }
    }

    if (loading) {
        return (
            <div className="container max-w-4xl py-10">
                <div className="h-48 bg-muted/30 rounded-xl animate-pulse mb-6" />
                <div className="h-96 bg-muted/30 rounded-xl animate-pulse" />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="container max-w-4xl py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
                <Button asChild>
                    <Link href="/search">Rechercher des prestataires</Link>
                </Button>
            </div>
        );
    }

    const profile = provider.profile;

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="container relative z-10 max-w-4xl py-10 space-y-6">
                {/* Cover */}
                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-purple-500/30">
                    {profile?.coverUrl && (
                        <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Profile header */}
                <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 relative z-10 px-4">
                    <UserAvatar
                        src={profile?.avatarUrl}
                        name={profile?.displayName}
                        size="xl"
                        className="ring-4 ring-background h-32 w-32"
                    />
                    <div className="flex-1 pt-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">{profile?.displayName || "Prestataire"}</h1>
                                {profile?.location && (
                                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                                        <MapPin className="h-4 w-4" />
                                        {profile.location}
                                    </p>
                                )}
                                {(profile?.rating ?? 0) > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        <span className="font-semibold">{profile?.rating?.toFixed(1)}</span>
                                        <span className="text-muted-foreground">({profile?.reviewCount} avis)</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={toggleFavorite}>
                                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                                <Button onClick={startConversation}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contacter
                                </Button>
                            </div>
                        </div>

                        {profile?.skills && profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {profile.skills.filter(s => !s.startsWith("fav:")).map((skill) => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Bio & Services */}
                    <div className="md:col-span-2 space-y-6">
                        {profile?.bio && (
                            <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                                <h2 className="font-semibold mb-3">À propos</h2>
                                <p className="text-muted-foreground">{profile.bio}</p>
                            </Card>
                        )}

                        <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                            <h2 className="font-semibold mb-4">Services</h2>
                            <div className="space-y-3">
                                {provider.services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{service.title}</h3>
                                                {service.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {service.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {service.duration} min
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-primary">{service.price} €</div>
                                                <Button size="sm" className="mt-2" asChild>
                                                    <Link href={`/booking/${service.id}`}>
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        Réserver
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Reviews */}
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold">Avis ({reviews.length})</h2>
                                {isAuthenticated && user?.id !== provider.id && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                    >
                                        Laisser un avis
                                    </Button>
                                )}
                            </div>

                            {showReviewForm && (
                                <div className="mb-6 p-4 rounded-lg bg-white/5 space-y-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= reviewRating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <Textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Votre avis..."
                                        rows={3}
                                        className="bg-white/5 border-white/10"
                                    />
                                    <Button onClick={submitReview} disabled={submittingReview}>
                                        {submittingReview ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Publier
                                    </Button>
                                </div>
                            )}

                            {reviews.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">Aucun avis pour le moment</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-4 rounded-lg bg-white/5">
                                            <div className="flex items-start gap-3">
                                                <UserAvatar
                                                    src={review.author.profile?.avatarUrl}
                                                    name={review.author.profile?.displayName}
                                                    size="sm"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">
                                                            {review.author.profile?.displayName || "Utilisateur"}
                                                        </span>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-4 w-4 ${star <= review.rating
                                                                            ? "text-yellow-500 fill-yellow-500"
                                                                            : "text-muted-foreground"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {review.comment}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-1">
                                {provider.services.length > 0
                                    ? `${Math.min(...provider.services.map((s) => s.price))} €`
                                    : "N/A"}
                            </div>
                            <p className="text-sm text-muted-foreground">à partir de</p>
                            <Button className="w-full mt-4" asChild>
                                <Link href={`/booking/${provider.services[0]?.id || ""}`}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Réserver
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";

type Favorite = {
    id: string;
    userId: string;
    displayName: string | null;
    avatarUrl: string | null;
    location: string | null;
    rating: number;
    reviewCount: number;
    services: { id: string; title: string; price: number }[];
};

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const { isAuthenticated, _hasHydrated } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        async function loadFavorites() {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/favorites", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setFavorites(data.favorites || []);
                }
            } catch (err) {
                console.error("Error loading favorites:", err);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, [_hasHydrated, isAuthenticated, router]);

    async function removeFavorite(providerId: string) {
        setRemoving(providerId);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await fetch(`/api/favorites?providerId=${providerId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites((prev) => prev.filter((f) => f.userId !== providerId));
        } catch (err) {
            console.error("Error removing favorite:", err);
        } finally {
            setRemoving(null);
        }
    }

    if (!_hasHydrated || loading) {
        return (
            <div className="container max-w-4xl py-10">
                <div className="space-y-4">
                    <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-40 bg-muted/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="container relative z-10 max-w-4xl py-10 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mes Favoris</h1>
                        <p className="text-muted-foreground">
                            {favorites.length} prestataire{favorites.length !== 1 ? "s" : ""} sauvegardé{favorites.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <Card className="bg-card/30 backdrop-blur-lg border-white/10 p-12 text-center">
                        <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
                        <p className="text-muted-foreground mb-6">
                            Explorez les prestataires et ajoutez vos préférés ici
                        </p>
                        <Button asChild>
                            <Link href="/search">Trouver un prestataire</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {favorites.map((fav) => (
                            <Card
                                key={fav.id}
                                className="bg-card/30 backdrop-blur-lg border-white/10 p-5 hover:bg-card/50 transition-colors group"
                            >
                                <div className="flex gap-4">
                                    <UserAvatar
                                        src={fav.avatarUrl}
                                        name={fav.displayName}
                                        size="lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold truncate">
                                                    {fav.displayName || "Prestataire"}
                                                </h3>
                                                {fav.location && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {fav.location}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeFavorite(fav.userId)}
                                                disabled={removing === fav.userId}
                                            >
                                                {removing === fav.userId ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>

                                        {fav.rating > 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-medium">{fav.rating.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({fav.reviewCount} avis)
                                                </span>
                                            </div>
                                        )}

                                        {fav.services.length > 0 && (
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                {fav.services.map((s) => s.title).join(" • ")}
                                            </div>
                                        )}

                                        <div className="mt-3 flex gap-2">
                                            <Button size="sm" variant="outline" asChild className="flex-1">
                                                <Link href={`/provider/${fav.userId}`}>
                                                    <ExternalLink className="h-3 w-3 mr-1" />
                                                    Voir profil
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

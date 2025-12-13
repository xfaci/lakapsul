"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Share2, Star, Heart, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface ProviderHeaderProps {
    provider: {
        id: string;
        name: string;
        bio: string;
        avatarUrl?: string;
        rating: number;
        reviewCount: number;
        location: string;
        tags: string[];
        minPrice?: number;
        userId?: string;
    };
}

export function ProviderHeader({ provider }: ProviderHeaderProps) {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: `${provider.name} sur La Kapsul`,
            text: provider.bio || `Découvrez ${provider.name} sur La Kapsul`,
            url: url,
        };

        // Try native share first (mobile)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // User cancelled or error, fall back to copy
                if ((err as Error).name === 'AbortError') return;
            }
        }

        // Fall back to copy to clipboard
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Lien copié !");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Impossible de copier le lien");
        }
    };

    const handleContact = () => {
        // Check if logged in
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Connectez-vous pour contacter ce prestataire");
            router.push("/login");
            return;
        }

        // Navigate to messages with this provider
        router.push(`/messages?provider=${provider.id}`);
    };

    const handleFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Connectez-vous pour ajouter aux favoris");
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("/api/favorites", {
                method: isFavorite ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ profileId: provider.id }),
            });

            if (res.ok) {
                setIsFavorite(!isFavorite);
                toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris !");
            }
        } catch {
            toast.error("Erreur lors de la mise à jour des favoris");
        }
    };

    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/30 to-purple-600/30 w-full" />

            <div className="container relative -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                        <AvatarImage src={provider.avatarUrl} alt={provider.name} />
                        <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 pt-2 md:pt-20 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">{provider.name}</h1>
                                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {provider.location || "Non spécifié"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-medium text-foreground">{provider.rating.toFixed(1)}</span>
                                        <span>({provider.reviewCount} avis)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleFavorite}
                                    className={isFavorite ? "text-red-500" : "text-muted-foreground"}
                                >
                                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleShare}>
                                    {copied ? (
                                        <Check className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Share2 className="h-4 w-4 mr-2" />
                                    )}
                                    {copied ? "Copié !" : "Partager"}
                                </Button>
                                <Button size="sm" onClick={handleContact}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contacter
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {provider.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


"use client";

import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Review {
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
}

interface ReviewListProps {
    targetId: string;
    className?: string;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        size === "sm" ? "h-4 w-4" : "h-5 w-5",
                        star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30"
                    )}
                />
            ))}
        </div>
    );
}

export function ReviewList({ targetId, className }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch(`/api/reviews?targetId=${targetId}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.reviews || []);
                    setAvgRating(data.avgRating || 0);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, [targetId]);

    if (loading) {
        return (
            <div className={cn("animate-pulse space-y-4", className)}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-white/5 rounded-lg" />
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className={cn("text-center py-8", className)}>
                <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun avis pour le moment</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Soyez le premier à laisser un avis !
                </p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Summary */}
            <Card className="p-4 bg-card/30 backdrop-blur-lg border-white/10">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
                        <StarRating rating={Math.round(avgRating)} size="md" />
                    </div>
                    <div className="flex-1 border-l border-white/10 pl-4">
                        <p className="text-sm text-muted-foreground">
                            Basé sur <span className="font-medium text-foreground">{reviews.length}</span> avis
                        </p>
                    </div>
                </div>
            </Card>

            {/* Review List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="p-4 bg-card/30 backdrop-blur-lg border-white/10">
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={review.author.profile?.avatarUrl ?? undefined} />
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium truncate">
                                        {review.author.profile?.displayName || "Utilisateur"}
                                    </span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(review.createdAt), {
                                            addSuffix: true,
                                            locale: fr,
                                        })}
                                    </span>
                                </div>
                                <StarRating rating={review.rating} />
                                {review.comment && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export { StarRating };

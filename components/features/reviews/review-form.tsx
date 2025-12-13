"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    targetId: string;
    bookingId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ReviewForm({ targetId, bookingId, onSuccess, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Veuillez sélectionner une note");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    targetId,
                    bookingId,
                    rating,
                    comment: comment.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Une erreur est survenue");
                return;
            }

            onSuccess?.();
        } catch {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
                <label className="block text-sm font-medium mb-2">Votre note</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                        >
                            <Star
                                className={cn(
                                    "h-8 w-8 transition-colors",
                                    (hoverRating || rating) >= star
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-muted-foreground"
                                )}
                            />
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {rating === 1 && "Très insatisfait"}
                        {rating === 2 && "Insatisfait"}
                        {rating === 3 && "Correct"}
                        {rating === 4 && "Satisfait"}
                        {rating === 5 && "Excellent !"}
                    </p>
                )}
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Votre commentaire <span className="text-muted-foreground">(optionnel)</span>
                </label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec ce prestataire..."
                    className="min-h-[100px] bg-white/5 border-white/10"
                    maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                    {comment.length}/500
                </p>
            </div>

            {/* Error */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                        Annuler
                    </Button>
                )}
                <Button type="submit" disabled={loading || rating === 0}>
                    {loading ? "Envoi..." : "Publier l'avis"}
                </Button>
            </div>
        </form>
    );
}

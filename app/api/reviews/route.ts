import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as jose from "jose";

async function getUserFromToken(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.substring(7);
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
        const { payload } = await jose.jwtVerify(token, secret);
        return payload as { userId: string; email: string };
    } catch {
        return null;
    }
}

// GET - Get reviews for a user/provider
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const targetId = searchParams.get("targetId");

        if (!targetId) {
            return NextResponse.json({ error: "ID cible requis" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { targetId },
            include: {
                author: {
                    include: {
                        profile: { select: { displayName: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({ reviews, avgRating, count: reviews.length });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST - Create a review
export async function POST(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { targetId, bookingId, rating, comment } = await request.json();

        if (!targetId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        // Check if user already reviewed this target
        const existingReview = await prisma.review.findFirst({
            where: {
                authorId: user.userId,
                targetId,
            },
        });

        if (existingReview) {
            return NextResponse.json({ error: "Vous avez déjà laissé un avis" }, { status: 400 });
        }

        // If bookingId provided, verify it belongs to the user
        if (bookingId) {
            const booking = await prisma.booking.findFirst({
                where: {
                    id: bookingId,
                    artistId: user.userId,
                    status: "COMPLETED",
                },
            });

            if (!booking) {
                return NextResponse.json({ error: "Réservation invalide" }, { status: 400 });
            }
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                authorId: user.userId,
                targetId,
                bookingId,
                rating,
                comment: comment?.trim() || null,
            },
            include: {
                author: {
                    include: {
                        profile: { select: { displayName: true, avatarUrl: true } },
                    },
                },
            },
        });

        // Update target's average rating
        const allReviews = await prisma.review.findMany({
            where: { targetId },
            select: { rating: true },
        });

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await prisma.profile.update({
            where: { userId: targetId },
            data: {
                rating: avgRating,
                reviewCount: allReviews.length,
            },
        });

        // Create notification for target
        await prisma.notification.create({
            data: {
                userId: targetId,
                type: "NEW_REVIEW",
                title: "Nouvel avis",
                message: `Vous avez reçu un avis ${rating} étoiles`,
                data: { reviewId: review.id },
            },
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

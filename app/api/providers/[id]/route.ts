import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const profile = await prisma.profile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        role: true,
                        createdAt: true,
                    },
                },
                services: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
                media: { orderBy: { createdAt: "desc" }, take: 20 },
            },
        });

        if (!profile) {
            return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
        }

        const reviews = await prisma.review.findMany({
            where: { targetId: profile.userId },
            include: {
                author: { select: { profile: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return NextResponse.json({ ...profile, reviews });
    } catch (error) {
        console.error("Provider detail error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

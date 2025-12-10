import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const profile = await prisma.profile.findUnique({
            where: { id: params.id },
            include: {
                user: { select: { id: true, role: true, createdAt: true } },
                services: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
                media: { orderBy: { createdAt: "desc" }, take: 20 },
                receivedReviews: {
                    include: {
                        author: { select: { profile: true } },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
            },
        });

        if (!profile) {
            return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Provider detail error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

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

// GET - List user's favorites
export async function GET(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        // Get user's favorites from profile skills (temporary storage)
        // In production, create a separate Favorite model
        const profile = await prisma.profile.findUnique({
            where: { userId: user.userId },
            select: { skills: true },
        });

        // Parse favorites from skills (format: "fav:providerId")
        const favoriteIds = (profile?.skills || [])
            .filter((s: string) => s.startsWith("fav:"))
            .map((s: string) => s.replace("fav:", ""));

        // Get provider profiles
        const favorites = await prisma.profile.findMany({
            where: { userId: { in: favoriteIds } },
            include: {
                user: { select: { id: true, role: true } },
                services: { where: { isActive: true }, take: 3 },
            },
        });

        return NextResponse.json({ favorites });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST - Add a favorite
export async function POST(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { providerId } = await request.json();

        if (!providerId) {
            return NextResponse.json({ error: "ID prestataire requis" }, { status: 400 });
        }

        // Add to favorites using skills array
        await prisma.profile.update({
            where: { userId: user.userId },
            data: {
                skills: {
                    push: `fav:${providerId}`,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error adding favorite:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE - Remove a favorite
export async function DELETE(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const providerId = searchParams.get("providerId");

        if (!providerId) {
            return NextResponse.json({ error: "ID prestataire requis" }, { status: 400 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.userId },
            select: { skills: true },
        });

        const updatedSkills = (profile?.skills || []).filter(
            (s: string) => s !== `fav:${providerId}`
        );

        await prisma.profile.update({
            where: { userId: user.userId },
            data: { skills: updatedSkills },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing favorite:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

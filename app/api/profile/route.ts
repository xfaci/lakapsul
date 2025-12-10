import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

async function getUserFromToken(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    try {
        const token = authHeader.split(" ")[1];
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: string; role: string };
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.userId },
        });

        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const body = await request.json();
        const { displayName, bio, location, skills, avatarUrl, coverUrl } = body;

        const profile = await prisma.profile.upsert({
            where: { userId: user.userId },
            update: {
                displayName,
                bio,
                location,
                skills: Array.isArray(skills) ? skills : undefined,
                avatarUrl,
                coverUrl,
            },
            create: {
                userId: user.userId,
                username: `user_${user.userId.slice(0, 6)}`,
                displayName: displayName ?? "Nouveau profil",
                bio,
                location,
                skills: Array.isArray(skills) ? skills : [],
                avatarUrl,
                coverUrl,
            },
        });

        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

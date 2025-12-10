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

        const services = await prisma.service.findMany({
            where: { profile: { userId: user.userId } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ services });
    } catch (error) {
        console.error("List services error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, price, duration, type } = body;

        if (!title || !price || !duration || !type) {
            return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
        }

        const profile = await prisma.profile.findUnique({ where: { userId: user.userId } });
        if (!profile) {
            return NextResponse.json({ error: "Profil prestataire introuvable" }, { status: 400 });
        }

        const service = await prisma.service.create({
            data: {
                profileId: profile.id,
                title,
                description,
                price,
                duration,
                type,
                isActive: true,
            },
        });

        return NextResponse.json({ service }, { status: 201 });
    } catch (error) {
        console.error("Create service error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

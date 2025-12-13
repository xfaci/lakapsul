import { NextRequest, NextResponse } from "next/server";
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

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                profile: {
                    select: {
                        userId: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        location: true,
                    }
                },
            },
        });

        if (!service) {
            return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
        }

        return NextResponse.json({ service });
    } catch (error) {
        console.error("Service detail error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const body = await request.json();

        const existing = await prisma.service.findUnique({
            where: { id },
            include: { profile: { select: { userId: true } } },
        });

        if (!existing || existing.profile.userId !== user.userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const updated = await prisma.service.update({
            where: { id },
            data: {
                title: body.title ?? existing.title,
                description: body.description ?? existing.description,
                price: body.price ?? existing.price,
                duration: body.duration ?? existing.duration,
                type: body.type ?? existing.type,
                isActive: body.isActive ?? existing.isActive,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update service error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const existing = await prisma.service.findUnique({
            where: { id },
            include: { profile: { select: { userId: true } } },
        });

        if (!existing || existing.profile.userId !== user.userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        await prisma.service.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete service error:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

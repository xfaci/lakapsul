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

// GET - Get user's notifications
export async function GET(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: user.userId },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: user.userId,
                readAt: null,
            },
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT - Mark notifications as read
export async function PUT(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { notificationId, markAllRead } = await request.json();

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: {
                    userId: user.userId,
                    readAt: null,
                },
                data: { readAt: new Date() },
            });
        } else if (notificationId) {
            await prisma.notification.update({
                where: { id: notificationId },
                data: { readAt: new Date() },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

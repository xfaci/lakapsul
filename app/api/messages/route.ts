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

// GET - Get messages for a conversation
export async function GET(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json({ error: "ID conversation requis" }, { status: 400 });
        }

        // Verify user is part of conversation
        const participant = await prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId: user.userId,
            },
        });

        if (!participant) {
            return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    include: {
                        profile: { select: { displayName: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        // Mark messages as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: user.userId },
                readAt: null,
            },
            data: { readAt: new Date() },
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST - Send a message
export async function POST(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { conversationId, content } = await request.json();

        if (!conversationId || !content?.trim()) {
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        // Verify user is part of conversation
        const participant = await prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId: user.userId,
            },
        });

        if (!participant) {
            return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: user.userId,
                content: content.trim(),
            },
            include: {
                sender: {
                    include: {
                        profile: { select: { displayName: true, avatarUrl: true } },
                    },
                },
            },
        });

        // Update conversation lastMessageAt
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() },
        });

        return NextResponse.json({ message }, { status: 201 });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

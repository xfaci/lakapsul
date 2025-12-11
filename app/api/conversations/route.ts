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

// GET - List user's conversations
export async function GET(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { userId: user.userId },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            include: {
                                profile: {
                                    select: { displayName: true, avatarUrl: true },
                                },
                            },
                        },
                    },
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { lastMessageAt: "desc" },
        });

        // Format conversations
        const formattedConversations = conversations.map((conv) => {
            const otherParticipant = conv.participants.find(
                (p) => p.userId !== user.userId
            );
            return {
                id: conv.id,
                participant: {
                    id: otherParticipant?.userId,
                    displayName: otherParticipant?.user.profile?.displayName,
                    avatarUrl: otherParticipant?.user.profile?.avatarUrl,
                },
                lastMessage: conv.messages[0]?.content || "",
                lastMessageAt: conv.lastMessageAt || conv.createdAt,
                unread: conv.messages[0] && !conv.messages[0].readAt && conv.messages[0].senderId !== user.userId,
            };
        });

        return NextResponse.json({ conversations: formattedConversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST - Create or get existing conversation
export async function POST(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { participantId } = await request.json();

        if (!participantId) {
            return NextResponse.json({ error: "ID participant requis" }, { status: 400 });
        }

        // Check if conversation already exists
        const existingConv = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: user.userId } } },
                    { participants: { some: { userId: participantId } } },
                ],
            },
            include: {
                participants: {
                    include: {
                        user: {
                            include: {
                                profile: { select: { displayName: true, avatarUrl: true } },
                            },
                        },
                    },
                },
            },
        });

        if (existingConv) {
            return NextResponse.json({ conversation: existingConv });
        }

        // Create new conversation
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: user.userId },
                        { userId: participantId },
                    ],
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            include: {
                                profile: { select: { displayName: true, avatarUrl: true } },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ conversation: newConversation }, { status: 201 });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

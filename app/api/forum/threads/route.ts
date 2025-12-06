import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

async function getUserFromToken(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: string; role: string };
    } catch {
        return null;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where = categoryId ? { categoryId } : {};

        const threads = await prisma.forumThread.findMany({
            where,
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        profile: { select: { username: true, avatarUrl: true } },
                    },
                },
                _count: { select: { posts: true } },
            },
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
            take: limit,
            skip: offset,
        });

        const total = await prisma.forumThread.count({ where });

        return NextResponse.json({ threads, total });
    } catch (error) {
        console.error('Forum threads error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { categoryId, title, content } = body;

        if (!categoryId || !title || !content) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }

        const thread = await prisma.forumThread.create({
            data: {
                categoryId,
                authorId: user.userId,
                title,
                content,
            },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        profile: { select: { username: true, avatarUrl: true } },
                    },
                },
            },
        });

        return NextResponse.json({ success: true, thread }, { status: 201 });
    } catch (error) {
        console.error('Create thread error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

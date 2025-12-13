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

// GET - Get media for a profile
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');

        if (!profileId) {
            return NextResponse.json({ error: 'profileId requis' }, { status: 400 });
        }

        const media = await prisma.media.findMany({
            where: { profileId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ media });
    } catch (error) {
        console.error('Media error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Add new media
export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user || user.role !== 'PROVIDER') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
        }

        const body = await request.json();
        const { type, url, title, description, metadata } = body;

        if (!type || !url) {
            return NextResponse.json({ error: 'Type et URL requis' }, { status: 400 });
        }

        const media = await prisma.media.create({
            data: {
                profileId: profile.id,
                type,
                url,
                title: title || null,
                description: description || null,
                metadata: metadata || null,
            },
        });

        return NextResponse.json({ success: true, media }, { status: 201 });
    } catch (error) {
        console.error('Create media error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Remove media
export async function DELETE(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const mediaId = searchParams.get('id');

        if (!mediaId) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const media = await prisma.media.findUnique({
            where: { id: mediaId },
            include: { profile: { select: { userId: true } } },
        });

        if (!media || media.profile.userId !== user.userId) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        await prisma.media.delete({ where: { id: mediaId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete media error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

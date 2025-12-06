import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const profile = await prisma.profile.findFirst({
            where: {
                OR: [
                    { id },
                    { username: id },
                    { userId: id },
                ],
            },
            include: {
                user: {
                    select: { id: true, role: true, createdAt: true },
                },
                services: {
                    where: { isActive: true },
                },
                media: true,
            },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Prestataire non trouvé' }, { status: 404 });
        }

        // Get reviews
        const reviews = await prisma.review.findMany({
            where: { targetId: profile.userId },
            include: {
                author: {
                    select: {
                        id: true,
                        profile: {
                            select: { username: true, avatarUrl: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        return NextResponse.json({ ...profile, reviews });
    } catch (error) {
        console.error('Provider detail error:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}

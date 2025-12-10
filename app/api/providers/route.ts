import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const skills = searchParams.get('skills')?.split(',');
        const location = searchParams.get('location');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: Record<string, unknown> = {
            user: { role: 'PROVIDER' },
        };

        if (skills && skills.length > 0) {
            where.skills = { hasSome: skills };
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { displayName: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } },
            ];
        }

        const profiles = await prisma.profile.findMany({
            where,
            include: {
                user: {
                    select: { id: true, role: true },
                },
                services: {
                    where: { isActive: true },
                    take: 3,
                },
                media: { take: 3 },
            },
            take: limit,
            skip: offset,
            orderBy: { rating: 'desc' },
        });

        const total = await prisma.profile.count({ where });

        return NextResponse.json({ profiles, total });
    } catch (error) {
        console.error('Providers list error:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}

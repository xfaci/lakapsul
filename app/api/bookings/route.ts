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
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || (user.role === 'PROVIDER' ? 'provider' : 'artist');

        const where = type === 'provider'
            ? { providerId: user.userId }
            : { artistId: user.userId };

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                service: true,
                provider: {
                    select: {
                        id: true,
                        profile: {
                            select: { username: true, displayName: true, avatarUrl: true },
                        },
                    },
                },
                artist: {
                    select: {
                        id: true,
                        profile: {
                            select: { username: true, displayName: true, avatarUrl: true },
                        },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Bookings error:', error);
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
        const { serviceId, date, notes } = body;

        // Get service
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { profile: { include: { user: true } } },
        });

        if (!service) {
            return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 });
        }

        const startDate = new Date(date);
        const endDate = new Date(startDate.getTime() + service.duration * 60000);

        const booking = await prisma.booking.create({
            data: {
                artistId: user.userId,
                providerId: service.profile.userId,
                serviceId,
                date: startDate,
                endDate,
                amount: service.price,
                notes,
                status: 'PENDING',
            },
            include: {
                service: true,
                provider: {
                    select: {
                        id: true,
                        profile: { select: { username: true, displayName: true } },
                    },
                },
            },
        });

        return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

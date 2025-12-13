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

// GET - Get provider's availability
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');

        // If profileId provided, get public availability
        if (profileId) {
            const availability = await prisma.availability.findMany({
                where: { profileId, isActive: true },
                orderBy: { dayOfWeek: 'asc' },
            });
            return NextResponse.json({ availability });
        }

        // Otherwise get current user's availability
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
        }

        const availability = await prisma.availability.findMany({
            where: { profileId: profile.id },
            orderBy: { dayOfWeek: 'asc' },
        });

        return NextResponse.json({ availability });
    } catch (error) {
        console.error('Availability error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST/PUT - Set availability for a day
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
        const { slots } = body; // Array of { dayOfWeek, startTime, endTime, isActive }

        if (!slots || !Array.isArray(slots)) {
            return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
        }

        // Upsert each slot
        const results = await Promise.all(
            slots.map(async (slot: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }) => {
                return prisma.availability.upsert({
                    where: {
                        profileId_dayOfWeek: {
                            profileId: profile.id,
                            dayOfWeek: slot.dayOfWeek,
                        },
                    },
                    update: {
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isActive: slot.isActive,
                    },
                    create: {
                        profileId: profile.id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isActive: slot.isActive,
                    },
                });
            })
        );

        return NextResponse.json({ success: true, availability: results });
    } catch (error) {
        console.error('Set availability error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

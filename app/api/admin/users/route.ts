import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as jose from 'jose';

async function verifyAdmin(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.substring(7);
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
        const { payload } = await jose.jwtVerify(token, secret);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') return null;
        return payload as { userId: string };
    } catch {
        return null;
    }
}

// GET /api/admin/users - Get all users with pagination
export async function GET(request: Request) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const role = searchParams.get('role');
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};
        if (role && ['ARTIST', 'PROVIDER', 'ADMIN'].includes(role)) {
            where.role = role;
        }
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { profile: { displayName: { contains: search, mode: 'insensitive' } } },
                { profile: { username: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    profile: {
                        select: {
                            displayName: true,
                            username: true,
                            avatarUrl: true,
                            location: true,
                        }
                    },
                    _count: {
                        select: {
                            artistBookings: true,
                            providerBookings: true,
                            reviews: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Users error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE /api/admin/users - Delete a user
export async function DELETE(request: Request) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
        }

        // Prevent deleting self
        if (userId === admin.userId) {
            return NextResponse.json({ error: 'Impossible de supprimer votre propre compte' }, { status: 400 });
        }

        // Delete user (cascades to profile, etc.)
        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

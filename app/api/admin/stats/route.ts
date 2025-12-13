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

        // Check if user is admin
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

// GET /api/admin/stats - Get platform statistics
export async function GET(request: Request) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        // Get user counts by role
        const [totalUsers, artistCount, providerCount, adminCount] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'ARTIST' } }),
            prisma.user.count({ where: { role: 'PROVIDER' } }),
            prisma.user.count({ where: { role: 'ADMIN' } }),
        ]);

        // Get recent signups (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentSignups = await prisma.user.count({
            where: { createdAt: { gte: weekAgo } }
        });

        // Get active services count
        const activeServices = await prisma.service.count({
            where: { isActive: true }
        });

        // Get booking stats
        const [totalBookings, pendingBookings, completedBookings] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'PENDING' } }),
            prisma.booking.count({ where: { status: 'COMPLETED' } }),
        ]);

        // Get review stats
        const reviewStats = await prisma.review.aggregate({
            _count: true,
            _avg: { rating: true }
        });

        // Get total revenue
        const revenue = await prisma.booking.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        });

        return NextResponse.json({
            users: {
                total: totalUsers,
                artists: artistCount,
                providers: providerCount,
                admins: adminCount,
                recentSignups,
            },
            services: {
                active: activeServices,
            },
            bookings: {
                total: totalBookings,
                pending: pendingBookings,
                completed: completedBookings,
            },
            reviews: {
                total: reviewStats._count,
                avgRating: reviewStats._avg.rating || 0,
            },
            revenue: {
                total: revenue._sum.amount || 0,
            },
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

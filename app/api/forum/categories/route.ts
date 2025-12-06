import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.forumCategory.findMany({
            include: {
                _count: { select: { threads: true } },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Forum categories error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

// Seed categories (POST)
export async function POST() {
    try {
        const categories = [
            { name: 'Général', slug: 'general', description: 'Discussions générales' },
            { name: 'Matériel & Studio', slug: 'materiel', description: 'Parlons équipement!' },
            { name: 'Collaborations', slug: 'collabs', description: 'Trouvez des collaborateurs' },
            { name: 'Feedback', slug: 'feedback', description: 'Partagez vos créations' },
        ];

        for (const cat of categories) {
            await prisma.forumCategory.upsert({
                where: { slug: cat.slug },
                update: {},
                create: cat,
            });
        }

        return NextResponse.json({ success: true, message: 'Catégories créées' });
    } catch (error) {
        console.error('Seed categories error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

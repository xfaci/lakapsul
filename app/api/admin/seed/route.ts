import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole, ServiceType } from '@prisma/client';

// POST /api/admin/seed - Seed database with test data
// IMPORTANT: This should be protected or removed in production
export async function POST(request: Request) {
    // Check for secret key (simple protection)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.SEED_SECRET && secret !== 'lakapsul-seed-2024') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results: string[] = [];

        // Provider data
        const providers = [
            {
                email: 'studio.paris@lakapsul.com',
                password: 'Test123!',
                username: 'studio_melodie',
                displayName: 'Studio Mélodie Paris',
                bio: 'Studio d\'enregistrement professionnel au cœur de Paris. Équipement haut de gamme, cabine vocale isolée, et ingénieur son expérimenté.',
                location: 'Paris, France',
                skills: ['Enregistrement', 'Mixage', 'Mastering', 'Rap', 'Pop'],
                avatarUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
                services: [
                    { title: 'Session Studio 2h', description: 'Enregistrement vocal avec ingé son inclus', price: 80, duration: 120, type: ServiceType.RECORDING },
                    { title: 'Mixage Professionnel', description: 'Mix complet de votre titre (jusqu\'à 30 pistes)', price: 150, duration: 0, type: ServiceType.MIXING },
                    { title: 'Mastering', description: 'Mastering broadcast-ready pour streaming', price: 50, duration: 0, type: ServiceType.MASTERING },
                ],
            },
            {
                email: 'beatmaker.lyon@lakapsul.com',
                password: 'Test123!',
                username: 'kb_beats',
                displayName: 'KB Beats',
                bio: 'Beatmaker spécialisé Trap, Drill et Afrobeat. Plus de 500 productions à mon actif, collaborations avec des artistes signés.',
                location: 'Lyon, France',
                skills: ['Beatmaking', 'Trap', 'Drill', 'Afrobeat', 'Production'],
                avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
                services: [
                    { title: 'Beat Trap/Drill (Lease)', description: 'Licence d\'utilisation non-exclusive', price: 30, duration: 0, type: ServiceType.BEATMAKING },
                    { title: 'Beat Exclusif', description: 'Droits exclusifs + stems inclus', price: 200, duration: 0, type: ServiceType.BEATMAKING },
                    { title: 'Beat sur mesure', description: 'Production personnalisée selon vos références', price: 300, duration: 0, type: ServiceType.BEATMAKING },
                ],
            },
            {
                email: 'inge.marseille@lakapsul.com',
                password: 'Test123!',
                username: 'sophie_mix',
                displayName: 'Sophie Mix',
                bio: 'Ingénieure du son freelance avec 10 ans d\'expérience. Spécialiste mixage vocal et mastering pour artistes indépendants.',
                location: 'Marseille, France',
                skills: ['Mixage', 'Mastering', 'Vocal Tuning', 'Mix Vocal', 'RnB'],
                avatarUrl: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=400',
                services: [
                    { title: 'Mix Vocal Express', description: 'Mixage voix sur instru (24-48h)', price: 40, duration: 0, type: ServiceType.MIXING },
                    { title: 'Mix Complet', description: 'Mixage professionnel multi-pistes', price: 120, duration: 0, type: ServiceType.MIXING },
                    { title: 'Pack Mix + Master', description: 'Mix complet + mastering haute qualité', price: 150, duration: 0, type: ServiceType.MASTERING },
                    { title: 'Coaching Vocal', description: 'Session de coaching technique vocale (1h)', price: 60, duration: 60, type: ServiceType.VOCAL_COACHING },
                ],
            },
        ];

        // Create providers
        for (const providerData of providers) {
            const existingUser = await prisma.user.findUnique({
                where: { email: providerData.email },
            });

            if (existingUser) {
                results.push(`⏭️ Provider ${providerData.displayName} already exists`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(providerData.password, 12);

            const user = await prisma.user.create({
                data: {
                    email: providerData.email,
                    password: hashedPassword,
                    role: UserRole.PROVIDER,
                    profile: {
                        create: {
                            username: providerData.username,
                            displayName: providerData.displayName,
                            bio: providerData.bio,
                            location: providerData.location,
                            skills: providerData.skills,
                            avatarUrl: providerData.avatarUrl,
                            rating: 4.5 + Math.random() * 0.5,
                            reviewCount: Math.floor(Math.random() * 20) + 5,
                        },
                    },
                    subscription: {
                        create: {
                            plan: 'PRO',
                            status: 'ACTIVE',
                            commissionRate: 0.05,
                        },
                    },
                },
                include: { profile: true },
            });

            results.push(`✅ Created provider: ${providerData.displayName}`);

            for (const serviceData of providerData.services) {
                await prisma.service.create({
                    data: {
                        profileId: user.profile!.id,
                        title: serviceData.title,
                        description: serviceData.description,
                        price: serviceData.price,
                        duration: serviceData.duration,
                        type: serviceData.type,
                        isActive: true,
                    },
                });
                results.push(`  📦 Service: ${serviceData.title}`);
            }
        }

        // Create test artist
        const existingArtist = await prisma.user.findUnique({
            where: { email: 'artist.test@lakapsul.com' },
        });

        if (!existingArtist) {
            const artistPassword = await bcrypt.hash('Test123!', 12);
            await prisma.user.create({
                data: {
                    email: 'artist.test@lakapsul.com',
                    password: artistPassword,
                    role: UserRole.ARTIST,
                    profile: {
                        create: {
                            username: 'artist_test',
                            displayName: 'Artiste Test',
                            bio: 'Compte de test pour les artistes',
                            location: 'Paris, France',
                            skills: ['Rap', 'Chant'],
                        },
                    },
                    subscription: {
                        create: {
                            plan: 'FREE',
                            status: 'ACTIVE',
                            commissionRate: 0.10,
                        },
                    },
                },
            });
            results.push('✅ Created test artist');
        }

        // Create admin
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@lakapsul.com' },
        });

        if (!existingAdmin) {
            const adminPassword = await bcrypt.hash('Admin123!', 12);
            await prisma.user.create({
                data: {
                    email: 'admin@lakapsul.com',
                    password: adminPassword,
                    role: UserRole.ADMIN,
                    profile: {
                        create: {
                            username: 'admin',
                            displayName: 'Administrateur',
                            bio: 'Compte administrateur La Kapsul',
                        },
                    },
                },
            });
            results.push('✅ Created admin');
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            results,
            testAccounts: {
                providers: [
                    'studio.paris@lakapsul.com / Test123!',
                    'beatmaker.lyon@lakapsul.com / Test123!',
                    'inge.marseille@lakapsul.com / Test123!',
                ],
                artist: 'artist.test@lakapsul.com / Test123!',
                admin: 'admin@lakapsul.com / Admin123!',
            },
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
    }
}

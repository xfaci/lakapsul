import { PrismaClient, UserRole, ServiceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create 3 test providers
    const providers = [
        {
            email: 'studio.paris@lakapsul.com',
            password: 'Test123!',
            firstName: 'Jean',
            lastName: 'Dupont',
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
            firstName: 'Karim',
            lastName: 'Benali',
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
            firstName: 'Sophie',
            lastName: 'Martin',
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

    for (const providerData of providers) {
        console.log(`Creating provider: ${providerData.displayName}`);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: providerData.email },
        });

        if (existingUser) {
            console.log(`  ⏭️  Provider already exists, skipping...`);
            continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(providerData.password, 12);

        // Create user with profile
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
                        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
                        reviewCount: Math.floor(Math.random() * 20) + 5, // Random 5-25 reviews
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

        console.log(`  ✅ Created user: ${user.email}`);

        // Create services
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
            console.log(`    📦 Created service: ${serviceData.title}`);
        }
    }

    // Create a test artist account
    console.log('\nCreating test artist account...');

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
        console.log('  ✅ Created test artist: artist.test@lakapsul.com');
    }

    // Create a test admin account
    console.log('\nCreating test admin account...');

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
        console.log('  ✅ Created admin: admin@lakapsul.com');
    }

    console.log('\n🎉 Seeding completed!');
    console.log('\n📋 Test accounts:');
    console.log('   Providers: studio.paris@lakapsul.com / Test123!');
    console.log('              beatmaker.lyon@lakapsul.com / Test123!');
    console.log('              inge.marseille@lakapsul.com / Test123!');
    console.log('   Artist:    artist.test@lakapsul.com / Test123!');
    console.log('   Admin:     admin@lakapsul.com / Admin123!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

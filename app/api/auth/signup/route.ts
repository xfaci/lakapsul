import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, username, role = 'ARTIST' } = body;

        // Validate input
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: 'Email, mot de passe et nom d\'utilisateur requis' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        // Check if username is taken
        const existingProfile = await prisma.profile.findUnique({ where: { username } });
        if (existingProfile) {
            return NextResponse.json({ error: 'Ce nom d\'utilisateur est déjà pris' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with profile
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                profile: {
                    create: {
                        username,
                        displayName: username,
                    },
                },
            },
            include: { profile: true },
        });

        // Generate JWT
        const token = await new SignJWT({ userId: user.id, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}

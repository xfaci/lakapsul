import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '@/lib/email';

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

        // Create email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token: verificationToken,
                type: 'EMAIL_VERIFICATION',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Send verification email with the new professional template (non-blocking)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lakapsul.vercel.app';
        const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`;

        // Try to send email but don't fail signup if it fails
        try {
            const verificationTemplate = emailTemplates.emailVerification({
                name: username,
                verificationUrl: verifyUrl,
            });
            await sendEmail({
                to: email,
                subject: verificationTemplate.subject,
                html: verificationTemplate.html,
            });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Continue with signup even if email fails
        }

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
                emailVerified: false, // New users are not verified yet
                profile: user.profile,
            },
            token,
            message: 'Un email de vérification a été envoyé',
        });
    } catch (error) {
        console.error('Signup error:', error);
        // Return more specific error for debugging
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        return NextResponse.json({
            error: 'Erreur interne du serveur',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }, { status: 500 });
    }
}


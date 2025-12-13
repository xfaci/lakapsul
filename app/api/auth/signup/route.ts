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

        // Send welcome email with verification link
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lakapsul.vercel.app';
        const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`;

        const welcomeTemplate = emailTemplates.welcome(username);
        await sendEmail({
            to: email,
            subject: welcomeTemplate.subject,
            html: welcomeTemplate.html + `
                <div style="margin-top: 20px; padding: 20px; background: #F3F4F6; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0;"><strong>Vérifie ton email</strong></p>
                    <p style="margin: 0 0 15px 0;">Clique sur le bouton ci-dessous pour activer ton compte :</p>
                    <a href="${verifyUrl}" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                        Vérifier mon email
                    </a>
                </div>
            `,
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
            message: 'Un email de vérification a été envoyé',
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}


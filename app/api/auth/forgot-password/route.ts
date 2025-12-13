import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email requis' }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success for security (don't reveal if email exists)
        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Delete any existing password reset tokens for this user
        await prisma.verificationToken.deleteMany({
            where: {
                userId: user.id,
                type: 'PASSWORD_RESET',
            },
        });

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store token
        await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token,
                type: 'PASSWORD_RESET',
                expiresAt,
            },
        });

        // Send email
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lakapsul.vercel.app';
        const resetUrl = `${appUrl}/reset-password?token=${token}`;

        const template = emailTemplates.passwordReset(resetUrl);
        await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token requis' }, { status: 400 });
        }

        // Find token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
        }

        if (verificationToken.type !== 'EMAIL_VERIFICATION') {
            return NextResponse.json({ error: 'Type de token invalide' }, { status: 400 });
        }

        if (new Date() > verificationToken.expiresAt) {
            await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
            return NextResponse.json({ error: 'Token expiré' }, { status: 400 });
        }

        // Verify email
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: { emailVerified: new Date() },
        });

        // Delete used token
        await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

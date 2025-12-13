import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token et mot de passe requis' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
        }

        // Find token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
        }

        if (verificationToken.type !== 'PASSWORD_RESET') {
            return NextResponse.json({ error: 'Type de token invalide' }, { status: 400 });
        }

        if (new Date() > verificationToken.expiresAt) {
            // Delete expired token
            await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
            return NextResponse.json({ error: 'Token expiré' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: { password: hashedPassword },
        });

        // Delete used token
        await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

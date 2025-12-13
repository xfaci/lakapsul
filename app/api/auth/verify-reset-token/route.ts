import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ valid: false }, { status: 400 });
        }

        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json({ valid: false }, { status: 404 });
        }

        if (verificationToken.type !== 'PASSWORD_RESET') {
            return NextResponse.json({ valid: false }, { status: 400 });
        }

        if (new Date() > verificationToken.expiresAt) {
            return NextResponse.json({ valid: false, expired: true }, { status: 400 });
        }

        return NextResponse.json({ valid: true });
    } catch (error) {
        console.error('Verify reset token error:', error);
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}

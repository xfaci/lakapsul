import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as jose from "jose";
import crypto from "crypto";
import { sendEmail, emailTemplates } from "@/lib/email";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

async function getUserFromToken(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    try {
        const token = authHeader.split(" ")[1];
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        return payload as { userId: string };
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    const tokenData = await getUserFromToken(request);
    if (!tokenData) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: tokenData.userId },
            include: { profile: { select: { displayName: true, username: true } } },
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: "Email déjà vérifié" }, { status: 400 });
        }

        // Delete any existing verification tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { userId: user.id, type: "EMAIL_VERIFICATION" },
        });

        // Create new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token: verificationToken,
                type: "EMAIL_VERIFICATION",
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Send verification email
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lakapsul.vercel.app";
        const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`;

        const template = emailTemplates.emailVerification({
            name: user.profile?.displayName || user.profile?.username || "Utilisateur",
            verificationUrl: verifyUrl,
        });

        await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
        });

        return NextResponse.json({
            success: true,
            message: "Email de vérification envoyé"
        });
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import * as jose from "jose";

async function getUserFromToken(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.substring(7);
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
        const { payload } = await jose.jwtVerify(token, secret);
        return payload as { userId: string; email: string };
    } catch {
        return null;
    }
}

// POST - Create Stripe Connect onboarding link
export async function POST(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        // Check if user already has a Connect account
        let stripeAccount = await prisma.stripeAccount.findUnique({
            where: { userId: user.userId },
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        if (!stripeAccount) {
            // Create new Connect Express account
            const account = await getStripe().accounts.create({
                type: "express",
                country: "FR",
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                metadata: { userId: user.userId },
            });

            stripeAccount = await prisma.stripeAccount.create({
                data: {
                    userId: user.userId,
                    stripeAccountId: account.id,
                },
            });
        }

        // Create account onboarding link
        const accountLink = await getStripe().accountLinks.create({
            account: stripeAccount.stripeAccountId,
            refresh_url: `${baseUrl}/provider/payouts?refresh=true`,
            return_url: `${baseUrl}/provider/payouts?success=true`,
            type: "account_onboarding",
        });

        return NextResponse.json({ url: accountLink.url });
    } catch (error) {
        console.error("Connect error:", error);
        return NextResponse.json({ error: "Erreur Stripe Connect" }, { status: 500 });
    }
}

// GET - Get Connect account status
export async function GET(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const stripeAccount = await prisma.stripeAccount.findUnique({
            where: { userId: user.userId },
        });

        if (!stripeAccount) {
            return NextResponse.json({
                connected: false,
                chargesEnabled: false,
                payoutsEnabled: false,
            });
        }

        // Get fresh data from Stripe
        const account = await getStripe().accounts.retrieve(stripeAccount.stripeAccountId);

        // Update local record
        await prisma.stripeAccount.update({
            where: { id: stripeAccount.id },
            data: {
                chargesEnabled: account.charges_enabled,
                payoutsEnabled: account.payouts_enabled,
                detailsSubmitted: account.details_submitted || false,
            },
        });

        return NextResponse.json({
            connected: true,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
        });
    } catch (error) {
        console.error("Connect status error:", error);
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}

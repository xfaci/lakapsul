import { NextResponse } from "next/server";
import Stripe from "stripe";
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
        return payload as { userId: string; email: string; role: string };
    } catch {
        return null;
    }
}

// Subscription price mapping
const SUBSCRIPTION_PRICES = {
    ARTIST_MID: process.env.STRIPE_PRICE_ARTIST_MID || "price_artist_mid",
    ARTIST_PRO: process.env.STRIPE_PRICE_ARTIST_PRO || "price_artist_pro",
    PROVIDER_MID: process.env.STRIPE_PRICE_PROVIDER_MID || "price_provider_mid",
    PROVIDER_PRO: process.env.STRIPE_PRICE_PROVIDER_PRO || "price_provider_pro",
};

// Boost price mapping
const BOOST_PRICES = {
    STANDARD: process.env.STRIPE_PRICE_BOOST_STANDARD || "price_boost_standard",
    PREMIUM: process.env.STRIPE_PRICE_BOOST_PREMIUM || "price_boost_premium",
    MEGA: process.env.STRIPE_PRICE_BOOST_MEGA || "price_boost_mega",
};

export async function POST(request: Request) {
    const user = await getUserFromToken(request);
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { type, plan, bookingId } = await request.json();

        // Get or create Stripe customer
        let subscription = await prisma.subscription.findUnique({
            where: { userId: user.userId },
        });

        let customerId = subscription?.stripeCustomerId;

        if (!customerId) {
            const customer = await getStripe().customers.create({
                email: user.email,
                metadata: { userId: user.userId },
            });
            customerId = customer.id;
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // Handle different checkout types
        if (type === "subscription") {
            // Determine price ID based on role and plan
            let priceId: string;
            if (user.role === "PROVIDER") {
                priceId = plan === "PRO" ? SUBSCRIPTION_PRICES.PROVIDER_PRO : SUBSCRIPTION_PRICES.PROVIDER_MID;
            } else {
                priceId = plan === "PRO" ? SUBSCRIPTION_PRICES.ARTIST_PRO : SUBSCRIPTION_PRICES.ARTIST_MID;
            }

            const session = await getStripe().checkout.sessions.create({
                customer: customerId,
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [{ price: priceId, quantity: 1 }],
                success_url: `${baseUrl}/dashboard?checkout=success`,
                cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
                metadata: {
                    userId: user.userId,
                    type: "subscription",
                    plan,
                },
            });

            return NextResponse.json({ url: session.url });
        }

        if (type === "boost") {
            const priceId = BOOST_PRICES[plan as keyof typeof BOOST_PRICES];
            if (!priceId) {
                return NextResponse.json({ error: "Plan boost invalide" }, { status: 400 });
            }

            const session = await getStripe().checkout.sessions.create({
                customer: customerId,
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [{ price: priceId, quantity: 1 }],
                success_url: `${baseUrl}/provider/dashboard?boost=success`,
                cancel_url: `${baseUrl}/pricing?boost=cancelled`,
                metadata: {
                    userId: user.userId,
                    type: "boost",
                    boostType: plan,
                },
            });

            return NextResponse.json({ url: session.url });
        }

        if (type === "booking" && bookingId) {
            // Get booking details
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    service: true,
                    provider: {
                        include: { stripeAccount: true },
                    },
                },
            });

            if (!booking) {
                return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
            }

            // Get artist's subscription for commission rate
            const artistSub = await prisma.subscription.findUnique({
                where: { userId: user.userId },
            });
            const commissionRate = artistSub?.commissionRate || 0.10;
            const commission = Math.round(booking.amount * commissionRate * 100); // in cents
            const applicationFee = commission;

            // Create checkout with transfer to provider
            const sessionParams: Stripe.Checkout.SessionCreateParams = {
                customer: customerId,
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name: booking.service.title,
                                description: `Réservation le ${new Date(booking.date).toLocaleDateString("fr-FR")}`,
                            },
                            unit_amount: Math.round(booking.amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${baseUrl}/dashboard?booking=success&id=${bookingId}`,
                cancel_url: `${baseUrl}/booking/${booking.serviceId}?payment=cancelled`,
                metadata: {
                    userId: user.userId,
                    type: "booking",
                    bookingId,
                    providerId: booking.providerId,
                },
            };

            // If provider has Stripe Connect, add transfer
            if (booking.provider.stripeAccount?.stripeAccountId) {
                sessionParams.payment_intent_data = {
                    application_fee_amount: applicationFee,
                    transfer_data: {
                        destination: booking.provider.stripeAccount.stripeAccountId,
                    },
                };
            }

            const session = await getStripe().checkout.sessions.create(sessionParams);

            return NextResponse.json({ url: session.url });
        }

        return NextResponse.json({ error: "Type de checkout invalide" }, { status: 400 });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: "Erreur Stripe" }, { status: 500 });
    }
}

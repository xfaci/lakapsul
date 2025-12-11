import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Commission rates by plan
const COMMISSION_RATES = {
    FREE: 0.10,
    MID: 0.08,
    PRO: 0.05,
};

// Boost durations in hours
const BOOST_DURATIONS = {
    STANDARD: 24,
    PREMIUM: 24 * 7,
    MEGA: 24 * 30,
};

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};

                if (metadata.type === "subscription") {
                    // Handle subscription creation
                    const plan = metadata.plan as "MID" | "PRO";
                    const commissionRate = COMMISSION_RATES[plan];

                    await prisma.subscription.upsert({
                        where: { userId: metadata.userId },
                        update: {
                            plan,
                            status: "ACTIVE",
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: session.subscription as string,
                            commissionRate,
                        },
                        create: {
                            userId: metadata.userId,
                            plan,
                            status: "ACTIVE",
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: session.subscription as string,
                            commissionRate,
                        },
                    });

                    // Create notification
                    await prisma.notification.create({
                        data: {
                            userId: metadata.userId,
                            type: "PAYMENT_RECEIVED",
                            title: "Abonnement activé",
                            message: `Votre abonnement ${plan === "PRO" ? "Pro" : "+"} est maintenant actif !`,
                        },
                    });
                }

                if (metadata.type === "boost") {
                    const boostType = metadata.boostType as keyof typeof BOOST_DURATIONS;
                    const duration = BOOST_DURATIONS[boostType] || 24;
                    const expiresAt = new Date(Date.now() + duration * 60 * 60 * 1000);

                    await prisma.boost.create({
                        data: {
                            userId: metadata.userId,
                            type: boostType as "STANDARD" | "PREMIUM" | "MEGA",
                            expiresAt,
                            stripePaymentId: session.payment_intent as string,
                        },
                    });

                    await prisma.notification.create({
                        data: {
                            userId: metadata.userId,
                            type: "PAYMENT_RECEIVED",
                            title: "Boost activé",
                            message: `Votre boost ${boostType} est actif pour ${duration}h !`,
                        },
                    });
                }

                if (metadata.type === "booking" && metadata.bookingId) {
                    // Update booking with payment info
                    const booking = await prisma.booking.update({
                        where: { id: metadata.bookingId },
                        data: {
                            stripePaymentId: session.payment_intent as string,
                            status: "CONFIRMED",
                        },
                    });

                    // Get provider's subscription for commission rate
                    const providerSub = await prisma.subscription.findUnique({
                        where: { userId: metadata.providerId },
                    });
                    const commissionRate = providerSub?.commissionRate || 0.10;
                    const commission = booking.amount * commissionRate;
                    const netAmount = booking.amount - commission;

                    // Create payout record (scheduled for 24h from now)
                    await prisma.payout.create({
                        data: {
                            userId: metadata.providerId,
                            bookingId: metadata.bookingId,
                            amount: booking.amount,
                            commission,
                            netAmount,
                            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        },
                    });

                    // Notify provider
                    await prisma.notification.create({
                        data: {
                            userId: metadata.providerId,
                            type: "PAYMENT_RECEIVED",
                            title: "Paiement reçu",
                            message: `Vous avez reçu ${netAmount.toFixed(2)}€ (après commission). Virement sous 24h.`,
                        },
                    });

                    // Notify artist
                    await prisma.notification.create({
                        data: {
                            userId: metadata.userId,
                            type: "BOOKING_CONFIRMED",
                            title: "Réservation confirmée",
                            message: "Votre paiement a été accepté. Rendez-vous confirmé !",
                        },
                    });
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const sub = await prisma.subscription.findFirst({
                    where: { stripeSubscriptionId: subscription.id },
                });

                if (sub) {
                    // Get period from items
                    const item = subscription.items?.data?.[0];
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: {
                            status: subscription.status === "active" ? "ACTIVE" :
                                subscription.status === "past_due" ? "PAST_DUE" : "CANCELLED",
                            currentPeriodStart: item?.current_period_start
                                ? new Date(item.current_period_start * 1000)
                                : undefined,
                            currentPeriodEnd: item?.current_period_end
                                ? new Date(item.current_period_end * 1000)
                                : undefined,
                        },
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: "CANCELLED",
                        plan: "FREE",
                        commissionRate: 0.10,
                    },
                });
                break;
            }

            case "account.updated": {
                // Stripe Connect account update
                const account = event.data.object as Stripe.Account;
                await prisma.stripeAccount.updateMany({
                    where: { stripeAccountId: account.id },
                    data: {
                        chargesEnabled: account.charges_enabled,
                        payoutsEnabled: account.payouts_enabled,
                        detailsSubmitted: account.details_submitted || false,
                    },
                });
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}

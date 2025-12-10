'use server';

import prisma from "@/lib/prisma";

export type ProviderSummary = {
    id: string; // profile id
    userId: string;
    username: string;
    displayName: string;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    rating: number;
    reviewCount: number;
    tags: string[];
    minPrice: number | null;
};

export async function getProviders(): Promise<ProviderSummary[]> {
    const profiles = await prisma.profile.findMany({
        where: { user: { role: "PROVIDER" } },
        include: {
            user: { select: { id: true } },
            services: { where: { isActive: true }, select: { price: true } },
        },
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        take: 60,
    });

    return profiles.map((p) => {
        const minPrice = p.services.length
            ? Math.min(...p.services.map((s) => s.price))
            : null;
        return {
            id: p.id,
            userId: p.userId,
            username: p.username,
            displayName: p.displayName ?? p.username,
            bio: p.bio,
            location: p.location,
            avatarUrl: p.avatarUrl,
            rating: p.rating,
            reviewCount: p.reviewCount,
            tags: p.skills,
            minPrice,
        };
    });
}

export async function getProviderDetail(profileId: string) {
    const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: {
            user: { select: { id: true, role: true, createdAt: true } },
            services: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
            media: { orderBy: { createdAt: "desc" }, take: 20 },
            receivedReviews: {
                include: {
                    author: { select: { profile: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });

    return profile;
}

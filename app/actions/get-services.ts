'use server';

import prisma from "@/lib/prisma";
import { Service } from "@/types";
import { ServiceType } from "@prisma/client";

const serviceTypeToCategory: Record<ServiceType, Service["category"]> = {
    RECORDING: "STUDIO",
    MIXING: "MIXING",
    MASTERING: "MASTERING",
    BEATMAKING: "BEATMAKING",
    VOCAL_COACHING: "COACHING",
    OTHER: "STUDIO",
};

export async function getServices(providerId?: string): Promise<Service[]> {
    const services = await prisma.service.findMany({
        where: providerId ? { profile: { userId: providerId } } : undefined,
        include: {
            profile: {
                select: { userId: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return services.map((service) => ({
        id: service.id,
        providerId: service.profile?.userId ?? service.profileId,
        name: service.title,
        description: service.description ?? "",
        price: service.price,
        duration: service.duration,
        category: serviceTypeToCategory[service.type] ?? "STUDIO",
    }));
}

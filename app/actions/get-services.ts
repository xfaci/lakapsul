'use server';

import { createClient } from "@/lib/supabase-server";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { Service } from "@/types";

type ServiceRow = {
    id: string;
    provider_id: string;
    name: string;
    description: string | null;
    price: number | null;
    duration: number | null;
    category: Service["category"] | null;
    image_url: string | null;
};

const mapServiceRow = (row: ServiceRow): Service => ({
    id: row.id,
    providerId: row.provider_id,
    name: row.name,
    description: row.description ?? "",
    price: typeof row.price === "number" ? row.price / 100 : 0,
    duration: row.duration ?? 0,
    category: row.category ?? "STUDIO",
    imageUrl: row.image_url ?? undefined,
});

export async function getServices(providerId?: string): Promise<Service[]> {
    const supabase = await createClient();

    if (!supabase) {
        return providerId ? MOCK_SERVICES.filter((s) => s.providerId === providerId) : MOCK_SERVICES;
    }

    const query = supabase.from("services").select("*");

    if (providerId) {
        query.eq("provider_id", providerId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase services error:", error.message);
    }

    if (!data || data.length === 0) {
        return providerId ? MOCK_SERVICES.filter((s) => s.providerId === providerId) : MOCK_SERVICES;
    }

    return data.map(mapServiceRow);
}

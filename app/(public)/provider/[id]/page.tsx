import { getProviderDetail } from "@/app/actions/get-providers";
import { getServices } from "@/app/actions/get-services";
import { ProviderHeader } from "@/components/features/provider/provider-header";
import { ServiceList } from "@/components/features/provider/service-list";
import { ReviewList } from "@/components/features/reviews/review-list";
import { PortfolioGrid } from "@/components/features/provider/portfolio-grid";
import { CalendarView } from "@/components/features/provider/calendar-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";

interface ProviderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProviderPage({ params }: ProviderPageProps) {
    const { id } = await params;
    const provider = await getProviderDetail(id);

    if (!provider) {
        notFound();
    }

    const services = await getServices(provider.userId);

    return (
        <div className="min-h-screen pb-20">
            <ProviderHeader
                provider={{
                    id: provider.id,
                    name: provider.displayName ?? provider.username,
                    bio: provider.bio ?? "",
                    avatarUrl: provider.avatarUrl ?? undefined,
                    rating: provider.rating,
                    reviewCount: provider.reviewCount,
                    location: provider.location ?? "",
                    tags: provider.skills,
                    minPrice: services.length ? Math.min(...services.map((s) => s.price)) : 0,
                }}
            />

            <div className="container mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="services" className="w-full">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="services">Services</TabsTrigger>
                                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                                <TabsTrigger value="reviews">Avis ({provider.reviewCount})</TabsTrigger>
                                <TabsTrigger value="about">À propos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="services" className="mt-6">
                                <ServiceList services={services} />
                            </TabsContent>

                            <TabsContent value="portfolio" className="mt-6">
                                <PortfolioGrid profileId={provider.id} />
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <ReviewList targetId={provider.userId} />
                            </TabsContent>

                            <TabsContent value="about" className="mt-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p>{provider.bio ?? "Aucune description"}</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                            <CalendarView profileId={provider.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



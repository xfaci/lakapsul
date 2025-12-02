import { getServices } from "@/app/actions/get-services";
import { ProviderHeader } from "@/components/features/provider/provider-header";
import { ServiceList } from "@/components/features/provider/service-list";
import { MOCK_PROVIDERS } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";

interface ProviderPageProps {
    params: {
        id: string;
    };
}

export function generateStaticParams() {
    return MOCK_PROVIDERS.map((provider) => ({
        id: provider.id,
    }));
}

export default async function ProviderPage({ params }: ProviderPageProps) {
    const provider = MOCK_PROVIDERS.find((p) => p.id === params.id);

    if (!provider) {
        notFound();
    }

    const services = await getServices(provider.id);

    return (
        <div className="min-h-screen pb-20">
            <ProviderHeader provider={provider} />

            <div className="container mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
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
                                <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                                    Portfolio à venir...
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                                    Liste des avis à venir...
                                </div>
                            </TabsContent>

                            <TabsContent value="about" className="mt-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p>{provider.bio}</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar (Availability / Quick Info) */}
                    <div className="space-y-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                            <h3 className="font-semibold mb-4">Horaires d&apos;ouverture</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Lundi - Vendredi</span>
                                    <span>10:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Samedi</span>
                                    <span>14:00 - 20:00</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Dimanche</span>
                                    <span>Fermé</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

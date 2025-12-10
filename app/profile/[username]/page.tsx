import { getProviderDetail } from "@/app/actions/get-providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Share2, MessageSquare, Music2, Image as ImageIcon, Eye } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: { username: string } }) {
    const provider = await getProviderDetail(params.username);

    if (!provider) {
        return (
            <div className="container py-20 text-center text-muted-foreground">
                Prestataire introuvable.
            </div>
        );
    }

    const services = provider.services;
    const reviews = provider.reviews ?? [];
    const gallery = provider.media.filter((m) => m.type === "IMAGE");

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="h-64 md:h-80 w-full bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="relative">
                            <div className="h-40 w-40 rounded-full border-4 border-background bg-card shadow-xl overflow-hidden relative">
                                {provider.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={provider.avatarUrl} alt={provider.username} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                                        {provider.displayName?.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-background"></div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold">{provider.displayName ?? provider.username}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{provider.location ?? "Localisation non renseignée"}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {provider.skills.length === 0 && (
                                    <Badge variant="secondary">Aucune compétence renseignée</Badge>
                                )}
                                {provider.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="font-bold text-foreground">{provider.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground text-sm">({provider.reviewCount} avis)</span>
                            </div>

                            <div className="flex gap-3">
                                {services.length > 0 ? (
                                    <Button asChild className="flex-1">
                                        <Link href={`/booking/${services[0].id}`}>Réserver</Link>
                                    </Button>
                                ) : (
                                    <Button className="flex-1" variant="outline" disabled>
                                        Aucune offre pour le moment
                                    </Button>
                                )}
                                <Button variant="outline" size="icon">
                                    <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <Card className="p-4 bg-card/50 backdrop-blur-sm">
                                <h3 className="font-semibold mb-2">À propos</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {provider.bio ?? "Aucune description renseignée pour le moment."}
                                </p>
                            </Card>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 pt-12 md:pt-32">
                        <Tabs defaultValue="services" className="w-full">
                            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-8">
                                <TabsTrigger
                                    value="services"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    Services
                                </TabsTrigger>
                                <TabsTrigger
                                    value="portfolio"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    Portfolio
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    Avis
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="services">
                                {services.length === 0 && (
                                    <Card className="p-6">
                                        <div className="text-muted-foreground text-sm">Aucun service publié pour le moment.</div>
                                    </Card>
                                )}
                                <div className="grid gap-4">
                                    {services.map((service) => (
                                        <Card key={service.id} className="p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">{service.title}</h3>
                                                <p className="text-muted-foreground text-sm">{service.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Durée : {service.duration} min</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl text-primary">{service.price.toFixed(2)}€</div>
                                                <Button size="sm" className="mt-2" asChild>
                                                    <Link href={`/booking/${service.id}`}>Réserver</Link>
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="portfolio" className="space-y-8">
                                <section>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-primary" />
                                        Galerie
                                    </h3>
                                    {gallery.length === 0 && (
                                        <div className="text-sm text-muted-foreground">Pas encore d'images publiées.</div>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {gallery.map((media) => (
                                            <div key={media.id} className="aspect-square rounded-xl bg-muted overflow-hidden relative group cursor-pointer">
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="h-6 w-6 text-white" />
                                                </div>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={media.url} alt={media.title ?? "media"} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </TabsContent>

                            <TabsContent value="reviews">
                                <div className="space-y-6">
                                    {reviews.length === 0 && (
                                        <div className="text-sm text-muted-foreground">Pas encore d'avis.</div>
                                    )}
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                                                    {review.author.profile?.displayName?.slice(0, 2).toUpperCase() ?? "U"}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{review.author.profile?.displayName ?? "Utilisateur"}</h4>
                                                    <div className="flex text-yellow-500">
                                                        {Array.from({ length: review.rating }).map((_, idx) => (
                                                            <Star key={idx} className="h-3 w-3 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {review.comment ?? "Pas de commentaire."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

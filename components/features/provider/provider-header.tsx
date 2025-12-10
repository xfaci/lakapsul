import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Share2, Star } from "lucide-react";

interface ProviderHeaderProps {
    provider: {
        id: string;
        name: string;
        bio: string;
        avatarUrl?: string;
        rating: number;
        reviewCount: number;
        location: string;
        tags: string[];
        minPrice?: number;
    };
}

export function ProviderHeader({ provider }: ProviderHeaderProps) {
    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/30 to-purple-600/30 w-full" />

            <div className="container relative -mt-16 md:-mt-20">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                        <AvatarImage src={provider.avatarUrl} alt={provider.name} />
                        <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 pt-2 md:pt-20 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">{provider.name}</h1>
                                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {provider.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-medium text-foreground">{provider.rating}</span>
                                        <span>({provider.reviewCount} avis)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Partager
                                </Button>
                                <Button size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contacter
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {provider.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

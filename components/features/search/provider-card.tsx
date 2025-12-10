import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProviderSummary } from "@/app/actions/get-providers";

interface ProviderCardProps {
    provider: ProviderSummary;
}

export function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-500/20" />
            </CardHeader>
            <CardContent className="p-6 pt-0 -mt-12">
                <div className="flex justify-between items-start">
                    <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage src={provider.avatarUrl ?? undefined} alt={provider.displayName} />
                        <AvatarFallback>{provider.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center bg-background/80 backdrop-blur px-2 py-1 rounded-full text-sm font-medium shadow-sm mt-14">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        {provider.rating} <span className="text-muted-foreground ml-1">({provider.reviewCount})</span>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-bold text-lg">{provider.displayName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {provider.location}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {provider.bio}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {provider.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex items-center justify-between">
                {provider.minPrice !== null ? (
                    <div>
                        <span className="text-xs text-muted-foreground">À partir de</span>
                        <div className="font-bold text-lg">{provider.minPrice}€</div>
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground">Aucune offre publiée</div>
                )}
                <Button asChild>
                    <Link href={`/provider/${provider.id}`}>Voir le profil</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

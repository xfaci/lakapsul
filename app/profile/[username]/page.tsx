"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Share2, MessageSquare, Play, Pause, Heart, Music2, Image as ImageIcon, Eye } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function ProfilePage({ params }: { params: { username: string } }) {
    const [isPlaying, setIsPlaying] = useState<number | null>(null);

    const tracks = [
        { id: 1, title: "Summer Vibe (Mix)", duration: "3:45", plays: "1.2k" },
        { id: 2, title: "Trap Beat 2024", duration: "2:30", plays: "850" },
        { id: 3, title: "Vocals Demo", duration: "1:15", plays: "2.1k" },
    ];

    const gallery = [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Cover Image */}
            <div className="h-64 md:h-80 w-full bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Profile Info */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="relative">
                            <div className="h-40 w-40 rounded-full border-4 border-background bg-card shadow-xl overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                                    ST
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-background"></div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold">{decodeURIComponent(params.username)}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Paris, France</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Ingénieur Son</Badge>
                                <Badge variant="secondary">Beatmaker</Badge>
                                <Badge variant="secondary">Studio</Badge>
                            </div>

                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="font-bold text-foreground">4.9</span>
                                <span className="text-muted-foreground text-sm">(124 avis)</span>
                            </div>

                            <div className="flex gap-3">
                                <Button className="flex-1">Réserver</Button>
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
                                    Passionné par le son depuis 10 ans. J'ai travaillé avec les plus grands artistes de la scène urbaine.
                                    Mon studio est équipé du meilleur matériel pour garantir une qualité professionnelle à vos projets.
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="w-full md:w-2/3 pt-12 md:pt-32">
                        <Tabs defaultValue="portfolio" className="w-full">
                            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-8">
                                <TabsTrigger
                                    value="portfolio"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    Portfolio
                                </TabsTrigger>
                                <TabsTrigger
                                    value="services"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    Services
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    Avis
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="portfolio" className="space-y-8">
                                {/* Audio Player Section */}
                                <section>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Music2 className="h-5 w-5 text-primary" />
                                        Démos Audio
                                    </h3>
                                    <div className="space-y-3">
                                        {tracks.map((track) => (
                                            <div
                                                key={track.id}
                                                className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors border border-border/50 group"
                                            >
                                                <button
                                                    onClick={() => setIsPlaying(isPlaying === track.id ? null : track.id)}
                                                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                                >
                                                    {isPlaying === track.id ? (
                                                        <Pause className="h-4 w-4" />
                                                    ) : (
                                                        <Play className="h-4 w-4 ml-0.5" />
                                                    )}
                                                </button>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{track.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{track.duration}</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Play className="h-3 w-3" />
                                                        {track.plays}
                                                    </div>
                                                    <button className="hover:text-primary transition-colors">
                                                        <Heart className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Image Gallery */}
                                <section>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-primary" />
                                        Galerie
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {gallery.map((src, i) => (
                                            <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden relative group cursor-pointer">
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="h-6 w-6 text-white" />
                                                </div>
                                                {/* Note: Using div placeholder for demo since we don't have real images */}
                                                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground">
                                                    Image {i + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </TabsContent>

                            <TabsContent value="services">
                                <div className="grid gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">Enregistrement Studio</h3>
                                                <p className="text-muted-foreground text-sm">Session de 2h avec ingénieur son</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl text-primary">80€</div>
                                                <Button size="sm" className="mt-2">Réserver</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews">
                                <div className="space-y-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="border-b border-border/50 pb-6 last:border-0">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                                                    JD
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">John Doe</h4>
                                                    <div className="flex text-yellow-500">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} className="h-3 w-3 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-xs text-muted-foreground">Il y a 2 jours</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Super session ! L'ambiance est top et le matériel de qualité. Je recommande vivement.
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

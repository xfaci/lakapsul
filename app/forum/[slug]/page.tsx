"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Share2, Flag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ThreadPage({ params }: { params: { slug: string } }) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
                <Link href="/forum">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour au forum
                </Link>
            </Button>

            {/* Original Post */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Badge>Matériel & Studio</Badge>
                    <span className="text-sm text-muted-foreground">Il y a 2 heures</span>
                </div>
                <h1 className="text-3xl font-bold">Quel micro pour commencer le rap ?</h1>

                <Card className="p-6">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src="/api/placeholder/40" />
                            <AvatarFallback>YR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">YoungRookie</h3>
                                <Button variant="ghost" size="icon">
                                    <Flag className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p>
                                    Salut l'équipe ! Je débute dans le rap et je cherche un bon micro pour enregistrer mes maquettes à la maison.
                                    J'ai un budget d'environ 200€. Vous me conseillez quoi ? J'ai entendu parler du Rode NT1-A, c'est bien ?
                                </p>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                    <ThumbsUp className="mr-2 h-4 w-4" /> 12
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Répondre
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                    <Share2 className="mr-2 h-4 w-4" /> Partager
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Replies */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Réponses (3)</h3>

                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 bg-muted/30">
                        <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarFallback>P{i}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">ProProducer_{i}</h4>
                                        <span className="text-xs text-muted-foreground">Il y a 1h</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Le NT1-A est une valeur sûre, mais regarde aussi du côté de chez Audio-Technica avec le AT2020, c'est moins cher et très propre pour commencer.
                                </p>
                                <div className="flex items-center gap-2 pt-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                                        <ThumbsUp className="mr-1 h-3 w-3" /> Utile
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                                        Répondre
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Reply Box */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4">Votre réponse</h3>
                <Textarea placeholder="Participez à la discussion..." className="min-h-[100px] mb-4" />
                <div className="flex justify-end">
                    <Button>Publier la réponse</Button>
                </div>
            </Card>
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container py-24">
            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Contactez-nous</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Une question ? Un projet ? Notre équipe est là pour vous écouter.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-muted-foreground">support@lakapsul.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Téléphone</h3>
                                <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Adresse</h3>
                                <p className="text-muted-foreground">123 Avenue de la Musique, Paris</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-8 shadow-sm">
                    <form className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" placeholder="Votre prénom" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" placeholder="Votre nom" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="votre@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Comment pouvons-nous vous aider ?" className="min-h-[150px]" />
                        </div>
                        <Button size="lg" className="w-full">Envoyer le message</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

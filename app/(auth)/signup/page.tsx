"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Loader2, Mic2, Music2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<"artist" | "provider">("artist");

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Créer un compte
                </h1>
                <p className="text-sm text-muted-foreground">
                    Rejoignez la communauté La Kapsul dès aujourd&apos;hui
                </p>
            </div>
            <div className="grid gap-6 bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all ${role === "artist" ? "border-primary bg-accent" : "border-muted"
                            }`}
                        onClick={() => setRole("artist")}
                    >
                        <Music2 className="mb-2 h-6 w-6" />
                        <div className="font-semibold">Artiste</div>
                        <div className="text-xs text-muted-foreground">
                            Je cherche des services
                        </div>
                    </div>
                    <div
                        className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all ${role === "provider" ? "border-primary bg-accent" : "border-muted"
                            }`}
                        onClick={() => setRole("provider")}
                    >
                        <Mic2 className="mb-2 h-6 w-6" />
                        <div className="font-semibold">Prestataire</div>
                        <div className="text-xs text-muted-foreground">
                            Je propose des services
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" placeholder="John" required disabled={isLoading} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" placeholder="Doe" required disabled={isLoading} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="nom@exemple.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                disabled={isLoading}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Créer mon compte
                        </Button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Ou s&apos;inscrire avec
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" type="button" disabled={isLoading} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                        <Icons.google className="h-5 w-5" />
                        <span className="sr-only">Google</span>
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading} className="bg-[#ff5500]/10 text-[#ff5500] border-[#ff5500]/20 hover:bg-[#ff5500]/20 hover:text-[#ff5500]">
                        <Icons.soundcloud className="h-8 w-8" />
                        <span className="sr-only">SoundCloud</span>
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                        <Icons.apple className="h-5 w-5" />
                        <span className="sr-only">Apple</span>
                    </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </>
    );
}

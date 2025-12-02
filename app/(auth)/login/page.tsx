"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

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
                    Bon retour parmi nous
                </h1>
                <p className="text-sm text-muted-foreground">
                    Entrez votre email pour vous connecter à votre compte
                </p>
            </div>
            <div className="grid gap-6 bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Se connecter
                        </Button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Ou continuer avec
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
                    Pas encore de compte ?{" "}
                    <Link
                        href="/signup"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        S'inscrire
                    </Link>
                </p>
            </div>
        </>
    );
}

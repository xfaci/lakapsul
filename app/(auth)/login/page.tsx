"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { supabase } from "@/lib/supabase-browser";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const login = useUserStore((state) => state.login);

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Une erreur est survenue");
                setIsLoading(false);
                return;
            }

            // Store JWT token
            localStorage.setItem("token", data.token);

            // Update user store
            login({
                id: data.user.id,
                email: data.user.email,
                name: data.user.profile?.displayName || data.user.email,
                role: data.user.role,
            });

            // Redirect based on role
            if (data.user.role === "PROVIDER") {
                router.push("/provider/dashboard");
            } else if (data.user.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Erreur de connexion au serveur");
            setIsLoading(false);
        }
    }

    async function handleOAuthLogin(provider: 'google' | 'discord') {
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
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
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleOAuthLogin('google')} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                        <Icons.google className="h-5 w-5" />
                        <span className="sr-only">Google</span>
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleOAuthLogin('discord')} className="bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/20 hover:text-[#5865F2]">
                        <Icons.discord className="h-5 w-5" />
                        <span className="sr-only">Discord</span>
                    </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Link
                        href="/signup"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        S&apos;inscrire
                    </Link>
                </p>
            </div>
        </>
    );
}

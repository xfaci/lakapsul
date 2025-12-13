"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Loader2, Mic2, Music2, Check, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { hasSupabaseConfig, supabase } from "@/lib/supabase-browser";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [role, setRole] = useState<"ARTIST" | "PROVIDER">("ARTIST");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const login = useUserStore((state) => state.login);
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Password validation
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };
    const isPasswordValid = Object.values(passwordChecks).every(Boolean);
    const doPasswordsMatch = password === confirmPassword && password.length > 0;

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();

        // Validation
        if (!firstName.trim() || !lastName.trim()) {
            setError("Prénom et nom requis");
            return;
        }
        if (!isPasswordValid) {
            setError("Le mot de passe ne respecte pas les critères de sécurité");
            return;
        }
        if (!doPasswordsMatch) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Get reCAPTCHA token if available
        let recaptchaToken = null;
        if (executeRecaptcha) {
            try {
                recaptchaToken = await executeRecaptcha('signup');
            } catch (err) {
                console.warn('reCAPTCHA failed:', err);
            }
        }

        // Create username from first and last name
        const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`.replace(/\s+/g, '_');

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    role,
                    firstName,
                    lastName,
                    recaptchaToken,
                }),
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
                name: data.user.profile?.displayName || `${firstName} ${lastName}`,
                role: data.user.role,
                emailVerified: data.user.emailVerified,
            });

            setSuccess(true);

            // Redirect to onboarding after a short delay
            setTimeout(() => {
                router.push("/onboarding");
            }, 1500);
        } catch {
            setError("Erreur de connexion au serveur");
            setIsLoading(false);
        }
    }

    async function handleOAuthLogin(provider: 'google' | 'discord') {
        if (!supabase || !hasSupabaseConfig) {
            setError("OAuth indisponible : configuration Supabase manquante.");
            return;
        }

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

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold">Compte créé avec succès !</h2>
                <p className="text-muted-foreground">Redirection vers la configuration de votre profil...</p>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
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
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Role selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all ${role === "ARTIST" ? "border-primary bg-accent" : "border-muted"
                            }`}
                        onClick={() => setRole("ARTIST")}
                    >
                        <Music2 className="mb-2 h-6 w-6" />
                        <div className="font-semibold">Artiste</div>
                        <div className="text-xs text-muted-foreground">
                            Je cherche des services
                        </div>
                    </div>
                    <div
                        className={`cursor-pointer rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all ${role === "PROVIDER" ? "border-primary bg-accent" : "border-muted"
                            }`}
                        onClick={() => setRole("PROVIDER")}
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
                                <Label htmlFor="firstName">Prénom *</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    required
                                    disabled={isLoading}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom *</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    required
                                    disabled={isLoading}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email *</Label>
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
                            <Label htmlFor="password">Mot de passe *</Label>
                            <Input
                                id="password"
                                type="password"
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {password.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                                    <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordChecks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        8+ caractères
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordChecks.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordChecks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        1 majuscule
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordChecks.lowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordChecks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        1 minuscule
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordChecks.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordChecks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                        1 chiffre
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                disabled={isLoading}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {confirmPassword.length > 0 && (
                                <div className={`flex items-center gap-1 text-xs ${doPasswordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                    {doPasswordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                    {doPasswordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                                </div>
                            )}
                        </div>
                        <Button disabled={isLoading || !isPasswordValid || !doPasswordsMatch}>
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
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button" disabled={isLoading || !hasSupabaseConfig} onClick={() => handleOAuthLogin('google')} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                        <Icons.google className="h-5 w-5" />
                        <span className="sr-only">Google</span>
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading || !hasSupabaseConfig} onClick={() => handleOAuthLogin('discord')} className="bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/20 hover:text-[#5865F2]">
                        <Icons.discord className="h-5 w-5" />
                        <span className="sr-only">Discord</span>
                    </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                    En créant un compte, vous acceptez nos{" "}
                    <Link href="/terms" className="underline hover:text-primary">
                        conditions d&apos;utilisation
                    </Link>
                    .
                </p>
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
